from pinecone import Pinecone
import json
import uuid
from dotenv import load_dotenv
import os
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq

# Load environment variables
load_dotenv()
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Initialize Pinecone
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index("synergy")

def store_embeddings(json_file = "transcripts_with_timestamps.json", namespace="ns1"):
    """Clear existing data, load JSON, generate embeddings, and upsert to Pinecone."""
    # Delete all vectors in the namespace before inserting new ones
    # index.delete(delete_all=True, namespace=namespace)
    # print(f"Cleared all data in namespace '{namespace}'")
    
    # Load JSON file
    with open(json_file, "r") as f:
        data = json.load(f)
    
    # Generate embeddings
    embeddings = pc.inference.embed(
        model="llama-text-embed-v2",
        inputs=[d['text'] for d in data],
        parameters={"input_type": "passage"}
    )
    
    # Prepare vectors for upsert
    vectors = [
        {
            "id": str(uuid.uuid4()),
            "values": e['values'],
            "metadata": {"text": d['text'], "start": d['start'], "end": d['end']}
        }
        for d, e in zip(data, embeddings)
    ]
    
    # Upsert embeddings into Pinecone
    index.upsert(vectors=vectors, namespace=namespace)
    print(f"Upserted {len(vectors)} documents into Pinecone namespace '{namespace}'")

def query_pinecone(query, namespace="ns1", top_k=2):
    """Query Pinecone and generate an answer using relevant documents."""
    # Generate query embedding
    query_embedding = pc.inference.embed(
        model="multilingual-e5-large",
        inputs=[query],
        parameters={"input_type": "query"}
    )
    
    # Search for similar documents
    results = index.query(
        namespace=namespace,
        vector=query_embedding[0]['values'],
        top_k=top_k,
        include_values=False,
        include_metadata=True
    )
    
    # Extract relevant text
    relevant_text = "---".join([i.metadata['text'] for i in results.matches])
    
    return answer_using_relevant_text(query, relevant_text)

def answer_using_relevant_text(query, relevant_text):
    """Generate an answer using retrieved relevant text."""
    prompt = """
    Your role is to answer the question based on the information provided.
    Be concise and to the point. Keep your answer short and simple using the information given yet comprehensive.
    Answer the question using the information provided.
    """
    
    llm = ChatGroq(temperature=0, groq_api_key=GROQ_API_KEY, model_name="llama-3.1-8b-instant")
    
    # Build the full prompt with the transcript text
    actual_prompt = ChatPromptTemplate.from_messages([
        ("system", prompt + relevant_text),
        ("human", "{input}")
    ])
    
    chain = actual_prompt | llm
    inputt = f"Answer the question: {query} using the provided information"
    response = chain.invoke({"input": inputt})
    
    return response.content

# store_embeddings()
# response = query_pinecone("what crystals are we talking about?")
# print(response)
