//TODO: remove it and check the warning again
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useRef, useEffect } from "react";

const _getMousePos = (canvas, evt) => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
};

const _generateWhiteBitmap = () => {
  let bitmap = [];
  for (let i = 0; i < 640; i++) {
    for (let j = 0; j < 640; j++) {
      bitmap.push(255);
      bitmap.push(255);
      bitmap.push(255);
      bitmap.push(255);
    }
  }
  return bitmap;
};

const _renderBitmap = (ctx, bitmap) => {
  const imageData = ctx.createImageData(640, 640);
  for (let i = 0; i < 640 * 640 * 4; i++) {
    imageData.data[i] = bitmap[i];
  }
  ctx.putImageData(imageData, 0, 0);
};

// Initialize simple splat cache here so that we don't need to upsample the splat every single draw
let splatCache = [];
for (let i = 0; i < 1000; i++) {
  splatCache[i] = null;
}

const splat88 = [
  0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1,
  1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0,
];

// Utilizes nearest-neighbour algorithm to increase the splat in size
const _upsampleSplat = (originalSplat, originalSize, newSize) => {
  const x_src = originalSize;
  const y_src = originalSize;
  const x_dst = newSize;
  const y_dst = newSize;
  const x_scale = x_dst / (x_src - 1);
  const y_scale = y_dst / (y_src - 1);

  let resultSplat = [];
  for (let i = 0; i < x_dst * y_dst; i++) {
    resultSplat.push(0);
  }

  for (let x = 0; x < x_dst; x++) {
    for (let y = 0; y < y_dst; y++) {
      //M(x,y) = src(round(x/x_scale), round(y/y_scale))
      const originalValX = Math.round(x / x_scale);
      const originalValY = Math.round(y / y_scale);
      const originalVal = originalSplat[originalValY * y_src + originalValX];

      const resultIndex = y * y_dst + x;
      resultSplat[resultIndex] = originalVal;
    }
  }

  return resultSplat;
};

const _generateColorSplatOfSize = (splatImageData, color, size) => {
  // Basic memoization
  let splatXX = null;
  if (splatCache[size] !== null) {
    splatXX = splatCache[size];
  } else {
    splatXX = size === 8 ? splat88 : _upsampleSplat(splat88, 8, size);
    splatCache[size] = splatXX;
  }

  // For each 1 value of the splat we add the color and each 0 we skip (leaves whatever value was there to mimic transparency)
  let index = 0;
  for (const pixel of splatXX) {
    if (pixel === 0) {
      index += 4;
      continue;
    }

    splatImageData.data[index] = color.r;
    splatImageData.data[index + 1] = color.g;
    splatImageData.data[index + 2] = color.b;
    splatImageData.data[index + 3] = color.a;
    index += 4;
  }

  return splatImageData;
};

const _drawSplat = (ctx, radius, color, pos) => {
  // Right now 8 is min size because we only upsample from 8 and up
  if (radius < 8) {
    radius = 8;
  }

  // We take a part of an image and "stamp" our splat there on top of it
  const splatSource = ctx.getImageData(
    pos.x - radius / 2,
    pos.y - radius / 2,
    radius,
    radius
  );
  const splatDst = _generateColorSplatOfSize(splatSource, color, radius);
  ctx.putImageData(splatDst, pos.x - radius / 2, pos.y - radius / 2);
};

// The idea behind this algorithm is to draw splat on each point on the formed line
const _renderLine = (ctx, thickness, color, start, end) => {
  const direction = { x: end.x - start.x, y: end.y - start.y };
  const magnitude = Math.sqrt(
    direction.x * direction.x + direction.y * direction.y
  );

  //We are just placing a dot, not drawing a line - no need to do the rest
  if (magnitude <= 0) {
    _drawSplat(ctx, thickness, color, start);
    return;
  }

  let steps = 10.0;
  //If the distance change is great, we should increase the number of steps to still make the line look continuous
  //Numbers are quite arbitrary.
  if (magnitude > 10) {
    steps = 30.0;
  }

  if (magnitude > 50) {
    steps = 60.0;
  }

  const stepSize = magnitude / steps;

  //direction of draw
  const directionNormalized = {
    x: direction.x / magnitude,
    y: direction.y / magnitude,
  };

  // Interpolate along the line and draw splat at each step
  let drawPos = start;
  for (let i = 0; i <= steps; i++) {
    _drawSplat(ctx, thickness, color, drawPos);
    drawPos = {
      x: drawPos.x + directionNormalized.x * stepSize,
      y: drawPos.y + directionNormalized.y * stepSize,
    };
  }
};

const Canvas = (props) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // initialize canvas
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.canvas.width = 640;
    context.canvas.height = 640;

    // prepare the bitmap
    let bitmap = [];
    if (props.bitmap === null) {
      bitmap = _generateWhiteBitmap();
    } else {
      bitmap = props.bitmap;
    }

    // render the bitmap
    _renderBitmap(context, bitmap);
  }, []);

  // Reloads every time the color or thickness were changed
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Painting process
    let isDrawing = false;
    let prevMousePos = { x: 0, y: 0 };

    const paint = (evt) => {
      if (!isDrawing) {
        return;
      }

      const currentMousePos = _getMousePos(canvas, evt);

      // Draw a line to mitigate the speed of events.
      // This solves the problem of user moving the mouse too fast - we just connect the points
      _renderLine(
        context,
        props.thickness,
        props.color,
        prevMousePos,
        currentMousePos
      );

      // Update previous position
      prevMousePos = currentMousePos;
    };

    const startPaint = (evt) => {
      //Initialize start pos and flip the bool
      prevMousePos = _getMousePos(canvas, evt);
      _renderLine(
        context,
        props.thickness,
        props.color,
        prevMousePos,
        prevMousePos
      );
      isDrawing = true;
    };

    const endPaint = (evt) => {
      isDrawing = false;
    };

    // Canvas can be in read-only mode when viewing
    if (!props.disallowDraw) {
      window.addEventListener("mousedown", startPaint);
      window.addEventListener("mousemove", paint);
      window.addEventListener("mouseup", endPaint);
    }

    return () => {
      if (!props.disallowDraw) {
        window.removeEventListener("mousedown", startPaint);
        window.removeEventListener("mousemove", paint);
        window.removeEventListener("mouseup", endPaint);
      }
    };
  }, [props.thickness, props.color]);

  return <canvas ref={canvasRef} {...props}></canvas>;
};

export default Canvas;
