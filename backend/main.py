from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.v1.router import api_router
from core.config import settings


app = FastAPI(
    title="FastRAG API",
    description="Backend RAG modulaire avec FastAPI, LlamaIndex, Groq et Sentence-Transformers (Local)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusion des routes v1
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "FastRAG est opérationnel. Rendez-vous sur /docs pour tester l'API."}