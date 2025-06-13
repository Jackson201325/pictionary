import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import useWebSocket from '../hooks/useWebSockets';

// @ts-ignore
import.meta.env = { VITE_WS_URL: 'ws://test-server/ws' };

class MockWebSocket {
  static instances: MockWebSocket[] = [];
  onmessage: ((e: any) => void) | null = null;
  readyState = WebSocket.OPEN;
  sent: string[] = [];
  url: string;

  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
  }

  send(data: string) {
    this.sent.push(data);
  }
  close() {}
}

vi.stubGlobal('WebSocket', MockWebSocket as any);

describe('useWebSocket', () => {
  beforeEach(() => {
    MockWebSocket.instances = [];
  });

  it('receives only stroke messages', () => {
    const { result } = renderHook(() => useWebSocket('room42'));
    const ws = MockWebSocket.instances[0];

    act(() => {
      ws.onmessage?.({
        data: JSON.stringify({ type: 'stroke', payload: { x: 1, y: 2 } })
      });
    });

    expect(result.current.strokes).toEqual([{ x: 1, y: 2 }]);
  });

  it('send() only emits stroke messages', () => {
    const { result } = renderHook(() => useWebSocket('roomX'));
    const ws = MockWebSocket.instances[0];

    act(() => {
      result.current.send({ x: 3, y: 4 });
    });

    const sent = ws.sent.map((s) => JSON.parse(s));
    expect(sent).toEqual([{ type: 'stroke', payload: { x: 3, y: 4 } }]);
  });
});
