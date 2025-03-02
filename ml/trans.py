import whisper

# Load Whisper model
model = whisper.load_model("small")  # or "tiny"


# Transcribe video file
result = model.transcribe(r"C:\Users\admin\Videos\4.5 0_1 Knapsack - Two Methods - Dynamic Programming.mp4")

# Print transcription with timestamps
for segment in result['segments']:
    print(f"[{segment['start']:.2f} - {segment['end']:.2f}]: {segment['text']}")

# Save transcription to a file
with open("transcription.txt", "w", encoding="utf-8") as f:
    for segment in result['segments']:
        f.write(f"[{segment['start']:.2f} - {segment['end']:.2f}]: {segment['text']}\n")

print("Transcription saved to transcription.txt")
