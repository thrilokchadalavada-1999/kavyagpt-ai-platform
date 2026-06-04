from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def health():
    return {
        "status": "KavyaGPT backend running with Ollama"
    }

@app.post("/api/chat")
def chat(req: ChatRequest):

    response = requests.post(
        "http://127.0.0.1:11434/api/generate",
        json={
            "model": "llama3.2:1b",
            "prompt": req.message,
            "stream": False
        }
    )

    data = response.json()

    return {
        "reply": data["response"]
    }