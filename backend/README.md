# Pictionary Backend

A FastAPI server providing a random-word endpoint and WebSocket room support.

## Prerequisites

- Python 3.13 (tested on 3.13.3)
- Git
- venv module (standard library)

## Installation & Setup

1. Clone the repo and enter the backend folder  
   git clone https://github.com/your-org/pictionary.git  
   cd pictionary/backend
2. Create a virtual environment  
   python3.13 -m venv venv
3. Activate the virtual environment  
   macOS/Linux: source venv/bin/activate  
   Windows PowerShell: .\venv\Scripts\Activate.ps1  
   Windows CMD: venv\Scripts\activate.bat
4. Upgrade pip & install dependencies  
   pip install --upgrade pip  
   pip install -r requirement.txt
5. Run the server  
   uvicorn main:app --reload --host 0.0.0.0 --port 8000

## Endpoints & Usage

- **GET /api/word**  
  Returns a random word, e.g.  
  `{ "word": "sunflower" }`

- **WebSocket /ws/{room_id}**  
  Join a drawing room; exchange JSON messages of shape  
  `{ "type": "stroke" | "chat", "payload": {...}, "user"?: "username" }`  
  Messages are broadcast to all clients connected to the same `room_id`.
