from flask import Flask, request, jsonify
from flask_cors import CORS
from viva_tool_final import generate_viva_questions_and_answer, generate_feedback
from yt_notes import generate_notes_from_yt_in  # Import the function from yt_notes.py
from dotenv import load_dotenv
from quiz import generate_quiz  # Import the generate_quiz function
import os
import warnings
import tempfile
warnings.filterwarnings("ignore")

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Welcome to the Linear Depression Prediction API!"


@app.route('/viva', methods=['POST']) #Route for viva_tool_final.py
def viva():
    try:
        global viva_chat_history
        data = request.get_json()
        topics = data.get("topics", "")

        if not topics:
            return jsonify({"error": "No topics provided"}), 400

        question, answer = generate_viva_questions_and_answer(topics, viva_chat_history)
        return jsonify({"question": question, "answer": answer}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/viva/feedback', methods=['POST']) #Route for viva_tool_final.py
def viva_feedback():
    print("Feedback endpoint called")
    global viva_chat_history
    try:
        data = request.form
        print("Received data:", data)
        question = data.get("question", "")
        answer = data.get("answer", "")
        user_answer = data.get("user_answer", "")

        if not question or not answer or not user_answer:
            print("Missing required fields")
            return jsonify({"error": "Missing required fields"}), 400

        if 'audio_file' not in request.files:
            print("No audio file provided")
            return jsonify({"error": "No audio file provided"}), 400
        audio_file = request.files['audio_file']
        print("Received audio file:", audio_file.filename)

        # Save the audio file locally
        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_audio_file:
            audio_file.save(temp_audio_file.name)
            temp_audio_file_path = temp_audio_file.name
        print("Saved audio file to:", temp_audio_file_path)
        
        # Send the filename to the query function
        sentiment_scores = query(temp_audio_file_path)
        print("Sentiment scores:", sentiment_scores)
        
        # Remove the locally stored audio file
        os.remove(temp_audio_file_path)
        print("Removed audio file:", temp_audio_file_path)
        
        feedback = generate_feedback(question, answer, user_answer, viva_chat_history, sentiment_scores)
        print("Feedback generated:", feedback)
        
        return jsonify({"feedback": feedback, "sentiment_scores": sentiment_scores}), 200
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500
    
@app.route('/yt_notes', methods=['POST']) #Route for yt_notes.py
def yt_notes():
    try:
        data = request.get_json()
        youtube_url = data.get("youtube_url", "")

        if not youtube_url:
            return jsonify({"error": "No YouTube URL provided"}), 400

        notes = generate_notes_from_yt_in(youtube_url)
        return jsonify({"notes": notes}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/quiz', methods=['POST']) # New route for generating quiz questions
def quiz():
    try:
        data = request.get_json()
        topic = data.get("topic", "")
        num_questions = data.get("num_questions", 5)

        if not topic:
            return jsonify({"error": "No topic provided"}), 400

        quiz_questions = generate_quiz(topic, num_questions)
        return jsonify({"quiz_questions": quiz_questions}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

if __name__ == '__main__':
    app.run(debug=True, port=5001)