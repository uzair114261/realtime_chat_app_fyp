import React, { useContext, useRef, useState } from 'react'
import { CameraVideoFill, TelephoneFill, ThreeDotsVertical, ArrowLeft, SendFill, Plus, MicFill, CameraFill, ImageFill, Files, LockFill } from 'react-bootstrap-icons';
import ReceiverProfile from './ReceiverProfile';
import useClickOutside from '../CustomHooks/useClickOutside';
import { ChatStates } from './ChatStates';

const ChatMessages = () => {
  const { receiverInfo, setReceiverInfo, chatOpen, setChatOpen, selectedUser, messages, userData, sendTextMessage, setSendTextMessage, sendButton } = useContext(ChatStates)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showInputBox, setShowInputBox] = useState(false)
  const dropdownRef = useRef(null)
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState([])

  const handleChange = e => {
    setFile([...file, e.target.files[0]]);
  }
  const handleOutsideClick = () => {
    setShowDropdown(false)
    setShowInputBox(false)
  };
  useClickOutside(dropdownRef, handleOutsideClick)

  
  const handlePressEnter = (event) => {
    if (event.key === 'Enter') {
      sendButton();
    }
  }
  const messageTime = (timeString) => {
    const timestamp = new Date(timeString)
    const minutes = timestamp.getMinutes()
    let hours = timestamp.getHours()

    let amOrPm = 'AM';
    if (hours === 0) {
      hours = 12;
    } else if (hours === 12) {
      amOrPm = 'PM';
    } else if (hours > 12) {
      amOrPm = 'PM';
      hours -= 12;
    }
    return `${hours}:${minutes} ${amOrPm}`
  }

  const filteredMessages = messages.filter(message =>
    (message.sender === selectedUser?.id && message.receiver === userData.id) ||
    (message.sender === userData.id && message.receiver === selectedUser?.id)
  )
  return (
    <>
      {
        selectedUser ? (
          <>
            <div className={`${receiverInfo ? "md:w-[40%] max-md:hidden" : "md:w-[70%]"} max-h-[100vh] relative  h-[100vh] overflow-auto ${!chatOpen && "max-md:hidden"}`}>
              <div className="flex justify-between items-center bg-[#f0f2f5] h-[60px] px-1 md:px-3">
                <div className="flex">
                  <button className='mr-1 md:hidden' onClick={() => setChatOpen(false)}><ArrowLeft color='black' className='' /></button>
                  <div className="receiver-info h-full flex items-center" onClick={() => setReceiverInfo(true)}>
                    <div className='flex'>
                      <img className='avatar' src={`${process.env.REACT_APP_BACKEND_URL}${selectedUser.profileImage}`} alt="Receiver Profile" />
                    </div>
                    <div className=" ml-3">
                      <h5 className='text-md leading-4 mb-1'>{selectedUser.firstName} {selectedUser.lastName}</h5>
                      <p className='text-xs md:text-sm leading-4 text-gray-500'>last seen yesterday at 455 PM</p>
                    </div>
                  </div>
                </div>
                <div className='flex gap-5 items-center'>
                  <button className='' id='audioCall'><TelephoneFill color='#54656f' size={20} /></button>
                  <button className='' id='videoCall'><CameraVideoFill color='#54656f' size={20} /></button>
                  <button onClick={() => setShowDropdown(true)} type="button" className=" " id="menu-button" aria-expanded="true" aria-haspopup="true">
                    <ThreeDotsVertical size={20} color='#54656f' />
                  </button>
                  <div className="relative ">
                    <div ref={dropdownRef} className="relative inline-block text-left">
                      {
                        showDropdown && (
                          <div className="absolute right-[20px] z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                            <div className="py-1" role="none">
                              <li className="hover:bg-gray-100 ease-linear duration-150 text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-0">Clear Chat</li>
                            </div>
                          </div>
                        )
                      }

                    </div>
                  </div>
                </div>
              </div>
              <div className='h-[calc(100vh-60px)] max-h-[calc(100vh-60px)] overflow-y-auto overflow-x-hidden bg-[#AED8C7] flex flex-col-reverse'>
                <div className="flex flex-col mb-20">
                  {filteredMessages.map((message, index) => (
                    <div key={index} className={` flex justify-between items-end py-1 px-2 text-sm rounded mt-1 mx-2 md:mx-4 relative ${message.sender === userData.id ? "self-end bg-[#D9FDD3]" : 'self-start bg-[#ffff]'}`}>
                      {message.image ? (
                        <div className={`max-w-[400px] h-[400px] bg-[${message.sender === userData.id ? '#D9FDD3' : '#fff'}]`}>
                          <img className='w-full h-[380px]' src={`${process.env.REACT_APP_BACKEND_URL}${message.image}`} alt="" />
                          <div className="flex justify-between items-center h-[20px]">
                            <div className='max-w-[180px] mt-1'>{message.content}</div>
                            <div className='max-w-[70px] text-gray-500 text-xs flex items-end'>{message.time}</div>
                          </div>
                        </div>
                      ) : (
                        <div className='max-w-[250px] min-w-[220px] flex'>
                          <div className='max-w-[180px] min-w-[150px]'>
                            {message.content}
                          </div>
                          <div className='max-w-[70px] min-w-[70px] text-gray-500 text-xs flex justify-end items-end'>{messageTime(message.timestamp)}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className='absolute bottom-0 w-full bg-[#f0f2f5] shadow-md px-4 h-[65px] flex items-center'>
                  <div className="flex-none">
                    <div className='flex h-[50px] items-center justify-center'>
                      <div className="relative">
                        <div ref={dropdownRef} className="relative inline-block">
                          <div>
                            <button onClick={() => setShowInputBox(true)} type="button" className=" " id="menu-button" aria-expanded="true" aria-haspopup="true">
                              <Plus size={23} />
                            </button>
                          </div>
                          {
                            showInputBox && (
                              <div className="absolute right-[-160px] top-[-130px] z-10 mt-2 w-[170px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                                <div className="py-1" role="none">
                                  <li className="hover:bg-gray-100 ease-linear duration-150 text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-0">
                                    <button className='flex items-center gap-5 w-full' onClick={() => imageInputRef.current.click()}>
                                      <CameraFill size={22} color='red' /><p>Images</p>
                                    </button>
                                    <input type="file" accept='image/*' onChange={handleChange} ref={imageInputRef} style={{ display: 'none' }} />
                                  </li>
                                  <li className="hover:bg-gray-100 ease-linear duration-150 text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-0">
                                    <button className='flex items-center gap-5 w-full' onClick={() => videoInputRef.current.click()}>
                                      <ImageFill color='#2563eb' size={22} /><p>Videos</p>
                                    </button>
                                    <input type="file" accept='video/*' onChange={handleChange} ref={videoInputRef} style={{ display: 'none' }} />
                                  </li>
                                  <li className="hover:bg-gray-100 ease-linear duration-150 text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-0">
                                    <button className='flex items-center gap-5 w-full' onClick={() => fileInputRef.current.click()}>
                                      <Files color='#2563eb' size={22} /><p>Files</p>
                                    </button>
                                    <input type="file" accept=".xlsx,.xls,.doc, .docx,.ppt, .pptx,.txt,.pdf" onChange={handleChange} ref={fileInputRef} style={{ display: 'none' }} />
                                  </li>
                                </div>
                              </div>
                            )
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  <input type="text" value={sendTextMessage} onKeyPress={handlePressEnter} onChange={(event) => setSendTextMessage(event.target.value)} className='grow px-2 py-2 rounded outline-none' placeholder='Type a message' />
                  <div className="send flex-none px-2">
                    <div className="flex">
                      {
                        sendTextMessage.length > 0 ? (
                          <button onClick={sendButton} className='rotate-45 text-xl h-[30px] w-[30px]'><SendFill size={30} color='#54656f' /></button>
                        ) : (
                          <button type='submit' className='text-xl bg-[#008069] h-[30px] w-[30px] flex items-center justify-center rounded-[50%]'><MicFill size={17} color='#fff' /></button>
                        )
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ReceiverProfile />

          </>
        ) : (
          <>
            <div className='bg-[#f0f2f5] md:w-[70%] flex items-center justify-center gap-5 flex-col'>
              <div className='text-center w-[70%]'>
                <h2 className="text-3xl text-gray-600">Realtime Chat Application</h2>
                <p className='text-gray-600 text-sm'>Make audio & video calls and do messages to your friends and family and share multimedia files for faster and reliable experience</p>
              </div>
              <div className='text-center flex items-center gap-5'>
                <LockFill className='lock-icon' />  <p className='text-gray-600 text-sm'>Your messages and calls are end-to-end encrypted.</p>
              </div>
            </div>
          </>
        )
      }

    </>
  )
}
export default ChatMessages