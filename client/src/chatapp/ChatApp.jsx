import React, { useState, useEffect, useContext } from 'react'
import UserList from './UserList'
import ChatMessages from './ChatMessages'
import { useNavigate } from 'react-router'
import { ToastContext } from '../App'
import { ChatStates } from './ChatStates'

const ChatApp = () => {
  const {userData} =  useContext(ChatStates)
  const showToast = useContext(ToastContext)
  // const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate()
  useEffect(() => {
    const access = localStorage.getItem('access');
    const refresh = localStorage.getItem('refresh');
    const userData = localStorage.getItem('userData');
    if (access && refresh && userData) {
      navigate('/');
    } else {
      showToast.error('Please log in to access this page.', {
        autoClose: 3000
      });
      navigate('/login');
    }
  }, [showToast, navigate]);

  if (!userData) {
    navigate('/')
    return null
  }
  return (
    <div className='flex max-md:flex-col'>
      <UserList  />
      <ChatMessages  />
    </div>
  )
}

export default ChatApp