from llama_index.core import Settings
from llama_index.llms.groq import Groq
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from backend.core.config import settings

def init_rag_engine():

    """
        Initialise et configure les composants globaux de LlamaIndex :
        
        - LLM : Groq
        - Embeddings : Modèle local HuggingFace (Sentence-Transformers)
        - Chunking : Taille et chevauchement des segments de texte
    """

    print(f"GROQ_API_KEY : {settings.GROQ_API_KEY}")
    print(f"MODEL_NAME : {settings.MODEL_NAME}")
    print(f"EMBEDDING_MODEL : {settings.EMBEDDING_MODEL}")
    
    Settings.llm = Groq(
        model=settings.MODEL_NAME,
        api_key=settings.GROQ_API_KEY
    )

    Settings.embed_model = HuggingFaceEmbedding(
        model_name=settings.EMBEDDING_MODEL
    )

    Settings.chunk_size = 512
    Settings.chunk_overlap = 50

    print(f"Moteur RAG configuré : LLM [{settings.MODEL_NAME}] | Embeddings [{settings.EMBEDDING_MODEL}]")