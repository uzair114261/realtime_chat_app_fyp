import { useState, createContext } from 'react'

export const ChatStates = createContext();

export const ChatStatesProvider = ({ children }) => {
    const [receiverInfo, setReceiverInfo] = useState(false)
    const userData = JSON.parse(localStorage.getItem('userData'))
    const [chatOpen, setChatOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [senderProfile, setSenderProfile] = useState(false);
    const [allUsers, setAllUsers] = useState(false);
    const handleUserSelect = (user) => {
        setSelectedUser(user);
    };
    const contextValue = { receiverInfo, setReceiverInfo, userData, chatOpen, setChatOpen, handleUserSelect, selectedUser, senderProfile, setSenderProfile, allUsers, setAllUsers }
    return (
        <ChatStates.Provider value={contextValue}>
            {children}
        </ChatStates.Provider>
    )
}