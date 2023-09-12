/* eslint-disable react/prop-types */
import React, {Component} from 'react';
import './Canvas.css'

class Canvas extends Component {
    constructor(props) {
        super(props);
        this.canvas = null;
        
        this.width = props.width;
        this.height = props.height;
        this.brush = this.props.brush;
        this.isDrawing = false;
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.ctx = null;
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.updateCanvasStyle = this.updateCanvasStyle.bind(this);
        this.draw = this.draw.bind(this);
        this.currentX = 0;
        this.currentY = 0;
        this.prevX = 0;
        this.prevY = 0;
    }
    updateCanvasStyle() {
        const { color, size } = this.props.brush.state;
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = size;
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.brush.state.color;
        this.ctx.moveTo(this.prevX, this.prevY);
        this.ctx.lineTo(this.currentX, this.currentY);
        this.ctx.stroke();
        this.ctx.closePath();
    }
    componentDidMount() {
        this.canvasRef = React.createRef();
       this.canvas = this.canvasRef.current;
       this.ctx = this.canvas.getContext('2d');
       this.updateCanvasStyle();
    }
    handleMouseDown = (e) => {
        this.isDrawing = true;
        const pos = this.getMousePos(e);
        this.currentX = pos.x;
        this.currentY = pos.y;
        this.ctx.beginPath();
        this.ctx.fillStyle = this.brush.state.color;
        this.ctx.fillRect(this.currentX, this.currentY, 2, 2);
        this.ctx.closePath();
    }
    handleMouseMove = (e) => {
        if (this.isDrawing) {
            const pos = this.getMousePos(e);
            this.prevX = this.currentX;
            this.prevY = this.currentY;
            this.currentX = pos.x;
            this.currentY = pos.y;
            this.draw();
        }
    }
    handleMouseUp = () => {
        this.isDrawing = false;
    }
    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }
    }

    render() {
        return (
            <canvas
            id='canvas'
                className='canvas' 
                ref={el => this.canvas = el} width={this.props.width} height={this.props.height}
                onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove}
                onMouseUp={this.handleMouseUp} onMouseLeave={this.handleMouseUp} />
        );
    }
}
export default Canvas;