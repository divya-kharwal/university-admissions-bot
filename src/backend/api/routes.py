from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv

from src.backend.models.schemas import QueryRequest, QueryResponse, ErrorResponse
from src.backend.services.gemini_service import GeminiService

load_dotenv()

gemini_service = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global gemini_service
    try:
        gemini_service = GeminiService()
        print("✓ Admissions Bot initialized successfully")
        print("✓ Gemini API configured")
    except ValueError as e:
        print(f"✗ Error during startup: {str(e)}")
        raise
    
    yield
    
    print("✓ Admissions Bot shutting down...")


def create_app() -> FastAPI:
    app = FastAPI(
        title="University Admissions Bot API",
        description="AI-powered API for university admissions assistance",
        version="2.0.0",
        lifespan=lifespan
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/", tags=["Health"])
    async def root():
        return {
            "message": "Welcome to University Admissions Bot API",
            "status": "running",
            "docs": "/docs",
            "version": "2.0.0"
        }

    @app.get("/health", tags=["Health"])
    async def health_check():
        return {
            "status": "healthy",
            "service": "University Admissions Bot"
        }

    @app.post(
        "/ask",
        response_model=QueryResponse,
        tags=["Admissions Assistance"],
        summary="Submit an admissions question",
        description="Submit a question about university admissions and receive AI-powered guidance"
    )
    async def ask_question(request: QueryRequest) -> QueryResponse:
        if not request.query or not request.query.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Query cannot be empty"
            )
        
        if gemini_service is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Bot service not initialized. Check your API key."
            )
        
        try:
            response = await gemini_service.answer_question(request.query)
            return QueryResponse(
                query=request.query,
                response=response,
                success=True
            )
        
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid request: {str(e)}"
            )
        
        except Exception as e:
            error_message = str(e)
            if "API key" in error_message or "authentication" in error_message.lower():
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Authentication failed. Check your Gemini API key."
                )
            
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error processing question: {error_message}"
            )

    @app.post("/ask-batch", tags=["Admissions Assistance"])
    async def ask_multiple_questions(requests: list[QueryRequest]):
        results = []
        for req in requests:
            try:
                response = await gemini_service.answer_question(req.query)
                results.append(QueryResponse(
                    query=req.query,
                    response=response,
                    success=True
                ))
            except Exception as e:
                results.append({
                    "query": req.query,
                    "response": f"Error: {str(e)}",
                    "success": False
                })
        return results

    @app.exception_handler(404)
    async def not_found_handler(request, exc):
        return {
            "error": "Endpoint not found",
            "detail": "Visit /docs for available endpoints",
            "success": False
        }

    return app
