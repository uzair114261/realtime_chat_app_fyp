import React, { useState, useEffect } from 'react'
import { SunFill, MoonFill } from 'react-bootstrap-icons'

const DarkModeToggle = () => {
    const [darkMode, setDarkMode] = useState(false)
    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode === 'true') {
          setDarkMode(true);
          document.body.classList.add('dark');
        }
      }, []);
    
      const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        console.log(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode.toString());
        document.body.classList.toggle('dark'); 
      };
    return (
        <div>
            <button onClick={toggleDarkMode}>
                {darkMode ? <SunFill color='#fff' size={22} /> : <MoonFill color='#54656f' size={22} />}
            </button>
        </div>
    )
}

export default DarkModeToggle