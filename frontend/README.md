# Pictionary Frontend Overview

A real-time drawing & guessing game client built with React, Vite & Tailwind CSS.

## Prerequisites

- Node.js v20.x
- bun v1.x (we use Bun for installs & scripts)

## Installation

1. Clone the repo and enter the frontend folder:  
   git clone https://github.com/your-org/pictionary.git  
   cd pictionary/frontend

2. Install dependencies:  
   bun install

3. Create an `.env` file in the `frontend/` directory with these entries:  
    `VITE_WS_URL=ws://localhost:8000/ws
VITE_API_URL=http://localhost:8000`

4. Start the development server:  
   bun run dev

## Key Additions & How They Work

1. **Environment Variables**

- `VITE_WS_URL`: base WebSocket URL
- `VITE_API_URL`: base REST API URL

2. **Vite Configuration** (`vite.config.ts`)

- Loads `.env*` via `loadEnv` and exposes `VITE_`-prefixed vars
- Proxies `/api` → `${VITE_API_URL}` to avoid CORS

3. **Custom Hook: `useWebSocket(roomId)`**

- Opens `new WebSocket(\`\${VITE_WS_URL}/\${roomId}\`)`
- Buffers incoming `{ type:'stroke', payload }` messages into state
- Exposes `send(payload)` to broadcast strokes
- Cleans up on unmount or `roomId` change

4. **Main App Flow** (`App.tsx`)

- **Lobby** (`Home`): Create or Join
  - Create → fetch word (`GET ${VITE_API_URL}/api/word`) → display → Start → generate `roomId`
  - Join → enter existing `roomId`
- **Game** (`Game`): once `roomId` exists, show canvas & guess UI

## Code Formatting & Pre-commit Hooks

- **Prettier**
- Configured via `.prettierrc.json` in the project root:

```jsonc
{
  "lineWidth": 100,
  "indentStyle": "space",
  "indentSize": 2,
  "semiColons": "always",
  "quotes": "single",
  "jsxQuotes": "double",
  "trailingComma": "all",
  "endOfLine": "lf"
}
```

- Ensures consistent styling (line length, quotes, trailing commas, etc.)

## Two-Player Real-Time Interaction

1. Host creates a room and draws; strokes flow via WS `/ws/{roomId}`
2. Guesser joins same `roomId`, views drawing live, and guesses
3. Both clients stay in sync over the WebSocket channel

## Testing & Linting

- **Unit Tests**

  - Framework: Vitest + Testing Library + jsdom
  - Run all tests with coverage report:
    ```bash
    bun run test
    ```
  - Watch mode (re-run on change):
    ```bash
    bun run test:watch
    ```

- **Formatting & Linting**
  - **Prettier** configured via `.prettierrc.json` to enforce consistent style.
  - **Husky** pre-commit hook runs:
    ```bash
    bun run format && bun run lint
    ```
  - **Commands**:
    - Format code: `bun run format`
    - Lint code: `bun run lint`
