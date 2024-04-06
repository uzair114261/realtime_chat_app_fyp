import React, { useRef, useState } from 'react';
import { Camera } from 'react-bootstrap-icons';

const Testing = () => {
  const [file, setFile] = useState([])
  const handleChange = e => {
    setFile([...file, e.taget.files[0]]);
  }
  const inputFile = useRef(null)
  return (
    <div className="container mx-auto]">
     <button className='flex items-center gap-3' onClick={()=>inputFile.current.click()}>
      <Camera/> <p>Pictures</p>
     </button>
     <input type="file" accept='video/*' onChange={handleChange} ref={inputFile} style={{display: 'none'}} />
    </div>
  );
};

export default Testing;
