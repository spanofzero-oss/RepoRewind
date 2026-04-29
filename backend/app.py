from fastapi import FastAPI
from pydantic import BaseModel
import time

app = FastAPI()

class SyncData(BaseModel):
    code: str
    tag: str

lattice = []

@app.get("/timeline")
def get_timeline():
    return {"lattice": lattice}

@app.post("/sync")
def sync(data: SyncData):
    state = {
        "id": len(lattice),
        "code": data.code,
        "tag": data.tag,
        "time": time.strftime("%Y-%m-%d %H:%M:%S")
    }
    lattice.append(state)
    return {"status": "synced"}