# Pictionary Full Stack

A real-time drawing & guessing game with React/Vite/Tailwind on the frontend and FastAPI + SQLite persistence on the backend.

## Repo Layout

    /
    ├── backend/ # FastAPI + SQLModel server
    ├── frontend/ # React + Vite + Bun client
    └── README.md # this file

## Quickstart

1. Clone & enter

        git clone https://github.com/your-org/pictionary.git
        cd pictionary

2. Backend setup (in backend/)

        python3.13 -m venv venv
        source venv/bin/activate # macOS/Linux
        pip install --upgrade pip
        pip install -r requirement.txt
        uvicorn main:app --reload --host 0.0.0.0 --port 8000

3. Frontend setup (in frontend/)

        bun install
        cat > env <<EOF
        VITE_WS_URL=ws://localhost:8000/ws
        VITE_API_URL=http://localhost:8000
        EOF
        bun run dev

## Persistence & Replay

- SQLite persists each stroke (x0,y0,x1,y1) under room_id
- On WS join (/ws/{room_id}), server replays stored strokes

## Two-Player Flow

1. Host creates/joins room; strokes → WS → backend
2. Backend saves & broadcasts strokes
3. Guest joins, receives history + updates
4. Guess UI checks against /api/word

## Testing & Formatting

- Tests: bun run test (Vitest + jsdom)
- Formatting: Husky → Prettier + ESLint
- Ignored: backend/venv/, backend/pictionary.db, frontend/coverage/, \*\*/pycache, etc
