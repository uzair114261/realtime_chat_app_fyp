import React, {useEffect} from 'react'

const useClickOutside = (ref, onClickOutside) => {
    useEffect(()=>{
        const handleClickOutside = (event) => {
            if(ref.current && !ref.current.contains(event.target)){
                onClickOutside()
            }
        };
        document.addEventListener('mousedown', handleClickOutside)
        return ()=> {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    },[ref, onClickOutside])
  return (
    <div>useClickOutside</div>
  )
}

export default useClickOutside