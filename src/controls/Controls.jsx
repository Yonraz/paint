/* eslint-disable react/prop-types */
import React, {useRef, useEffect, useState} from 'react';
import ColorPicker from './ColorPicker';
import './Controls.css'
import SizePicker from './SizePicker';
import NewCanvas from '../canvas/NewCanvas';
import Brushes from './Brushes';


const Controls = () => {
  const [brushColor, setBrushColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(10)
  const [clearCanvas, setClearCanvas] = useState(false)
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth/2);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight/1.4);
  const [currentBrush, setCurrentBrush] = useState('brush');
  
  const setCanvasSize = () => {
      console.log('update canvas size')
      setCanvasWidth(window.innerWidth/2);
      setCanvasHeight(window.innerHeight/1.4);
    }

    useEffect(() => {
        console.log('did mount')
        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);
        return () => {
            window.removeEventListener('resize', setCanvasSize);
        }
    }, [])
  const handleClear = () => {
    setClearCanvas(true)
  }

  const handleCleared = () => {
    setClearCanvas(false)
  }

  const handleSave = () => {
    
  }
  const handleSendColor = (color) => {
    console.log(color)
    setBrushColor(color)
  }
  const handleSendSize = (size) => {
    setBrushSize(size)
  }
  return (
    <>
    <div className="controls">
      {console.log('width')}

      <NewCanvas canvasWidth={canvasWidth} canvasHeight={canvasHeight}
                currentBrush={currentBrush}
                clearCanvas={clearCanvas}
                 onCanvasCleared={handleCleared}
                 brush={{color: brushColor, size: brushSize}}/>
      <div className='brushes-section-container'>
        <Brushes setCurrentBrush={setCurrentBrush}/>
      </div>
      <div className='color-size-container'>
        <ColorPicker sendColor={handleSendColor}/>
        <SizePicker sendSize={handleSendSize} color={brushColor}/>
      </div>
      
    </div>
    <div className='clear-save-container'>
        <button
        className='clear btn' 
        onClick={handleClear}>Clear</button>
        <button 
        className='save btn' 
        onClick={handleSave}>Save</button>
    </div>
    </>
  );
}

export default Controls;