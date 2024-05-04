import React, { useContext } from 'react'
import { ChatStates } from './ChatStates'
import {ArrowLeft, Search} from 'react-bootstrap-icons'

const CallHistory = () => {
    const { callHistory, setCallHistory } = useContext(ChatStates)
    return (
        <div className={`${callHistory ? 'md:w-[30%] h-[100vh] max-h-[100vh] overflow-auto' : 'hidden'}`}>
            <div className="bg-[#008069] dark:bg-slate-900 h-[60px] flex justify-start items-center px-3">
                <button onClick={() => setCallHistory(false)} className='text-white text-xl'><ArrowLeft /></button>
                <h3 className='ml-4 text-white text-xl'>Calling History</h3>
            </div>
            <div className="search-user-list w-100 dark:bg-slate-800">
                    <div className='search-user dark:bg-slate-700'>
                        <button className='px-1'>
                            <Search size={16} className='dark:text-white' />
                        </button>
                        <input id='search-user-input' className='dark:bg-slate-700 dark:text-white' placeholder='search calls' />
                    </div>
                </div>
        </div>
    )
}

export default CallHistory