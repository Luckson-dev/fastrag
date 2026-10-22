import os
from llama_index.core import StorageContext, load_index_from_storage
from backend.core.config import settings
from backend.core.rag_engine import init_rag_engine

init_rag_engine()

def query_rag(question: str) -> dict:

    """
        Charge l'index persistant, interroge le RAG et retourne la réponse avec les sources.
    """

    if not os.path.exists(settings.VECTOR_STORE_PATH):
        raise FileNotFoundError("Aucun index vectoriel trouvé. Veuillez d'abord ingérer des documents.")

    storage_context = StorageContext.from_defaults(persist_dir=settings.VECTOR_STORE_PATH)
    index = load_index_from_storage(storage_context)

    query_engine = index.as_query_engine()

    response = query_engine.query(question)

    sources = []
    
    if hasattr(response, "source_nodes") and response.source_nodes:
        sources = [node.node.get_content()[:300] + "..." for node in response.source_nodes]

    return {
        "answer": str(response),
        "sources": sources
    }