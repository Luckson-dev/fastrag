from llama_index.core import VectorStoreIndex
from llama_index.vector_stores.postgres import PGVectorStore
from core.config import settings
from core.rag_engine import init_rag_engine

init_rag_engine()

def query_rag(question: str) -> dict:

    """
        Interroge le RAG directement depuis la base de données PostgreSQL (Neon) 
        et retourne la réponse avec les sources.
    """

    vector_store = PGVectorStore(
        connection_string=settings.DATABASE_URL,
        async_connection_string=settings.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://"),
        table_name="rag_documents",
        embed_dim=settings.EMBED_DIM,
    )

    index = VectorStoreIndex.from_vector_store(vector_store=vector_store)

    query_engine = index.as_query_engine()
    response = query_engine.query(question)

    sources = []
    if hasattr(response, "source_nodes") and response.source_nodes:
        sources = [node.node.get_content()[:300] + "..." for node in response.source_nodes]

    return {
        "answer": str(response),
        "sources": sources
    }