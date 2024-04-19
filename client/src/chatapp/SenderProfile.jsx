import React, { useContext } from 'react'
import { ArrowLeft } from 'react-bootstrap-icons'
import { ChatStates } from './ChatStates'

function SenderProfile() {
    const {userData, senderProfile, setSenderProfile} = useContext(ChatStates)
    const formatedDate = new Date(userData?.created_at).toLocaleString()
    return (
            <div className={`${senderProfile ? "md:w-[30%] max-h-[100vh] h-[100vh] overflow-auto" : "hidden"}`}>
                <div className="bg-[#008069] dark:bg-slate-900 h-[60px] flex justify-start items-center px-3">
                    <button onClick={() => setSenderProfile(false)} className='text-white text-xl'><ArrowLeft /></button>
                    <h3 className='ml-4 text-white text-xl'>Profile</h3>
                </div>
                <div className="max-h-[calc(100vh-60px)] bg-[#f0f2f5] dark:bg-slate-800 overflow-y-auto overflow-x-hidden ">
                    <div className="sender-info bg-[#f0f2f5] dark:bg-slate-800  px-4 py-8 ">
                        <div className="image">
                            <img src={`${process.env.REACT_APP_BACKEND_URL}${userData.profileImage}`} alt="senderImage" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 shadow-lg  px-4 md:px-8 py-4 mt-3">
                        <p className='text-gray-600 dark:text-white'>Your Name</p>
                        <p className='text-gray-900 dark:text-white text-sm md:text-lg'>{userData.firstName} {userData.lastName}</p>
                    </div>
                    <div className="px-4 md:px-8 py-2 mt-3">
                        <p className='text-gray-700 text-sm  dark:text-white'>This is not your username or pin. This name will be visible to your Contacts only.</p>
                    </div>
                    <div className="joined-since bg-white dark:bg-slate-900 shadow-lg   px-4 md:px-8 py-4 mt-3 mb-3">
                        <p className='text-gray-600 dark:text-white'>About</p>
                        <p className='text-gray-900 dark:text-white'>{userData.bio}</p>
                    </div>
                    <div className="joined-since bg-white shadow-lg dark:bg-slate-900  px-4 md:px-8 py-4 mt-3 mb-3">
                        <p className='text-gray-600 dark:text-white'>Joined Since</p>
                        <p className='text-gray-900 dark:text-white text-sm md:text-lg'>{formatedDate}</p>
                    </div>

                </div>
            </div>
    )
}

export default SenderProfile