from dotenv import load_dotenv
import sys

import logging
import os
import shutil
from typing import List
import subprocess
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routers.chat import chat_router
from app.settings import init_settings
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse



load_dotenv()


app = FastAPI()
init_settings()
base_dir = os.path.dirname(os.path.abspath(__file__))

# Define the path to the 'tmp' directory within the project
tmp_dir_path = os.path.join(base_dir, 'data')

# Make sure the 'tmp' directory exists
os.makedirs(tmp_dir_path, exist_ok=True)

environment = os.getenv("ENVIRONMENT", "dev")  # Default to 'development' if not set


@app.post('/upload')
async def upload_files(files: List[UploadFile] = File(...)):
    uploaded_filenames = []
    for file in files:
        file_path = os.path.join(tmp_dir_path, file.filename)
        try:
            with open(file_path, 'wb') as buffer:
                shutil.copyfileobj(file.file, buffer)
                uploaded_filenames.append(file.filename)
        except Exception as e:
            return JSONResponse(status_code=500, content={"message": f"Error saving file {file.filename}: {str(e)}"})
    return JSONResponse(status_code=200, content={"message": "Files uploaded successfully", "uploaded_files": uploaded_filenames})

@app.post('/trigger-processing')
async def trigger_processing():
    try:
        # Run the subprocess and capture output and errors
        completed_process = subprocess.run(
            [sys.executable, os.path.join(base_dir, 'app/engine/generate.py')],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env={**os.environ, "PYTHONPATH": base_dir},
            text=True
        )

        # Log the standard output and error
        print("STDOUT:", completed_process.stdout)
        print("STDERR:", completed_process.stderr)
        return JSONResponse(status_code=200, content={"message": "Processing triggered successfully"})
    except subprocess.CalledProcessError as e:
        # Log the error if subprocess fails
        print("Error:", e.output)
        return JSONResponse(status_code=500, content={"message": f"Error triggering processing: {str(e)}"})


if environment == "dev":
    logger = logging.getLogger("uvicorn")
    logger.warning("Running in development mode - allowing CORS for all origins")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(chat_router, prefix="/api/chat")


if __name__ == "__main__":
    uvicorn.run(app="main:app", host="localhost", reload=True)