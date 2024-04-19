import { useState, createContext, useEffect } from "react";
import { useSocket } from "../provider/SocketProvider";

export const ChatStates = createContext();

export const ChatStatesProvider = ({ children }) => {
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [receiverInfo, setReceiverInfo] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [senderProfile, setSenderProfile] = useState(false);
  const [allUsers, setAllUsers] = useState(false);
  const [sendTextMessage, setSendTextMessage] = useState("");
  const [file, setFile] = useState([]);
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
    let response;
    try {
      const sender = userData.id;
      const receiver = selectedUser?.id;
      const formData = new FormData();
      if (file.length > 0) {
        for (var indexFile = 0; indexFile < file.length; indexFile++) {
          formData.append("sender", sender);
          formData.append("receiver", receiver);
          formData.append("content", sendTextMessage);

          formData.append("file", file[indexFile]);
          formData.append("content_type", file[indexFile].type);
          response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}messages/all_messages/`,
            {
              method: "POST",
              body: formData, // Send the FormData directly, no need for JSON.stringify
            }
          );
        }
      } else {
        formData.append("sender", sender);
        formData.append("receiver", receiver);
        formData.append("content", sendTextMessage);

        formData.append("file", file[0]);
        formData.append("content_type", file[0].type);
        response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}messages/all_messages/`,
          {
            method: "POST",
            body: formData, // Send the FormData directly, no need for JSON.stringify
          }
        );
      }
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

      if (!response.ok) {
        setMessages(messages.filter((item) => item.id != -1));
        throw new Error("Failed to send message");
      }
      if (response.ok) {
        setMessages(messages.filter((item) => item.id != -1));
        const responseJson = await response.json();
        setMessages([...messages, responseJson]);
        socket.emit("message:send", {
          receiver: selectedUser?.email,
          sender: userData.email,
          message: responseJson,
        });
      }
      setFile([]);
    } catch (error) {
      console.error("Error in sending the message:", error);
    }
  };

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
  };
  return (
    <ChatStates.Provider value={contextValue}>{children}</ChatStates.Provider>
  );
};
