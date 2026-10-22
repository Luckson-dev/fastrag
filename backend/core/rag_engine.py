from llama_index.core import Settings, VectorStoreIndex
from llama_index.llms.groq import Groq
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.vector_stores.postgres import PGVectorStore
from backend.core.config import settings

def init_rag_engine():

    """
        Initialise et configure les composants globaux de LlamaIndex :
        
        - LLM : Groq
        - Embeddings : Modèle local HuggingFace (Sentence-Transformers)
        - Chunking : Taille et chevauchement des segments de texte
        - Stockage Vectoriel : Connexion distante PostgreSQL (Neon / pgvector)
    """
    
    Settings.llm = Groq(
        model=settings.MODEL_NAME,
        api_key=settings.GROQ_API_KEY
    )

    Settings.embed_model = HuggingFaceEmbedding(
        model_name=settings.EMBEDDING_MODEL
    )

    Settings.chunk_size = 512
    Settings.chunk_overlap = 50

    vector_store = PGVectorStore(
        connection_string=settings.DATABASE_URL,
        async_connection_string=settings.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://"),
        table_name="rag_documents",
        embed_dim=settings.EMBED_DIM,
    )

    index = VectorStoreIndex.from_vector_store(vector_store=vector_store)
    
    return index.as_query_engine()