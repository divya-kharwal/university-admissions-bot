# University Admissions Bot v2.0

AI-powered chatbot for university admission queries using Google Gemini.

---

## Overview

University Admissions Bot is a full-stack AI web application that provides instant answers about:

* Eligibility criteria
* Admission process
* Application deadlines
* Scholarships and financial aid
* University policies

It uses **Google Gemini 2.5 Flash** for intelligent response generation.

---

## Tech Stack

* **Backend:** FastAPI
* **Frontend:** Flask + HTML/CSS/JavaScript
* **AI Engine:** Google Gemini API
* **Validation:** Pydantic
* **Server:** Uvicorn

---

## Architecture

Layered Architecture:

```
Frontend (Flask UI)
        ↓
Backend (FastAPI)
        ↓
Service Layer (Gemini Integration)
        ↓
Google Gemini API
```

---

## Core Features

* Markdown-formatted responses
* Clean responsive user interface
* Batch question support
* Error handling and timeout management
* Secure API key management using `.env`
* Interactive API documentation at `/docs`

---

## API Endpoints

| Method | Endpoint     | Purpose             |
| ------ | ------------ | ------------------- |
| GET    | `/health`    | Check server status |
| POST   | `/ask`       | Single question     |
| POST   | `/ask-batch` | Multiple questions  |

---

## Performance

* Response time under 3 seconds
* Lightweight memory usage
* Supports concurrent users

---

## Future Improvements

* User authentication
* Conversation history storage
* Database integration
* Docker deployment
* WebSocket-based real-time chat

---

## Conclusion

This project demonstrates:

* Full-stack development skills
* REST API design
* AI integration using Gemini
* Clean modular architecture

---

**Developed by Divya Kharwal**
B.Tech Computer Science Engineering
