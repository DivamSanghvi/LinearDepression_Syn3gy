from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
load_dotenv()
import os
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

from youtube_transcript_api import YouTubeTranscriptApi

def extract_transcript(video):
    try:
        video = VideoFileClip(video)
        audio_file = video.audio
        audio_file.write_audiofile("1.wav")

        # Load the audio file
        with open("1.wav", "rb") as audio_file:
            audio_content = audio_file.read()

        # Initialize OpenAI Whisper model
        openai_api_key = os.getenv("OPENAI_API_KEY")
        llm = OpenAI(api_key=openai_api_key, model="whisper-1")

        # Create a prompt template
        prompt_template = PromptTemplate(
            input_variables=["audio_content"],
            template="Transcribe the following audio content: {audio_content}"
        )

        # Generate the transcript
        transcript_text = llm(prompt_template.format(audio_content=audio_content))
        print(transcript_text)

        return transcript_text
    except Exception as e:
        print(f"Error extracting transcript: {e}")
        return None 
# Example usage
# youtube_video_url = "https://www.youtube.com/watch?v=oW7USk5x4do"
# transcript_text = extract_transcript(youtube_video_url)
# print(transcript_text)

def generate_keywords(video):
    transcript_text = extract_transcript(video)
    prompt = """
   You are an expert at recognising key words from the provided transcript. I will provide you with a transcript of a video,
    and you need to generate a list of keywords based on the content of the video.
    The format should be a comma-separated list of keywords.
    The keywords should be single words or phrases that are relevant to the content of the video.
    The keywords should be such that they help the student understand the main topics discussed in the video.
    The keywords should be in lowercase and separated by commas.
    """


    llm = ChatGroq(temperature=0, groq_api_key=GROQ_API_KEY, model_name="llama-3.1-8b-instant")

    # Build the full prompt with the transcript text
    actual_prompt = ChatPromptTemplate.from_messages([
        ("system", prompt + transcript_text),
        ("human", "{input}")
    ])

    chain = actual_prompt | llm
    response = chain.invoke({"input": "generate keywords from the information provided"})
    
    # Return the notes content
    return response.content

# a = generate_notes_from_yt_in("https://www.youtube.com/watch?v=oW7USk5x4do") best file
# print(a['notes'])
# generate_notes_from_yt_in("https://www.youtube.com/watch?v=5iTOphGnCtg&t")

words = generate_keywords('1.mp4')
print(words)
