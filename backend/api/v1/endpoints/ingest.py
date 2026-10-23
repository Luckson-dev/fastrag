import os
from fastapi import APIRouter, File, HTTPException, UploadFile
from schemas.rag import IngestResponse
from services.ingestion import ingest_documents

router = APIRouter()


@router.post("/", response_model=IngestResponse)
async def ingest_file(file: UploadFile = File(...)):
  
    """
        Endpoint pour ingérer un fichier texte,
        le vectoriser et le stocker (Compatible Vercel Serverless).
    """

    data_dir = "/tmp/data"
    os.makedirs(data_dir, exist_ok=True)

    file_path = os.path.join(data_dir, file.filename)

    try:
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        count = ingest_documents(input_dir=data_dir)

        return IngestResponse(
            message=f"Fichier '{file.filename}' ingéré avec succès.",
            documents_count=count,
        )
    except Exception as e:
        print(f"Erreur critique lors de l'ingestion : {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))