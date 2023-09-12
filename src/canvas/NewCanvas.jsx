/* eslint-disable react/prop-types */
import { useRef, useEffect } from "react";
import "./Canvas.css";

const NewCanvas = (props) => {
    const canvasRef = useRef(null);
    const isDrawing = useRef(false);
    const ctx = useRef(null);
    const returnBtn = useRef(null);
    const canvasStack = useRef([]);
    const cursorDot = useRef(null);
    const cursorOutline = useRef(null);
    
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
        if (props.currentBrush === 'eraser') {
            ctx.current.globalCompositeOperation = 'destination-out';
        } else {
            ctx.current.globalCompositeOperation = 'source-over';
        }
    }

    const updateCanvasStack = () => {
        if (canvasStack.current.length > 10) {
            canvasStack.current.shift();
        }
        console.log(canvasRef.current)
        canvasStack.current.push(ctx.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height));
        console.log(canvasStack.current)
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
        if (props.currentBrush === 'eraser') {
            cursorDot.current.style.backgroundColor = 'white';
        } else {
        cursorOutline.current.style.width = `${(props.brush.size+1)/4}px`;
        cursorOutline.current.style.height = `${(props.brush.size+1)/4}px`;
        cursorDot.current.style.width = `${props.brush.size}px`;
        cursorDot.current.style.height = `${props.brush.size}px`;
        cursorDot.current.style.backgroundColor = `${props.brush.color}`;
        }
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
        console.log(props.canvasWidth, props.canvasHeight)
    }, [props.width, props.height])

    useEffect(() => {
        updateBrushMode();
    }, [props.currentBrush])

    const handleStopDraw = () => {
        updateCanvasStack();
        console.log(canvasStack.current.length)
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
            currentX = pos.x;
            currentY = pos.y;
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

    const startDraw = (e) => {
        isDrawing.current = true;
        const pos = getMousePos(e);
        currentX = pos.x;
        currentY = pos.y;
        ctx.current.beginPath();
        ctx.current.fillRect(currentX, currentY, 2, 2);
        ctx.current.closePath();
    }

    const getMousePos = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
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
            <div className="cursor-dot"
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