import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env_path = os.path.join(BASE_DIR, ".env")

if os.path.exists(env_path):
    load_dotenv(dotenv_path=env_path)

class Settings(BaseSettings):

    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    MODEL_NAME: str = "openai/gpt-oss-120b"
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"
    VECTOR_STORE_PATH: str = os.path.join(BASE_DIR, "storage")
    DATA_DIR: str = os.path.join(BASE_DIR, "data")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
