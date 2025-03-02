import os
from groq import Groq
from dotenv import load_dotenv
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY)

from youtube_transcript_api import YouTubeTranscriptApi

def get_transcript_with_timestamps(youtube_url):
    video_id = youtube_url.split("=")[-1]
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    
    # Extracting start time, end time, and text
    transcript_data = [
        {
            "start": entry["start"],
            "end": entry["start"] + entry["duration"],
            "text": entry["text"]
        }
        for entry in transcript
    ]
    
    return transcript_data


def get_transcript_text(youtube_url):
    video_id = youtube_url.split("=")[-1]
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    
    # Extracting text
    transcript_text = "".join([entry["text"] for entry in transcript])
    return transcript_text

# if __name__ == "__main__":
#     full_trans = get_transcript_with_timestamps("https://www.youtube.com/watch?v=FMtayizdFiw")
#     only_text = get_transcript_text("https://www.youtube.com/watch?v=FMtayizdFiw")
#     print(only_text)
#     print(full_trans)


