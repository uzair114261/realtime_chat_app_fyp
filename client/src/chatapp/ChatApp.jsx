import React, { useState, useEffect, useContext, useMemo } from "react";
import UserList from "./UserList";
import ChatMessages from "./ChatMessages";
import { useNavigate } from "react-router";
import { ToastContext } from "../App";
import { ChatStates } from "./ChatStates";
import { useSocket } from "../provider/SocketProvider";
import VideoCall from "./videoCall";

const ChatApp = () => {
  const { userData, audioCall, videoCall } = useContext(ChatStates);
  const socket = useSocket();
  useMemo(() => {
    if (userData?.email) {
      socket.emit("join:email", userData?.email);
    }
  }, [socket]);
  const showToast = useContext(ToastContext);
  // const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");
    const userData = localStorage.getItem("userData");
    if (access && refresh && userData) {
      navigate("/");
    } else {
      showToast.error("Please log in to access this page.", {
        autoClose: 3000,
      });
      navigate("/login");
    }
  }, [showToast, navigate]);

  if (!userData) {
    navigate("/");
    return null;
  }

  return (
    <div className="flex max-md:flex-col">
      {audioCall && <>Audio Call</>}
      {videoCall && <VideoCall />}
      {!audioCall && !videoCall && (
        <>
          <UserList />
          <ChatMessages />
        </>
      )}
    </div>
  );
};

export default ChatApp;
