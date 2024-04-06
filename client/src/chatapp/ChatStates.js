import { useState, createContext, useEffect } from 'react'

export const ChatStates = createContext();

export const ChatStatesProvider = ({ children }) => {
    const [messages, setMessages] = useState([])
    const [receiverInfo, setReceiverInfo] = useState(false)
    const userData = JSON.parse(localStorage.getItem('userData'))
    const [chatOpen, setChatOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [senderProfile, setSenderProfile] = useState(false);
    const [allUsers, setAllUsers] = useState(false);
    const handleUserSelect = (user) => {
        setSelectedUser(user);
    };
    useEffect(()=>{
        const fetchMessages = async () => {
            try{
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}messages/all_messages/`)
                const data = await response.json()
                console.log(data)
                setMessages(data)

            }catch(error){
                console.log(error)
            }
        }
        fetchMessages()
    },[])

    


    const contextValue = { receiverInfo, setReceiverInfo, userData, chatOpen, setChatOpen, handleUserSelect, selectedUser, senderProfile, setSenderProfile, allUsers, setAllUsers, messages }
    return (
        <ChatStates.Provider value={contextValue}>
            {children}
        </ChatStates.Provider>
    )
}