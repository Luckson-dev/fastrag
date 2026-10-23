from fastapi import APIRouter, HTTPException
from schemas.rag import QueryRequest, QueryResponse
from services.query import query_rag

router = APIRouter()

@router.post("/", response_model=QueryResponse)
async def ask_rag(payload: QueryRequest):

    try:
        result = query_rag(payload.question)
        
        return QueryResponse(
            answer=result["answer"],
            sources=result["sources"]
        )
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))