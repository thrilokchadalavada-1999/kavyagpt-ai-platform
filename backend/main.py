from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import requests
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "host.minikube.internal")
OLLAMA_PORT = os.getenv("OLLAMA_PORT", "11434")
MODEL_NAME = os.getenv("MODEL_NAME", "llama3.2:1b")


class ChatRequest(BaseModel):
    message: str


@app.get("/")
def health():
    return {
        "status": "KavyaGPT backend running"
    }


@app.post("/api/chat")
def chat(req: ChatRequest):

    try:
        response = requests.post(
            f"http://{OLLAMA_HOST}:{OLLAMA_PORT}/api/generate",
            json={
                "model": MODEL_NAME,
                "prompt": req.message,
                "stream": False
            },
            timeout=60
        )

        response.raise_for_status()

        data = response.json()

        return {
            "reply": data.get("response", "No response received")
        }

    except Exception as e:
        return {
            "reply": f"Backend Error: {str(e)}"
        }