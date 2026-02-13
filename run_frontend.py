from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__, template_folder='src/frontend/templates', static_folder='src/frontend/static')
CORS(app)

BACKEND_URL = os.getenv('BACKEND_URL', 'http://localhost:8000/ask')


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json
    user_query = data.get("message", "").strip()
    
    if not user_query:
        return jsonify({
            "success": False,
            "error": "Message cannot be empty"
        }), 400
    
    try:
        response = requests.post(
            BACKEND_URL,
            json={"query": user_query},
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            return jsonify({
                "success": True,
                "response": result.get("response", "No response received"),
                "query": user_query
            })
        else:
            error_data = response.json()
            return jsonify({
                "success": False,
                "error": error_data.get("detail", "Backend error")
            }), response.status_code
    
    except requests.exceptions.Timeout:
        return jsonify({
            "success": False,
            "error": "Request timeout. Please try again."
        }), 504
    
    except requests.exceptions.ConnectionError:
        return jsonify({
            "success": False,
            "error": "Cannot connect to backend. Ensure FastAPI is running on port 8000."
        }), 503
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Error: {str(e)}"
        }), 500


@app.route("/health")
def health():
    return jsonify({"status": "healthy", "service": "Frontend"})


if __name__ == "__main__":
    print("\n" + "="*60)
    print("🌐 University Admissions Bot - Frontend")
    print("="*60)
    print("📱 Chatbot UI: http://localhost:5000")
    print("="*60 + "\n")
    app.run(debug=True, port=5000)
