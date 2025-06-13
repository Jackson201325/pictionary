import '@testing-library/jest-dom';

// @ts-ignore
HTMLCanvasElement.prototype.getContext = function (_: string) {
  return {
    clearRect: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    stroke: () => {}
  };
};
