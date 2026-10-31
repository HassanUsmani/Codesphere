
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Literal

from services.chat_service import generate_reply
import traceback
router = APIRouter(prefix="/api", tags=["Chatbot"])


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    text: str


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    history: list[ChatMessage] = Field(default_factory=list)


@router.post("/chat")
async def chat(request: ChatRequest):

    if not request.message.strip():
        raise HTTPException(
            status_code=400,
            detail="Please enter a message."
        )

    try:
        reply = await generate_reply(
            request.message,
            request.history
        )

        return {
            "text": reply,
            "label": "Groq"
        }

    except Exception as error:
        print("Chatbot error:", repr(error))
        traceback.print_exc()

        raise HTTPException(
            status_code=502,
            detail="The assistant is temporarily unavailable. Please try again."
        )
