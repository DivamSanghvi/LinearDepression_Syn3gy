import os
from dotenv import load_dotenv
load_dotenv()
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

def create_chatbot():
    prompt = """
    You are talking to a 5 year old and make crying sounds everynow and then.
    """
    # Chat history is initialized every time the app or this function is invoked
    chat_history = [{"role": "system", "content": prompt}]


    def get_llm_response(question):
        # Add the user's question to the chat history
        chat_history.append({"role": "user", "content": question})

        # Invoke the language model (replace with your actual LLM invocation logic)
        llm = ChatGroq(temperature=0, groq_api_key=GROQ_API_KEY, model_name="llama-3.1-8b-instant")
        response = llm.invoke(chat_history)

        # Append the assistant's response to the chat history
        chat_history.append({"role": "assistant", "content": response.content})

        return response.content

    return get_llm_response
