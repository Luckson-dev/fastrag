from fastapi import APIRouter
from api.v1.endpoints import ingest, query

api_router = APIRouter()

api_router.include_router(ingest.router, prefix="/ingest", tags=["Ingestion"])
api_router.include_router(query.router, prefix="/query", tags=["Query"])