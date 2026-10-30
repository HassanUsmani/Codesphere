from fastapi import APIRouter 

router1 = APIRouter(prefix='/api',tags = ["Demo"])
@router1.post("/")
async def check():
    return {"router":"working good"}