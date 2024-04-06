import React, {useState, useContext} from 'react'
import { XLg, Trash3Fill } from 'react-bootstrap-icons'
import { ChatStates } from './ChatStates';

function ReceiverProfile() {
    const {receiverInfo, setReceiverInfo, selectedUser} = useContext(ChatStates)
    const formatedDate = new Date(selectedUser?.created_at).toLocaleString();
  const [deletePopUp, setDeletePopUp] = useState(false)
  const handleDelete = () => {
    alert('Delete Logic will execute');
    setDeletePopUp(false);
  }
    return (
        <div className={`${receiverInfo ? "md:w-[30%] overflow-auto" : "hidden"}`}>
            <div className="header border-l-[1px] border-[#d1d7db] bg-[#f0f2f5] h-[60px] flex items-center px-4">
                <button className='mr-4 hover:bg-slate-300 ease-linear duration-200  h-[30px] w-[30px] flex items-center justify-center rounded-[50%]' onClick={() => setReceiverInfo(false)}><XLg size={18} /></button> <br />
                <h3 className='ml-3'>Contact Info</h3>
            </div>
            <div className="max-h-[calc(100vh-60px)] bg-[#f0f2f5] overflow-y-auto overflow-x-hidden ">
                <div className="receiver-info bg-white shadow-lg  px-4 py-8 ">
                    <div className="image">
                        <img src={`${process.env.REACT_APP_BACKEND_URL}${selectedUser.profileImage}`} alt="receiverImage" />
                    </div>
                    <h2 className="text-xl text-center text-gray-700 mt-3">{selectedUser.firstName} {selectedUser.lastName}</h2>
                    <p className='text-gray-600 text-center'>{selectedUser.email}</p>
                </div>
                <div className="receiver-about bg-white shadow-lg  px-4 py-4 mt-3">
                    <p className='text-gray-600'>About</p>
                    <p className='text-gray-900 text-sm md:text-lg'>{selectedUser.bio}</p>
                </div>
                <div className="joined-since bg-white shadow-lg  px-4 py-4 mt-3 mb-3">
                    <p className='text-gray-600'>Joined Since</p>
                    <p className='text-gray-900 text-sm md:text-lg'>{formatedDate}</p>
                </div>
                <div className="bg-white shadow-lg py-4 mt-3 mb-3">
                    <li className='flex items-center  px-4 py-2 text-red-500 hover:bg-slate-100 cursor-pointer ease-linear duration-100' onClick={() => setDeletePopUp(true)}> <Trash3Fill className='mr-5' /> Delete Chat</li>
                </div>
            </div>
            {
                deletePopUp && (
                    <div className="popup-container">
                        <div className="popup">
                            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
                            <p className="mb-4">Are you sure you want to delete this chat?</p>
                            <div className="flex justify-end">
                                <button
                                    className="px-4 py-2 mr-4 bg-gray-300 ease-linear duration-200 text-gray-700 rounded hover:bg-gray-400"
                                    onClick={() => setDeletePopUp(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-slate-600 ease-linear duration-200 text-white rounded hover:bg-slate-700"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default ReceiverProfile