import React from 'react'
import { useNavigate } from 'react-router'

const Error404 = () => {
    const navigate = useNavigate()
    const access = localStorage.getItem('access')

  return (
    <div className='bg-green-300 h-screen w-screen fixed top-0 left-0 flex items-center justify-center'>
        <div className="rounded-lg p-5 bg-white">
            <h1 className="text-5xl py-2 font-[800] text-center">
                404
            </h1>
            <h1 className="text-4xl font-[600] py-3 text-center">
                OOPs! Page not Found
            </h1>
            <div className='p-2 w-8/12 mx-auto text-center text-xl'>
                Sorry, The page you are looking for is not Avaialable in our Application
            </div>
            <div className="text-center py-2">
                {
                    access ? (
                        <button onClick={()=>navigate('/')} className='py-2 px-4 bg-green-500 rounded text-white'>Open Chat</button>

                    ) : (

                        <button onClick={()=>navigate('/login')} className='py-2 px-4 bg-green-500 rounded text-white'>Login</button>
                    )
                }
            </div>
        </div>
    </div>
  )
}

export default Error404