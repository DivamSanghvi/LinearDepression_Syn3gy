from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/')
def home():
    return "Welcome to the Linear Depression Prediction API!"

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    # Here you would add your prediction logic
    # For now, let's just return the received data
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)