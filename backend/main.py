from fastapi import FastAPI
from backend.api.v1.router import api_router

app = FastAPI(
    title="FastRAG API",
    description="Backend RAG modulaire avec FastAPI, LlamaIndex, Groq et Sentence-Transformers (Local)",
    version="1.0.0"
)

# Inclusion des routes v1
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "FastRAG est opérationnel. Rendez-vous sur /docs pour tester l'API."}