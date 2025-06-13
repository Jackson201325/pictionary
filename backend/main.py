from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from sqlmodel import SQLModel, create_engine, Session, select
from typing import List
from collections import defaultdict
from models import Room, Stroke

DATABASE_URL = "sqlite:///./pictionary.db"
engine = create_engine(DATABASE_URL, echo=True)

app = FastAPI()

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

@app.get("/api/word")
async def get_word():
    return JSONResponse({"word": "apple"})

@app.websocket("/ws/{room_id}")
async def websocket_endpoint(ws: WebSocket, room_id: str):
    await ws.accept()

    # ensure room exists
    with Session(engine) as sess:
        if not sess.get(Room, room_id):
            sess.add(Room(id=room_id))
            sess.commit()

    # replay history
    with Session(engine) as sess:
        strokes: List[Stroke] = sess.exec(
            select(Stroke).where(Stroke.room_id == room_id).order_by(Stroke.id)
        ).all()
        for s in strokes:
            await ws.send_json({
                "type": "stroke",
                "payload": {"x0": s.x0, "y0": s.y0, "x1": s.x1, "y1": s.y1}
            })

    # track connected clients in memory
    ROOM_CONNECTIONS.setdefault(room_id, set()).add(ws)

    try:
        while True:
            msg = await ws.receive_json()
            if msg.get("type") == "stroke":
                p = msg["payload"]
                # persist
                with Session(engine) as sess:
                    stroke = Stroke(
                        room_id=room_id,
                        x0=p["x0"], y0=p["y0"],
                        x1=p["x1"], y1=p["y1"]
                    )
                    sess.add(stroke)
                    sess.commit()
                # broadcast
                for client in list(ROOM_CONNECTIONS[room_id]):
                    await client.send_json(msg)
    except WebSocketDisconnect:
        ROOM_CONNECTIONS[room_id].remove(ws)

ROOM_CONNECTIONS: dict[str, set[WebSocket]] = defaultdict(set)
