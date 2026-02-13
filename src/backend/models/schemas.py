from pydantic import BaseModel, Field
from typing import Optional


class QueryRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=1000, description="User's question about admissions")


class QueryResponse(BaseModel):
    query: str = Field(..., description="The original user query")
    response: str = Field(..., description="The assistant's response")
    success: bool = Field(default=True, description="Operation status")


class ErrorResponse(BaseModel):
    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Additional error details")
    success: bool = Field(default=False, description="Operation status")
