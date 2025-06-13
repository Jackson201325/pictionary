import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Canvas from '../components/canvas';

describe('Canvas', () => {
  it('calls onStroke with correct coords', () => {
    const handleStroke = vi.fn();
    const { getByTestId } = render(<Canvas strokes={[]} onStroke={handleStroke} />);
    const canvas = getByTestId('canvas');

    fireEvent.mouseDown(canvas, { clientX: 10, clientY: 10 });
    fireEvent.mouseMove(canvas, { clientX: 20, clientY: 20 });
    fireEvent.mouseUp(canvas);

    expect(handleStroke).toHaveBeenCalledWith(
      expect.objectContaining({
        x0: expect.any(Number),
        y0: expect.any(Number),
        x1: expect.any(Number),
        y1: expect.any(Number),
      }),
    );
  });
});
