# University Admissions Bot v2.0

An AI-powered chatbot that helps students get answers about university admissions using Google Gemini AI.

## Project Overview

The University Admissions Bot is a web application that helps students get quick answers about admissions requirements, procedures, and policies.

**Technology Stack:**
- **Backend**: FastAPI + Python 3.8+
- **Frontend**: Flask + HTML5/CSS3/JavaScript
- **AI Engine**: Google Gemini API 2.5 Flash
- **Architecture**: Layered (Models → Services → API)

---

## Key Features

### 1. Markdown Rendering
- Support for headings, bold, italic, and code
- Ordered and unordered lists
- Security protection
- Clean formatting

### 2. Organized Architecture
```
src/
├── backend/              # FastAPI backend layer
│   ├── api/             # Route handlers
│   ├── services/        # Business logic (Gemini integration)
│   └── models/          # Pydantic data models
├── frontend/            # Flask frontend layer
│   ├── static/          # CSS, JavaScript
│   └── templates/       # HTML templates
└── config/              # Configuration management
```

### 3. Modern User Interface
- Clean, simple design
- Works on all devices (mobile, tablet, desktop)
- Quick buttons for common questions
- Loading indicators
- Online status display

### 4. Smart Bot Configuration
The bot is configured with university policies including:
- Merit-based admission standards
- Application deadlines and procedures
- Academic integrity policies
- Non-discrimination and inclusion policies
- Scholarship and financial aid guidelines
- Program-specific requirements
- Student support services

### 5. Error Handling
- Clear error messages
- Connection error handling
- API timeout management (30 seconds)
- Request validation
- Authentication error detection
- Batch question processing

### 6. API Documentation
- Interactive API testing at /docs
- Alternative documentation at /redoc
- Clear endpoint descriptions

---

## Project Structure

```
university-admissions-bot/
│
├── src/                              # Source code layer
│   ├── backend/                     # Backend layer
│   │   ├── api/
│   │   │   └── routes.py           # FastAPI endpoints
│   │   ├── services/
│   │   │   └── gemini_service.py   # Gemini API integration
│   │   └── models/
│   │       └── schemas.py          # Pydantic models
│   │
│   └── frontend/                    # Frontend layer
│       ├── static/
│       │   ├── style.css           # CSS 
│       │   └── script.js           # Advanced JavaScript
│       └── templates/
│           └── index.html          # Modern HTML template
│
├── run_backend.py                  # Backend entry point
├── run_frontend.py                 # Frontend entry point
├── requirements.txt                # Dependencies
├── .env                            # Environment variables
├── .env.example                    # Template
└── README.md                       # This file
```

---

## Installation and Setup

### Requirements
- Python 3.8 or higher
- pip (Python package manager)
- Google Gemini API Key (free from [AI Studio](https://aistudio.google.com/app/apikey))

### Step 1: Clone/Download Project
```bash
cd university-admissions-bot
```

### Step 2: Create Virtual Environment
**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Configure API Key
1. Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Open `.env` file
3. Replace `your_api_key_here` with your actual key:
```
GEMINI_API_KEY=your_actual_key_here
```

### Step 5: Run the Application

**Option A: Run Both Servers**
```bash
# Terminal 1 - Backend
python run_backend.py

# Terminal 2 - Frontend
python run_frontend.py
```

**Option B: Run Individually**
```bash
# Backend only
python run_backend.py

# Frontend only
python run_frontend.py
```

### Step 6: Access the Application
Open your browser and visit: **http://localhost:5000**

---

## API Endpoints

### Health Checks
```bash
GET /health
GET /
```

### Chat Endpoints
```bash
# Single question
POST /ask
Content-Type: application/json

{
  "query": "What are the eligibility criteria for BTech?"
}

# Batch questions
POST /ask-batch
Content-Type: application/json

[
  {"query": "What is the application deadline?"},
  {"query": "What documents do I need?"}
]
```

### Response Format
```json
{
  "query": "What are the eligibility criteria?",
  "response": "Based on our admission standards...",
  "success": true
}
```

---

## Testing with cURL

### Test 1: Health Check
```bash
curl -X GET http://localhost:8000/health
```

### Test 2: Ask a Question
```bash
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{"query": "What are BTech eligibility criteria?"}'
```

### Test 3: Batch Questions
```bash
curl -X POST http://localhost:8000/ask-batch \
  -H "Content-Type: application/json" \
  -d '[
    {"query": "Tell me about scholarships"},
    {"query": "What is the deadline?"}
  ]'
```

---

## API Documentation

Access interactive API docs at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## Example Questions to Try

1. "What are the eligibility criteria for BTech programs?"
2. "What documents do I need to submit?"
3. "What is the application deadline?"
4. "Tell me more about scholarships and financial aid"
5. "What is the admission process?"
6. "Are there any merit-based scholarships?"
7. "How long does the admission process take?"
8. "What is your non-discrimination policy?"
9. "Can international students apply?"
10. "How can I check my application status?"

---
## Configuration

### Environment Variables (.env)
```
GEMINI_API_KEY=your_api_key_here
BACKEND_URL=http://localhost:8000/ask (used by frontend)
```

### Backend Settings (run_backend.py)
- Host: 0.0.0.0 (all interfaces)
- Port: 8000
- Log Level: info

### Frontend Settings (run_frontend.py)
- Host: 127.0.0.1 (localhost)
- Port: 5000
- Debug: True

---
## Performance

**Current Performance:**
- Response time: Less than 3 seconds
- Supports multiple users at once
- Low memory usage (less than 100MB)

**Future Improvements:**
- Add caching for faster responses
- Implement rate limiting
- Deploy with Gunicorn and Nginx
- Add WebSocket support for real-time chat
- Add conversation history database

---

## Future Enhancements

- User login and signup
- Conversation history storage
- Analytics to track popular questions
- Multi-language support
- Document upload feature
- Calendar for scheduling appointments
- Feedback rating system
- Advanced security with encryption
- Mobile app for iOS and Android
- Custom AI training for university data

---

## Dependencies

```
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-dotenv==1.0.0
google-generativeai==0.3.0
pydantic==2.5.0
flask==3.0.0
flask-cors==4.0.0
requests==2.31.0
```

---

## License and Usage

This project is provided for educational and institutional use.

---

## Quick Reference

| Task | Command |
|------|---------|
| Install dependencies | `pip install -r requirements.txt` |
| Run backend | `python run_backend.py` |
| Run frontend | `python run_frontend.py` |
| Test API | `curl http://localhost:8000/health` |
| View docs | http://localhost:8000/docs |
| Frontend UI | http://localhost:5000 |

---

## Contributor

**Developed by:** Divya Kharwal

---
Made for aspiring students  
University Admissions Bot
