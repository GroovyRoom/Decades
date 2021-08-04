//TODO: remove it and check the warning again
/* eslint-disable react-hooks/exhaustive-deps */


import React, {useRef, useEffect} from 'react'

const _getMousePos = (canvas, evt) => {
    const rect = canvas.getBoundingClientRect()
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    }
}

// We store only RGB on server, but the image data needs Alpha channel too
const _convertToClientBitmap = (serverBitmap) => {
    let bitmap = []
    for (let i = 0; i<640*640*3; i+=3){
        bitmap.push(serverBitmap[i])
        bitmap.push(serverBitmap[i+1])
        bitmap.push(serverBitmap[i+2])
        bitmap.push(255)
    }
    return bitmap
}

const _generateWhiteBitmap = () => {
    let bitmap = []
    for (let i = 0; i<640; i++){
        for (let j = 0; j<640; j++){
            bitmap.push(255)
            bitmap.push(255)
            bitmap.push(255)
            bitmap.push(255)
        }
    }
    return bitmap
}

const _renderBitmap = (ctx, bitmap) => {
    const imageData = ctx.createImageData(640, 640)
    for (let i = 0; i<640*640*4; i++){
        imageData.data[i] = bitmap[i]
    }   
    ctx.putImageData(imageData, 0, 0)
}

const _renderLine = (ctx, thickness, color, start, end) => {
    ctx.strokeStyle = color
    ctx.lineWidth = thickness;

    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.stroke()
}

const Canvas = props => {
    const canvasRef = useRef(null)

    useEffect(() => {
        // initialize canvas
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        context.canvas.width = 640
        context.canvas.height = 640

        // prepare the bitmap
        let bitmap = []
        if (props.bitmap == null){
            bitmap = _generateWhiteBitmap()
        } else {
            bitmap = _convertToClientBitmap(props.bitmap)
        }

        // render the bitmap
       _renderBitmap(context, bitmap)

        // Painting process
        let isDrawing = false
        let prevMousePos = {x: 0, y: 0}

        const paint = (evt) => {
            if (!isDrawing){
                return
            }

            if (props.disallowDraw){
                return
            }

            const currentMousePos = _getMousePos(canvas, evt)

            // Draw a line to mitigate the speed of events
            _renderLine(context, 1, '#000000FF', prevMousePos, currentMousePos)

            // Update previous position
            prevMousePos = currentMousePos
        }

        const startPaint = (evt) =>{
            //Initialize start pos and flip the bool
            prevMousePos = _getMousePos(canvas, evt)
            isDrawing = true
        }

        const endPaint = (evt) => {
            isDrawing = false
        }

        canvas.addEventListener("mousedown", startPaint)
        canvas.addEventListener("mousemove", paint);
        canvas.addEventListener("mouseup", endPaint)
        canvas.addEventListener("mouseleave", endPaint)

        return () => {
            canvas.removeEventListener("mousedown", startPaint);
            canvas.removeEventListener("mousemove", paint);
            canvas.removeEventListener("mouseup", endPaint);
            canvas.removeEventListener("mouseleave", endPaint);
        }
    }, [])

    return <canvas ref ={canvasRef} {...props}></canvas>
}

export default Canvas