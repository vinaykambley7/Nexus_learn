from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import numpy as np

app = FastAPI(
    title="NexusLearn AI Microservice",
    description="FastAPI service for semantic vector search, pgvector similarity scoring, and AI tutor assistance.",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SemanticSearchQuery(BaseModel):
    query: str = Field(..., description="The query string to embed and search")
    top_k: int = Field(default=5, ge=1, le=20)
    track_filter: Optional[str] = None

class SearchResultItem(BaseModel):
    document_id: str
    title: str
    snippet: str
    similarity_score: float

class EmbedResponse(BaseModel):
    embedding_dim: int
    vector_preview: List[float]

@app.get("/")
def read_root():
    return {
        "service": "NexusLearn AI Microservice",
        "status": "operational",
        "supported_models": ["text-embedding-3-small", "claude-3-7-sonnet", "gemini-2-0-flash"]
    }

@app.post("/api/v1/search/semantic", response_model=List[SearchResultItem])
def semantic_search(payload: SemanticSearchQuery):
    """
    Simulates high-speed vector retrieval matching against indexed curriculum documents.
    """
    mock_results = [
        SearchResultItem(
            document_id="doc-rag-01",
            title="Enterprise RAG with Supabase pgvector",
            snippet="Cosine distance indexing with HNSW enables sub-millisecond approximate nearest neighbor searches across 1536-dimensional embeddings.",
            similarity_score=0.942
        ),
        SearchResultItem(
            document_id="doc-react-02",
            title="React 19 Action Hooks & Transitions",
            snippet="useActionState automatically wraps form actions in React transitions, providing pending status and optimistic updates.",
            similarity_score=0.887
        ),
        SearchResultItem(
            document_id="doc-cursor-03",
            title="Cursor IDE Codebase Indexing",
            snippet="Cursor builds multi-file embeddings to allow natural language prompt refactors across the entire repository with Composer.",
            similarity_score=0.841
        )
    ]
    return mock_results[:payload.top_k]

@app.post("/api/v1/embeddings/generate", response_model=EmbedResponse)
def generate_embedding(text: str):
    """
    Generates a 1536-dimensional vector embedding for storage in PostgreSQL pgvector.
    """
    # Deterministic mock normalized vector based on string hash
    np.random.seed(abs(hash(text)) % (2**32))
    vec = np.random.randn(1536)
    normalized = vec / np.linalg.norm(vec)
    return EmbedResponse(
        embedding_dim=1536,
        vector_preview=normalized[:5].tolist()
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
