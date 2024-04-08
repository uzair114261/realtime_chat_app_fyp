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
    const [sendTextMessage, setSendTextMessage] = useState("")
    const handleUserSelect = (user) => {
        setSelectedUser(user);
    };
    const sendButton = () => {
        sendMessage()
        setSendTextMessage('')
    }
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}messages/all_messages/`)
                const data = await response.json()
                setMessages(data)

            } catch (error) {
                console.log(error)
            }
        }
        fetchMessages()
    }, [])

    const sendMessage = async () => {
        try {
            const sender = userData.id;
            const receiver = selectedUser?.id;
            const formData = new FormData();
            formData.append('sender', sender);
            formData.append('receiver', receiver);
            formData.append('content', sendTextMessage);
    
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}messages/all_messages/`, {
                method: 'POST',
                body: formData, // Send the FormData directly, no need for JSON.stringify
            });
    
            if (!response.ok) {
                throw new Error('Failed to send message');
            }
    
            
        } catch (error) {
            console.error('Error in sending the message:', error);
        }
    }

    const contextValue = { receiverInfo, setReceiverInfo, userData, chatOpen, setChatOpen, handleUserSelect, selectedUser, senderProfile, setSenderProfile, allUsers, setAllUsers, messages, sendTextMessage, setSendTextMessage, sendButton }
    return (
        <ChatStates.Provider value={contextValue}>
            {children}
        </ChatStates.Provider>
    )
}