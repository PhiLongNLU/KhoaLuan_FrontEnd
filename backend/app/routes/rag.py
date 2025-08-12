from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from app.helpers.helpers import process_document_to_faiss

from app.rag.rag_module import index, metadata, rag

import os

route = APIRouter(
    prefix="/rag",
    tags=["RAG"]
)

@route.post("/upload")
async def upload_file(file: UploadFile = File(...), start_page: int = 1, end_page: int = None, topic: str = "general"):

    global index, metadata

    _,ext = os.path.splitext(file.filename)

    allowed_extensions = [".pdf", ".pptx", ".ppt", ".docx"]

    #return error if the file type is not allowed
    if(ext.lower() not in allowed_extensions):
        return JSONResponse(
            status_code=400,
            content={"message": "Invalid file type. Only PDF, PPTX, PPT, and DOCX files are allowed."}
        )
    
    #read the file content
    content = await file.read()
    if not content:
        return JSONResponse(
            status_code=400,
            content={"message": "File is empty."}
        )
    else:
        try:
            process_document_to_faiss(
                file_upload=file,
                start_page=start_page,
                end_page=end_page,
                topic=topic,
                source=file.filename,
                index=index,
                vector_data=metadata
            )
        except Exception as e:
            return JSONResponse(
                status_code=500,
                content={"message": f"Error processing file: {str(e)}"}
            )
    
    return JSONResponse(
        status_code=200,
        content={"message": "File processed successfully."}
    )

@route.post("/generate_promts")
async def generate_prompts(promt: str):
    if not promt:
        return JSONResponse(
            status_code=400,
            content={"message": "Prompt cannot be empty."}
        )
    
    result = rag.generate_prompt(promt)

    # Here you would typically generate prompts based on the input
    # For simplicity, we will just return the input prompt
    return JSONResponse(
        status_code=200,
        content={"prompt": result}
    )