from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from openai import OpenAI
import os
app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

openai.api_key = os.getenv("2tjs5s02rw1wl8iye2mdc1dshsxxs487")
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message')

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": user_message}],
            max_tokens=150,
            temperature=0.7,
        )
        answer = response.choices[0].message.content
        return jsonify({"reply": answer})

    except Exception as e:
        print("❌ OpenAI API error:", e)
        return jsonify({"reply": f"Error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
