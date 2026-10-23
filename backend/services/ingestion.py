import os
from llama_index.core import SimpleDirectoryReader, StorageContext, VectorStoreIndex
from llama_index.vector_stores.postgres import PGVectorStore
from core.config import settings
from core.rag_engine import init_rag_engine

init_rag_engine()

def ingest_documents(input_dir: str = None) -> int:

    """
        Charge les documents depuis un dossier, les vectorise et les stocke 
        directement dans PostgreSQL (Neon) via pgvector.
    """

    target_dir = input_dir or settings.DATA_DIR

    if not os.path.exists(target_dir) or not os.listdir(target_dir):
        raise ValueError(f"Le dossier '{target_dir}' est vide ou n'existe pas.")

    documents = SimpleDirectoryReader(target_dir).load_data()

    vector_store = PGVectorStore(
        connection_string=settings.DATABASE_URL,
        async_connection_string=settings.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://"),
        table_name="rag_documents",
        embed_dim=settings.EMBED_DIM,
    )
    
    storage_context = StorageContext.from_defaults(vector_store=vector_store)

    VectorStoreIndex.from_documents(
        documents, 
        storage_context=storage_context
    )

    return len(documents)