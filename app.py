from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
  
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    # Dummy response — replace this with your own logic if needed
    reply = f"You said: {user_message}"
    return jsonify({'reply': reply})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
