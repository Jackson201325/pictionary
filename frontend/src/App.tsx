// src/App.tsx
import React, { useState, useCallback } from 'react'
import useWebSocket from './hooks/useWebSockets'
import Home from './components/home'
import Game from './components/game'

export default function App() {
  const [word, setWord] = useState<string | null>(null)
  const [roomId, setRoomId] = useState<string | null>(null)

  // pull strokes + send() from our hook
  const { strokes, send } = useWebSocket(roomId ?? '')

  const startGame = useCallback((selectedWord: string) => {
    const newRoomId = crypto.randomUUID()
    setWord(selectedWord)
    setRoomId(newRoomId)
  }, [])

  const joinGame = useCallback((id: string) => {
    setRoomId(id)
  }, [])

  const resetGame = useCallback(() => {
    setRoomId(null)
    setWord(null)
  }, [])

  // lobby
  if (!roomId) {
    return <Home onStart={startGame} onJoin={joinGame} />
  }

  // game
  return (
    <Game roomId={roomId} word={word ?? ''} strokes={strokes} onStroke={send} onReset={resetGame} />
  )
}
