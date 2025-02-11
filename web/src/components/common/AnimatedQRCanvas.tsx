import React, { useRef, useEffect, useState } from 'react';

interface QRMatrix {
  modules: number[][];
  isfunction: boolean[][];
}

interface AnimatedQRCodeCanvasProps {
  matrix: QRMatrix | null;
  size: number; // number of modules per side
  scale?: number; // pixel scale per module (default 10)
  padding?: number; // padding in modules (default 3)
  animationDuration?: number; // in ms (default 200)
}

const AnimatedQRCanvas: React.FC<AnimatedQRCodeCanvasProps> = ({
  matrix,
  size,
  scale = 10,
  padding = 3,
  animationDuration = 200,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prevMatrix, setPrevMatrix] = useState<typeof matrix>(matrix);

  useEffect(() => {
    if (!matrix) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;
    let startTime: number | null = null;

    const canvasSize = (size + 2 * padding) * scale;

    // Create offscreen canvases for previous and current QR code states
    const offscreenPrev = document.createElement('canvas');
    offscreenPrev.width = canvasSize;
    offscreenPrev.height = canvasSize;

    const offscreenNew = document.createElement('canvas');
    offscreenNew.width = canvasSize;
    offscreenNew.height = canvasSize;

    // Helper function to render a QR matrix onto a given 2D context
    const renderMatrix = (m: { modules: number[][] }, targetCtx: CanvasRenderingContext2D) => {
      targetCtx.fillStyle = '#fff';
      targetCtx.fillRect(0, 0, canvasSize, canvasSize);
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const cell = m.modules[i][j];
          const fillColor = cell ? '#000' : '#fff';
          targetCtx.fillStyle = fillColor;
          targetCtx.fillRect((j + padding) * scale, (i + padding) * scale, scale, scale);
          targetCtx.lineWidth = 1;
          targetCtx.strokeStyle = cell ? '#111111' : '#EEEEEE';
          targetCtx.strokeRect((j + padding) * scale + 0.5, (i + padding) * scale + 0.5, scale - 1, scale - 1);
        }
      }
    };

    // Render the previous state; if none exists, use the current matrix
    const prevMatrixToRender = prevMatrix ? prevMatrix : matrix;
    const offPrevCtx = offscreenPrev.getContext('2d');
    if (offPrevCtx) {
      renderMatrix(prevMatrixToRender, offPrevCtx);
    }

    // Render the current matrix
    const offNewCtx = offscreenNew.getContext('2d');
    if (offNewCtx) {
      renderMatrix(matrix, offNewCtx);
    }

    const drawFrame = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / animationDuration, 1);

      // Clear the main canvas
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Blend the offscreen canvases based on progress
      ctx.globalAlpha = 1;
      ctx.drawImage(offscreenPrev, 0, 0);
      ctx.globalAlpha = progress;
      ctx.drawImage(offscreenNew, 0, 0);
      ctx.globalAlpha = 1;

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(drawFrame);
      } else {
        // Animation complete; update previous matrix to the current one
        setPrevMatrix(matrix);
      }
    };

    animationFrameId = requestAnimationFrame(drawFrame);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [matrix, size, scale, padding, animationDuration, prevMatrix]);
  
  const canvasSize = (size + 2 * padding) * scale;
  
  return (
    <canvas
      ref={canvasRef}
      width={canvasSize}
      height={canvasSize}
      style={{ width: '100%', maxWidth: canvasSize, height: 'auto', display: 'block' }}
    />
  );
};

export default AnimatedQRCanvas; 