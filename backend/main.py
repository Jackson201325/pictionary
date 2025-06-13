from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import ws
from manager import ConnectionManager
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# the missing manager instance
manager = ConnectionManager()

app.include_router(ws.router)

@app.get("/api/word")
def get_word():
    return {"word": random.choice([
        "sunflower", "apple", "house", "cat", "dog", "tree"
    ])}

@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    # now manager is defined
    await manager.connect(websocket, room_id)
    try:
        while True:
            data = await websocket.receive_json()
            # data: { type: 'stroke'|'chat', payload, user }
            await manager.broadcast(room_id, data)
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)

