import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Home from '../components/home';

describe('Home Join flow', () => {
  it('allows entering and joining a room', () => {
    const fakeStart = vi.fn();
    const fakeJoin = vi.fn();

    render(<Home onStart={fakeStart} onJoin={fakeJoin} />);
    fireEvent.click(screen.getByText(/Join Room/i));
    const input = screen.getByPlaceholderText(/Enter room ID/i);
    fireEvent.change(input, { target: { value: 'ROOM123' } });
    fireEvent.click(screen.getByRole('button', { name: /Join Room$/i }));

    expect(fakeJoin).toHaveBeenCalledWith('ROOM123');
  });

  it('shows an error if fetch fails in create flow', async () => {
    const fakeStart = vi.fn(),
      fakeJoin = vi.fn();
    global.fetch = vi.fn().mockRejectedValue(new Error('nope'));
    render(<Home onStart={fakeStart} onJoin={fakeJoin} />);

    fireEvent.click(screen.getByText(/Create Room/i));
    fireEvent.click(screen.getByRole('button', { name: /Get a Word/i }));

    expect(await screen.findByText(/Failed to fetch word/i)).toBeInTheDocument();
  });
});
