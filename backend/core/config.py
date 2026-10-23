import os
from typing import List
from pathlib import Path
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
env_path = BASE_DIR / ".env"

if env_path.exists():
    load_dotenv(dotenv_path=env_path)

class Settings(BaseSettings):

    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    MODEL_NAME: str = os.getenv("MODEL_NAME", "openai/gpt-oss-120b")
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "gemini-embedding-2-preview")
    EMBED_DIM: int = int(os.getenv("EMBED_DIM", 3072))

    DATA_DIR: str = str(BASE_DIR / "data")

    DATABASE_URL: str = os.getenv("DATABASE_URL")
    FRONTEND_BASE_URL: str = os.getenv(
        "FRONTEND_BASE_URL",
        "http://127.0.0.1:5173,http://localhost:5173"
    )

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.FRONTEND_BASE_URL.split(",") if origin.strip()]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
