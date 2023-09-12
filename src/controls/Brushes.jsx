/* eslint-disable react/prop-types */
import './Brushes.css'
const Brushes = (props) => {
    const handleEraserClick = () => {
        props.setCurrentBrush('eraser')
    }
    const handleBrushClick = () => {
        props.setCurrentBrush('brush')
    }
    const handleFillClick = () => {
        props.setCurrentBrush('fill')
    }
    return (
        <>
        <div className="brushes-container">
            <label htmlFor="brush-type">Brush Type</label>
            <div className="brushes">
                <button id='brush-btn' className='brush btn' onClick={handleBrushClick}>
                    <i className="fa fa-paint-brush" aria-hidden="true"></i>
                </button>
                <hr/>
                <button id='fill-btn' className='fill btn' onClick={handleFillClick}>
                    <i className="fa fa-tint" aria-hidden="true"></i>
                </button>
                <hr/>
                <button id='eraser-btn' className='eraser btn' onClick={handleEraserClick}>
                <i className="fa fa-eraser" aria-hidden="true"></i>
                </button>
            </div>
        </div>
        
        </>
    )
}

export default Brushes;