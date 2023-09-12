/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react'
import './Brushes.css'
const Brushes = (props) => {
    const handleClick = (brushType) => {
        props.setCurrentBrush(brushType)
    }
    return (
        <>
        <div className="brushes-container">
            <label htmlFor="brush-type">Brush Type</label>
            <div className="brushes">
                <button id='brush-btn' className={
                    props.currentBrush === 'brush' ? 'brush btn active' : 'brush btn'
                } onClick={() => handleClick('brush')}>
                    <i className="fa fa-paint-brush" aria-hidden="true"></i>
                </button>
                <hr/>
                <button id='fill-btn' className={
                    props.currentBrush === 'fill' ? 'fill btn active' : 'fill btn'
                } onClick={() => handleClick('fill')}>
                    <i className="fa fa-tint" aria-hidden="true"></i>
                </button>
                <hr/>
                <button id='eraser-btn' className={
                    props.currentBrush === 'eraser' ? 'eraser btn active' : 'eraser btn'
                } onClick={() => handleClick('eraser')}>
                <i className="fa fa-eraser" aria-hidden="true"></i>
                </button>
            </div>
        </div>
        
        </>
    )
}

export default Brushes;