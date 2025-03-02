import os
import openai
import json
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from flask import Flask, request, jsonify, send_file
from dotenv import load_dotenv

# Load API Key from .env
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)

@app.route('/process_transcript', methods=['POST'])
def process_transcript():
    """
    Flask API that extracts key topics, provides detailed explanations,
    generates structured numerical data, and creates multiple relevant graphs.
    """
    try:
        # Get transcript from request
        data = request.get_json()
        transcript = data.get("transcript")

        if not transcript:
            return jsonify({"error": "No transcript provided"}), 400

        transcript_text = "\n".join([seg["text"] for seg in transcript])

        # Step 1: Extract Key Topics + Explanations
        key_concepts_prompt = f"""
        Extract key topics from this lecture and provide a structured explanation for each.
        Return JSON strictly in this format:
        {{
          "topics": [
            {{
              "title": "Topic 1",
              "description": "Detailed explanation of topic 1",
              "graph_type": "bar"  # Choose from 'bar', 'line', 'pie', 'scatter'
            }},
            {{
              "title": "Topic 2",
              "description": "Detailed explanation of topic 2",
              "graph_type": "line"
            }},
            {{
                "title": "Topic 3",
                "description": "Detailed explanation of topic 3",
                "graph_type": "pie"
            }}
            .
            .
            .
            .
          ]
        }}

        Transcript:
        {transcript_text}

        Ensure JSON format, no extra text.
        """

        key_concepts_response = openai.chat.completions.create(
            model="gpt-4-turbo",
            messages=[{"role": "user", "content": key_concepts_prompt}]
        )

        key_concepts_json = key_concepts_response.choices[0].message.content.strip("```json").strip("```")
        
        try:
            key_concepts = json.loads(key_concepts_json)
        except json.JSONDecodeError:
            return jsonify({"error": "Invalid JSON from GPT-4"}), 500

        # Step 2: Generate Example Data for Graphs
        topic_titles = [topic["title"] for topic in key_concepts["topics"]]
        graph_urls = []

        for topic in key_concepts["topics"]:
            graph_type = topic["graph_type"]

            data_prompt = f"""
            Generate structured numerical data in JSON format for visualizing '{topic['title']}' in a {graph_type} graph.
            The response should be:
            {{
              "labels": ["Label1", "Label2", "Label3"],
              "values": [50, 75, 25]
            }}
            Ensure values are between 10 and 100.

            Return ONLY JSON format.
            """

            data_response = openai.chat.completions.create(
                model="gpt-4-turbo",
                messages=[{"role": "user", "content": data_prompt}]
            )

            data_json = data_response.choices[0].message.content.strip("```json").strip("```")
            
            try:
                graph_data = json.loads(data_json)
            except json.JSONDecodeError:
                return jsonify({"error": f"Invalid data for {topic['title']}"}), 500

            # Step 3: Generate Graph
            graph_path = generate_graph(topic["title"], graph_data, graph_type)
            graph_urls.append({
                "topic": topic["title"],
                "graph_url": f"http://127.0.0.1:5000/{graph_path}"
            })

        return jsonify({
            "explanation": key_concepts["topics"],  
            "graphs": graph_urls
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def generate_graph(topic, data, graph_type):
    """
    Generates a graph based on topic type (bar, line, pie, scatter).
    """
    if not os.path.exists("static"):
        os.makedirs("static")

    plt.figure(figsize=(8, 5))
    sns.set_style("whitegrid")

    graph_path = f"static/{topic.replace(' ', '_')}.png"  

    labels = data["labels"]
    values = data["values"]

    if graph_type == "bar":
        plt.bar(labels, values, color=sns.color_palette("muted"))
        plt.title(f"Bar Chart: {topic}")
        plt.xlabel("Categories")
        plt.ylabel("Values")

    elif graph_type == "line":
        plt.plot(labels, values, marker="o", linestyle="-", color="blue")
        plt.title(f"Line Graph: {topic}")
        plt.xlabel("Time")
        plt.ylabel("Trends")

    elif graph_type == "pie":
        plt.pie(values, labels=labels, autopct="%1.1f%%", colors=sns.color_palette("pastel"))
        plt.title(f"Pie Chart: {topic}")

    elif graph_type == "scatter":
        x = np.arange(len(labels))
        plt.scatter(x, values, color="red")
        plt.xticks(x, labels)
        plt.title(f"Scatter Plot: {topic}")
        plt.xlabel("X-axis")
        plt.ylabel("Values")

    plt.savefig(graph_path)
    plt.close()
    
    return graph_path


@app.route('/static/<filename>')
def get_graph(filename):
    """Serve generated graph images"""
    return send_file(f"static/{filename}", mimetype='image/png')


if __name__ == '__main__':
    app.run(debug=True)
