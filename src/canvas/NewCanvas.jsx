/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from "react";
import "./Canvas.css";

const NewCanvas = (props) => {
    const canvasRef = useRef(null);
    const isDrawing = useRef(false);
    const ctx = useRef(null);
    const returnBtn = useRef(null);
    const canvasStack = useRef([]);
    const cursorDot = useRef(null);
    const cursorOutline = useRef(null);
    const [currentBrushType, setCurrentBrushType] = useState(props.currentBrush);
    const currentBrushRef = useRef(null);
    
    let currentX, currentY, prevX, prevY = 0;

    const updateCanvasStyle = () => {
        const { color, size } = props.brush;
        ctx.current.fillStyle = color;
        ctx.current.strokeStyle = color;
        ctx.current.lineWidth = size;
        ctx.current.lineJoin = 'round';
        ctx.current.lineCap = 'round';
    }

    const updateBrushMode = () => {
        if (currentBrushType === 'eraser') {
            ctx.current.globalCompositeOperation = 'destination-out';
        } else {
            ctx.current.globalCompositeOperation = 'source-over';
        }
    }

    const updateCanvasStack = () => {
        if (canvasStack.current.length > 10) {
            canvasStack.current.shift();
        }
        canvasStack.current.push(ctx.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height));
        
    }
    const clearCanvas = () => {
        ctx.current.clearRect(0, 0, props.canvasWidth, props.canvasHeight);
        updateCanvasStack();
    }
    // did mount
    useEffect(() => {
        const canvas = canvasRef.current;
        const returnBtnElement = returnBtn.current;
        ctx.current = canvas.getContext('2d');
        currentBrushRef.current = props.currentBrush;
        updateCanvasStyle();
        updateCanvasStack();
        updateCursorStyle();
        canvas.addEventListener('mousedown', startDraw);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleStopDraw);
        returnBtnElement.addEventListener('click', getLastCanvasState);
        // unmount
        return () => {
            canvas.removeEventListener('mousedown', startDraw);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handleStopDraw);
            returnBtnElement.removeEventListener('click', getLastCanvasState);
        }
    }, [])

    const updateCursorStyle = () => {
        cursorOutline.current.style.width = `${(props.brush.size+1)/4}px`;
        cursorOutline.current.style.height = `${(props.brush.size+1)/4}px`;
        cursorDot.current.style.width = `${props.brush.size}px`;
        cursorDot.current.style.height = `${props.brush.size}px`;
        cursorDot.current.style.backgroundColor = currentBrushType != 'eraser'  
                                    ? `${props.brush.color}` 
                                    : 'white';
    }

    // did update
    useEffect(() => {
        updateCanvasStyle();
        updateCursorStyle();
    }, [props.brush, props.brush.color, props.brush.size])
    
    useEffect(() => {
        if (props.clearCanvas) {
            clearCanvas();
            props.onCanvasCleared();
        }
    }, [props.clearCanvas, props.onCanvasCleared])

    useEffect(() => {
        updateCanvasStack();
    }, [props.width, props.height])

    useEffect(() => {
        const newBrush = props.currentBrush;
        currentBrushRef.current = newBrush;
        setCurrentBrushType(newBrush);
        updateBrushMode();
        updateCursorStyle();
    }, [props.currentBrush, currentBrushType])

    const handleStopDraw = () => {
        console.log('brush is', props.currentBrush)
        updateCanvasStack();
        if (canvasStack.current.length > 10) {
            canvasStack.current.shift();
        }
        isDrawing.current = false;
    }

    const handleMouseMove = (e) => {
        if (isDrawing.current) {
            const pos = getMousePos(e);
            prevX = currentX;
            prevY = currentY;
            currentX = pos.originalX;
            currentY = pos.originalY;
            draw();
        }
        cursorDot.current.style.top = `${e.pageY}px`;
        cursorDot.current.style.left = `${e.pageX}px`;
        cursorOutline.current.style.top = `${e.pageY}px`;
        cursorOutline.current.style.left = `${e.pageX}px`;
    }

    const draw = () => {
        ctx.current.beginPath();
        ctx.current.moveTo(prevX, prevY);
        ctx.current.lineTo(currentX, currentY);
        ctx.current.stroke();
        ctx.current.closePath();
    }

    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        const rgb = result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
            a: 255
        } : null;
        return rgb;
    }

    const floodFill = (ctx, originalX, originalY, fillColor) => {
        fillColor = hexToRgb(fillColor);
        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        console.log(imageData.data)
        const pixelStack = [[originalX, originalY]];
        const pixelPos = (x, y) => {
            return (y * imageData.width + x) * 4;
        }
        const matchStartColor = (pixelPos, startColor) => {
            
            const r = imageData.data[pixelPos];
            const g = imageData.data[pixelPos + 1];
            const b = imageData.data[pixelPos + 2];
            const a = imageData.data[pixelPos + 3];
            return (r === startColor.r && g === startColor.g && b === startColor.b && a === startColor.a);
        }
        const colorPixel = (pixelPos, fillColor) => {
            imageData.data[pixelPos] = fillColor.r;
            imageData.data[pixelPos + 1] = fillColor.g;
            imageData.data[pixelPos + 2] = fillColor.b;
            imageData.data[pixelPos + 3] = 255;
        }
        const startColor = {
            r: imageData.data[pixelPos(originalX, originalY)],
            g: imageData.data[pixelPos(originalX, originalY) + 1],
            b: imageData.data[pixelPos(originalX, originalY) + 2],
            a: imageData.data[pixelPos(originalX, originalY) + 3]
        }
        if (startColor.r === fillColor.r && startColor.g === fillColor.g && startColor.b === fillColor.b && startColor.a === fillColor.a) {
            return;
        }
        while (pixelStack.length) {
            let [i, j] = pixelStack.pop();
            let pixelPos = (j * imageData.width + i) * 4;
            // check pixel in range
            if (i < 0 || i >= canvasRef.current.width || j < 0 || j >= canvasRef.current.height) {
                continue;
            } else {
                // check pixel color matches start color
                if (!matchStartColor(pixelPos, startColor)) {
                    continue;
                }
                colorPixel(pixelPos, fillColor);
                pixelStack.push([i + 1, j]);
                pixelStack.push([i - 1, j]);
                pixelStack.push([i, j + 1]);
                pixelStack.push([i, j - 1]);
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }


    const startDraw = (e) => {
        const pos = getMousePos(e);
        console.log(currentBrushType)
        if (currentBrushRef.current === 'fill') {
            floodFill(ctx.current,pos.originalX, pos.originalY, ctx.current.fillStyle);
            updateCanvasStack();
            return;
        }
        isDrawing.current = true;
        currentX = pos.originalX;
        currentY = pos.originalY;
        ctx.current.beginPath();
        ctx.current.fillRect(currentX, currentY, 2, 2);
        ctx.current.closePath();
    }

    const getMousePos = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        return {
            originalX: e.clientX - rect.left,
            originalY: e.clientY - rect.top
        }
    }

    const getLastCanvasState = () => {
        if (canvasStack.current.length > 1) {
            canvasStack.current.pop();
            ctx.current.putImageData(canvasStack.current[canvasStack.current.length-1], 0, 0);
        }
    }

    return (
        
        <>
        <div className="container">
            <div className={currentBrushType === 'eraser' 
                        ? 'cursor-dot cursor-eraser' 
                        : 'cursor-dot'}
                ref={cursorDot} 
                data-cursor-dot></div>
            <div className="cursor-outline"
                ref={cursorOutline}
                data-cursor-outline></div>
            <canvas
                className="canvas"
                id="canvas"
                ref={canvasRef}
                width={props.canvasWidth}
                height={props.canvasHeight}
            />
            <button ref={returnBtn}
                    className="return-btn">
                <i 
                    className="fa fa-undo">
                </i>
            </button>
        </div>
        </>
    )
}
export default NewCanvas;