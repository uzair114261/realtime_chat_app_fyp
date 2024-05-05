import { useState, createContext, useEffect, useMemo, useCallback } from "react";
import { useSocket } from "../provider/SocketProvider";

export const ChatStates = createContext();

export const ChatStatesProvider = ({ children }) => {
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [receiverInfo, setReceiverInfo] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [senderProfile, setSenderProfile] = useState(false);
  const [allUsers, setAllUsers] = useState(false);
  const [sendTextMessage, setSendTextMessage] = useState("");
  const [file, setFile] = useState([]);
  const [audioFile, setAudioFile] = useState([]);
  const [audioCall , setAudioCall] = useState(false);
  const [videoCall , setVideoCall] = useState(false);
  const [callAccepted , setCallAccepted] = useState(false);
  const [incomingCall , setIncomingCall] = useState(false);
  const [callHistory, setCallHistory] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };
  const sendButton = () => {
    sendMessage();
    setSendTextMessage("");
  };
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}messages/all_messages/`
        );
        const data = await response.json();

        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessages();
  }, []);
  socket.on("message:receive", (data) => {
    const { message } = data;
    setMessages([...messages, message]);
  });
  const sendMessage = async () => {
    
    try {
      const sender = userData.id;
      const receiver = selectedUser?.id;
      setMessages([
        ...messages,
        {
          content: "Sending",
          content_type: "text",
          file: null,
          id: -1,
          image: null,
          receiver: receiver,
          sender: sender,
          timestamp: new Date(),
        },
      ]);
      if (file.length > 0) {
        let messagesnew = messages;
        for (var indexFile = 0; indexFile < file.length; indexFile++) {
          const formData = new FormData();
          formData.append("sender", sender);
          formData.append("receiver", receiver);
          formData.append("content", sendTextMessage);

          formData.append("file", file[indexFile]);
          formData.append("content_type", file[indexFile].type);
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}messages/all_messages/`,
            {
              method: "POST",
              body: formData, // Send the FormData directly, no need for JSON.stringify
            }
          );
          if (!response.ok) {
            setMessages(messages.filter((item) => item.id != -1));
            throw new Error("Failed to send message");
          }
          if(response.ok){
            
            setMessages(messages.filter((item) => item.id != -1));
            const responseJson = await response.json();
            messagesnew.push(responseJson);
            socket.emit("message:send", {
              receiver: selectedUser?.email,
              sender: userData.email,
              message: responseJson,
            });
            
          }
        }
        
        setMessages( messagesnew);
      } else {
        if (audioFile.length > 0) {
          let messagesnew = messages;
          for (var indexFile = 0; indexFile < audioFile.length; indexFile++) {
            const formData = new FormData();
            formData.append("sender", sender);
            formData.append("receiver", receiver);
            formData.append("content", sendTextMessage);
  
            formData.append("file", audioFile[indexFile]);
            formData.append("content_type", audioFile[indexFile].type);
            const response = await fetch(
              `${process.env.REACT_APP_BACKEND_URL}messages/all_messages/`,
              {
                method: "POST",
                body: formData, // Send the FormData directly, no need for JSON.stringify
              }
            );
            if (!response.ok) {
              setMessages(messages.filter((item) => item.id != -1));
              throw new Error("Failed to send message");
            }
            if(response.ok){
              
              setMessages(messages.filter((item) => item.id != -1));
              const responseJson = await response.json();
              messagesnew.push(responseJson);
              socket.emit("message:send", {
                receiver: selectedUser?.email,
                sender: userData.email,
                message: responseJson,
              });
              
            }
          }
          
          setMessages( messagesnew);
        } else {
          const formData = new FormData();
          formData.append("sender", sender);
          formData.append("receiver", receiver);
          formData.append("content", sendTextMessage);
  
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}messages/all_messages/`,
            {
              method: "POST",
              body: formData, // Send the FormData directly, no need for JSON.stringify
            }
          );
          
          if (!response.ok) {
            setMessages(messages.filter((item) => item.id != -1));
            throw new Error("Failed to send message");
          }
          if(response.ok){
            
            setMessages(messages.filter((item) => item.id != -1));
            const responseJson = await response.json();
            
            setMessages([...messages, responseJson]);
            socket.emit("message:send", {
              receiver: selectedUser?.email,
              sender: userData.email,
              message: responseJson,
            });
          }
        }
        
      }
      

    
      
      setFile([]);
      setAudioFile([]);
      setAudioBlob(null)
    } catch (error) {
      console.error("Error in sending the message:", error);
    }
  };
  useMemo(() => {
    if(callAccepted){
     
      
    }
    else {
      
      setAudioCall(false);
      setVideoCall(false);
    }
  } , [callAccepted]);
  const genrateVideoCall = async () => {
    socket.emit("room:join" , {email : userData?.email , room : userData?.email});
    socket.emit("call:incoming" , {from : userData?.email , to : selectedUser?.email , callType : "video"});

  };
  const genrateAudioCall = async () => {
     socket.emit("room:join" , {email : userData?.email , room : userData?.email});
    socket.emit("call:incoming" , {from : userData?.email , to : selectedUser?.email , callType : "audio"});

  };
  const acceptCall = async () => {
    setCallAccepted(true);
    socket.emit("room:join" , {email : userData?.email , room : selectedUser?.email})
  }
  
  const callEnd =useCallback( async (to) => {
      if(incomingCall){
        socket.emit("call:end" , { room : selectedUser?.email , to : to})
      } else {
       
        socket.emit("call:end" , { room : userData?.email ,  to : to})
      }
      setCallAccepted(false);
      setVideoCall(false);
      setAudioCall(false);
      
  } , [incomingCall])
  socket.on("call:incoming" , async (data) => {
    const {from , to , callType} = data;
    setIncomingCall(true);
    if(callType == "video"){
      const user = users.filter((singleUser) => singleUser.email == from)?.[0];
      if(user){
        handleUserSelect(user);
      }
      setVideoCall(true);
    } 
    else {
      const user = users.filter((singleUser) => singleUser.email == from)?.[0];
      if(user){
        handleUserSelect(user);
      }
      setAudioCall(true);
    }
  })
  const contextValue = {
    receiverInfo,
    setReceiverInfo,
    userData,
    chatOpen,
    setChatOpen,
    handleUserSelect,
    selectedUser,
    senderProfile,
    setSenderProfile,
    allUsers,
    setAllUsers,
    messages,
    sendTextMessage,
    setSendTextMessage,
    sendButton,
    setFile,
    file,
    setAudioCall,
    audioCall,
    setVideoCall,
    videoCall,
    setCallAccepted,
    callAccepted,
    genrateVideoCall,
    genrateAudioCall,
    users,
    setUsers,
    acceptCall,
    incomingCall,
    callEnd,
    setAudioFile,
    audioBlob,
    setAudioBlob,
    callHistory, setCallHistory
  };
  return (
    <ChatStates.Provider value={contextValue}>{children}</ChatStates.Provider>
  );
};
