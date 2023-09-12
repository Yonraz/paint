/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from "react";
import './SizePicker.css'

const SizePicker = (props) => {
    const [size, setSize] = useState(10);
    const [color, setColor] = useState('#000000');
    useEffect(() => {
        setColor(props.color);
    }, [props.color])

    const handleSizeChange = (e) => {
        setSize(e.target.value);
    };
    useEffect(() => {
        props.sendSize(size);
    })
    return (
        <div className="brush-size">
            
            <div
                style={{
                    width: size + 'px',
                    height: size + 'px',
                    backgroundColor: color,
                }}
                className="brush-demo"></div>
            <div className="slider-lable-container">
                <input
                type="range"
                id="brush-size"
                min="2"
                max="100"
                step="2"
                value={size}
                onChange={handleSizeChange}
            />
            <label htmlFor="brush-size">Size</label>
            </div>
        </div>
    );
}

export default SizePicker;