import uvicorn
from src.backend.api.routes import create_app

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🎓 University Admissions Bot - Backend API")
    print("="*60)
    print("📍 API: http://localhost:8000")
    print("📍 Docs: http://localhost:8000/docs")
    print("📍 ReDoc: http://localhost:8000/redoc")
    print("="*60 + "\n")
    
    app = create_app()
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
