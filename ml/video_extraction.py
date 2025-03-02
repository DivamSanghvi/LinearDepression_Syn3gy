from pytubefix import YouTube  # Ensure pytube is installed and working
from audio_extract import extract_audio
import os
from groq import Groq
from dotenv import load_dotenv
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY)

def download_video(youtube_url, output_path="video.mp4"):
    yt = YouTube(youtube_url)
    stream = yt.streams.filter(progressive=True, file_extension='mp4').first()
    stream.download(filename=output_path)
    print(f"Download complete! Saved as {output_path}")
    return output_path

def transcribe_audio(audio_path):
    filename = audio_path
    with open(filename, "rb") as file:
        transcription = client.audio.transcriptions.create(
            file=(filename, file.read()),
            model="whisper-large-v3-turbo",
            temperature=0.0  # Optional
        )
    return transcription.text

def get_transcription(input_file):
    if input_file.startswith("http://") or input_file.startswith("https://"):
        video_path = download_video(input_file)
    else:
        video_path = input_file

    audio_output_path = "audio.mp3"
    if os.path.exists(audio_output_path):
        os.remove(audio_output_path)
        print(f"Removed existing file: {audio_output_path}")

    extract_audio(input_path=video_path, output_path=audio_output_path)
    print("Extracted audio from video")
    transcript = transcribe_audio(audio_output_path)
    return transcript

# if __name__ == "__main__":
#     input_file = input("Enter a file path or YouTube URL: ")
#     transcript = get_transcription(input_file)
#     print("Transcript:")
#     print(transcript)