import os
from llama_index.core import SimpleDirectoryReader, VectorStoreIndex
from backend.core.config import settings
from backend.core.rag_engine import init_rag_engine

init_rag_engine()

def ingest_documents(input_dir: str = None) -> int:

    """
        Charge les documents depuis un dossier, les vectorise et les stocke localement.
    """

    target_dir = input_dir or settings.DATA_DIR

    if not os.path.exists(target_dir) or not os.listdir(target_dir):
        raise ValueError(f"Le dossier '{target_dir}' est vide ou n'existe pas.")

    documents = SimpleDirectoryReader(input_dir).load_data()
    index = VectorStoreIndex.from_documents(documents)

    os.makedirs(settings.VECTOR_STORE_PATH, exist_ok=True)
    index.storage_context.persist(persist_dir=settings.VECTOR_STORE_PATH)

    return len(documents)
