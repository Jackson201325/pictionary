# Pictionary Frontend Overview

A real-time drawing & guessing game client built with React, Vite & Tailwind CSS.

## Prerequisites

- Node.js v20.x
- npm v9.x or yarn v1.x

## Installation

1. Clone the repo and enter the frontend folder:  
   git clone https://github.com/your-org/pictionary.git  
   cd pictionary/frontend

2. Install dependencies:  
   npm install

3. Create an `.env` file in the `frontend/` directory with these entries:  
   VITE_WS_URL=ws://localhost:8000/ws  
   VITE_API_URL=http://localhost:8000

4. Start the development server:  
   npm run dev

## Key Additions & How They Work

1. Environment Variables

   - VITE_WS_URL: the base URL for WebSocket connections
   - VITE_API_URL: the base URL for REST API calls  
     These allow swapping backend hosts without touching code.

2. Vite Configuration (`vite.config.ts`)

   - Uses loadEnv to merge all `.env*` files and expose VITE\_-prefixed vars.
   - Configures server.proxy so client requests to `/api` forward automatically to your backend, avoiding CORS.

3. Custom Hook: useWebSocket(roomId)

   - Opens new WebSocket(`${VITE_WS_URL}/${roomId}`) when `roomId` is set.
   - Listens for incoming `{ type: 'stroke', payload }` messages and accumulates payloads into its state array.
   - Exposes `send(payload)` which wraps your stroke and sends it if the socket is open.
   - Cleans up (closes the socket) automatically when `roomId` changes or the component unmounts.

4. Main App Flow (App.tsx)
   - **Lobby (Home component)**: choose “Create Room” or “Join Room.”  
     • Create → fetch secret word (`GET ${VITE_API_URL}/api/word`) → show it → start → generate `roomId`.  
     • Join → enter existing `roomId`.
   - **Game (Game component)**: once `roomId` exists, mounts canvas & guess UI.  
     • Drawing strokes invoke `send(stroke)` → broadcast to all in room.  
     • Incoming strokes from the hook re-render the canvas.  
     • Guess input compares against the secret word and shows correct/wrong feedback.

## Two-Player Real-Time Interaction

1. Host creates a room and draws; strokes are sent over WebSocket channel “/ws/{roomId}.”
2. Guesser joins the same `roomId`, sees the drawing live, and attempts to guess the word.
3. Both clients stay in sync via the shared WebSocket channel.
