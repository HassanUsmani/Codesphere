from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware
from routers.demorouter import router1 
app = FastAPI(title="project")
# app.include_router(router1)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_headers=["*"],
    allow_methods=["*"],
)

@app.get("/")
def home():
    return {"Home":"Working Fine"} 