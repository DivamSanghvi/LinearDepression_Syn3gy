from youtube_transcript_api import YouTubeTranscriptApi

def get_transcript_with_timestamp(youtube_url):
    video_id = youtube_url.split("=")[-1]
    transcript = YouTubeTranscriptApi.get_transcript(video_id)

    transcript_data = [
        {
            "start": entry["start"],
            "end": entry["start"] + entry["duration"],
            "text": entry["text"]
        }
        for entry in transcript
    ]

    interval = 120  # 30 seconds
    grouped_transcript = []
    current_start = transcript_data[0]["start"]
    current_text = []
    
    for entry in transcript_data:
        if entry["start"] - current_start < interval:
            current_text.append(entry["text"])
        else:
            # Append the current 30s chunk
            grouped_transcript.append({
                "start": current_start,
                "end": current_start + interval,
                "text": " ".join(current_text)
            })
            current_start = entry["start"]
            current_text = [entry["text"]]

    # Handle remaining text (if less than 30s left)
    if current_text:
        grouped_transcript.append({
            "start": current_start,
            "end": transcript_data[-1]["end"],  # Ends at the last available subtitle
            "text": " ".join(current_text)
        })

    return grouped_transcript

# # Example usage
# youtube_url = "https://www.youtube.com/watch?v=FMtayizdFiw"
# transcript_info = get_transcript_with_30s_intervals(youtube_url)
# print(transcript_info)

