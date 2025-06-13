from typing import Dict, List, Any
from fastapi import WebSocket, WebSocketDisconnect

class ConnectionManager:
    def __init__(self):
        # maps room_id → list of WebSocket connections
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_id: str):
        await websocket.accept()
        connections = self.active_connections.setdefault(room_id, [])
        connections.append(websocket)

    def disconnect(self, websocket: WebSocket, room_id: str):
        connections = self.active_connections.get(room_id, [])
        if websocket in connections:
            connections.remove(websocket)
            if not connections:
                # clean up empty rooms
                del self.active_connections[room_id]

    async def broadcast(self, room_id: str, message: Any):
        for connection in self.active_connections.get(room_id, []):
            await connection.send_json(message)
