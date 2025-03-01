import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate

# Load the GROQ API key from environment variables
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Initialize the ChatGroq instance
llm = ChatGroq(temperature=0.5, groq_api_key=GROQ_API_KEY, model_name="llama-3.1-8b-instant")

# Define the JSON schema
json_schema = {
    "title": "mcq quiz generator",
    "description": "Gives the quiz questions and correct answer and 4 options for each question and a hint for each question",
    "type": "object",
    "properties": {
        "question": {
            "type": "string",
            "description": "Give the quiz question"
        },
        "all_4_options": {
            "type": "object",
            "description": "All the 4 options for the question as a) b) c) d). There should be only 4 options",
            "properties": {
                "a": {"type": "string"},
                "b": {"type": "string"},
                "c": {"type": "string"},
                "d": {"type": "string"}
            }
        },
        "correct_answer": {
            "type": "string",
            "description": "The correct answer to the question."
        },
        "correct_answer_option": {
            "type": "string",
            "description": "The correct option (a, b, c, or d) corresponding to the correct answer."
        },
        "hint": {
            "type": "string",
            "description": "A hint for the question",
            "default": None
        }
    },
    "required": ["question", "correct_answer", "all_4_options", "hint"]
}

# Chain the LLM to the structured output
structured_llm = llm.with_structured_output(json_schema)

def generate_quiz(topic, num_questions):
    quiz_questions = []  # contains all the quiz questions
    history = ""

    # Create a prompt template
    prompt_template = PromptTemplate.from_template("""
    You are a quiz generator. Generate a multiple-choice question (MCQ) on the topic of {topic}.
    Provide the question, four options labeled a, b, c, and d, the correct answer along with the correct option, and a hint.
    Ensure there are exactly four options.
    THE FORMAT SHOULD BE LIKE THIS STRICTLY like the one specified in the schema.
    Here are the questions that have already been generated:
    {history}
    THERE SHOULD BE NO DUPLICATE QUESTIONS STRICTLY.
    So these questions or related questions should not be generated again. Every question should be unique.
    """)

    for _ in range(num_questions):
        prompt = prompt_template.invoke({"topic": topic, "history": history})
        response = structured_llm.invoke(prompt)
        
        # Check if the response contains the required keys
        if all(key in response for key in ["question", "correct_answer", "all_4_options", "hint"]):
            quiz_questions.append(response)
            history += f"\nQuestion: {response['question']}\nOptions: {response['all_4_options']}\n"
        else:
            raise ValueError("Response does not contain all required keys")

    return quiz_questions

# Uncomment the following lines to test the generate_quiz function individually
# if __name__ == "__main__":
#     topic = "Python"
#     num_questions = 5
#     quiz_questions = generate_quiz(topic, num_questions)
#     for i, quiz in enumerate(quiz_questions, 1):
#         print(f"Quiz Question {i}:")
#         print(quiz)
#         print("\n")