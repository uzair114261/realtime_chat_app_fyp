import React, { useState, useEffect, useContext, useMemo } from "react";
import UserList from "./UserList";
import ChatMessages from "./ChatMessages";
import { useNavigate } from "react-router";
import { ChatStates } from "./ChatStates";
import { useSocket } from "../provider/SocketProvider";
import VideoCall from "./videoCall";
import AudioCall from "./AudioCall";
import { useToast } from "../CustomHooks/ToastContext";

const ChatApp = () => {
  const { userData, audioCall, videoCall } = useContext(ChatStates);
  const socket = useSocket();
  const { notifySuccess, notifyError } = useToast()

  useMemo(() => {
    if (userData?.email) {
      socket.emit("join:email", userData?.email);
    }
  }, [socket, userData]);

  const navigate = useNavigate();

  useEffect(() => {
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");
    const userData = localStorage.getItem("userData");
    if (access && refresh && userData) {
      navigate("/");
    } else {
      notifyError("Please log in to access this page.");
      navigate("/login");
    }
  }, [navigate, notifyError]);

  return (
    <>
      {audioCall && <AudioCall />}
      {videoCall && <VideoCall />}
      {!audioCall && !videoCall && (
        <div className="flex max-md:flex-col">
          <UserList />
          <ChatMessages />
        </div>
      )}
    </>
  );
};

export default ChatApp;
