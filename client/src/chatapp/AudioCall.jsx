import React, { useState,useCallback, useContext, useEffect, useMemo } from "react";
import { Mic, MicMute, Steam, TelephoneFill } from "react-bootstrap-icons";
import { ChatStates } from "./ChatStates";
import { useSocket } from "../provider/SocketProvider";
import peer from "./peer";
import ReactPlayer from "react-player";

const AudioCall = () => {
  const socket = useSocket();
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const {
    callAccepted,
    setCallAccepted,
    acceptCall,
    incomingCall,
    callEnd,
    selectedUser,
  } = useContext(ChatStates);
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [sound, setSound] = useState(true)
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const handleUserJoined = useCallback(({ email, id }) => {
    setRemoteSocketId(id);
    handleCallUser(id);
  }, []);

  const handleCallUser = useCallback(
    async (id) => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      const offer = await peer.getOffer();
      socket.emit("user:call", { to: id, offer });
      setMyStream(stream);
    },
    [remoteSocketId, socket]
  );

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(async () => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      const startTime = Date.now()
      socket.emit('start-time', {startTime})
      setStartTime(startTime);
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {  
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);
  useMemo(() => {
    if (remoteStream && incomingCall) {
      sendStreams();
    }
  }, [remoteStream]);
  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);
  useEffect(() => {
    let timerInterval;
    if (startTime) {
      timerInterval = setInterval(() => {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - startTime) / 1000); // Calculate elapsed time in seconds
        setElapsedTime(elapsedSeconds);
      }, 1000);
    }

    return () => {
      clearInterval(timerInterval); 
    };
  }, [startTime]);
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);

    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    socket.on("start-time", ({startTime})=> {
      setStartTime(startTime)
    });

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);

      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
      socket.off("start-time");
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);
  socket.on("call:cancelled", () => {
    if (myStream) {
      myStream.getTracks().forEach(track => track.stop());
      setMyStream(null);
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
      setRemoteStream(null);
    }
    setCallAccepted(false);
   
  });
  return (
    <div className="bg-green-300 h-screen w-screen">
    {/* Top section with user info and call buttons */}

    <div className="bg-green-100 fixed top-[10px] left-[50%] translate-x-[-50%] z-[100]  p-3 rounded-lg flex items-center justify-between w-[320px] md:w-[500px] mx-auto">
      <div className="flex items-center gap-4">
        <img
          className="avatar"
          src={`${process.env.REACT_APP_BACKEND_URL}${selectedUser.profileImage}`}
          alt="Receiver Profile"
        />
        <div>
          <p className="">
            {selectedUser.firstName} {selectedUser.lastName}
          </p>
          {(remoteStream && myStream )&& <p>{formatTime(elapsedTime)}</p>}
        </div>
      </div>
      <div className="flex gap-3">
        {
          (remoteStream && myStream) && (
        <button className="h-[50px] w-[50px] flex items-center justify-center bg-green-500 rounded-full border-none" onClick={()=> setSound(!sound)}>
          {sound ? <Mic color="#fff" size={20}/> : <MicMute color="#fff" size={20}/>}        
        </button>
          )
        } 
        {!callAccepted && (
          <button
            onClick={acceptCall}
            className="h-[50px] w-[50px] flex items-center justify-center bg-green-500 rounded-full border-none"
          >
            <TelephoneFill color="white" />
          </button>
        )}
        <button
          onClick={() => {
            if (myStream) {
              myStream.getTracks().forEach(track => track.stop());
              setMyStream(null);
            }
            if (remoteStream) {
              remoteStream.getTracks().forEach(track => track.stop());
              setRemoteStream(null);
            }
            callEnd(selectedUser?.email);
          }}
          className="h-[50px] w-[50px] flex items-center justify-center bg-red-500 rounded-full border-none"
        >
          <TelephoneFill color="white" className="rotate-[135deg]" />
        </button>
      </div>
    </div>

    {/* Remote stream in full size */}
    {remoteStream && (
      <div className="block fixed top-0 right-0 left-0 w-screen h-screen">
        <ReactPlayer muted={!sound} playing height="100%" width="100%" className="video-call-video" url={remoteStream} />
      </div>
    )}

    {/* My stream at bottom right corner */}
    {myStream && (
      <div
        className="block bottom-0 fixed rounded-lg right-0 items-center justify-center  mx-2 mb-4"
        style={{
          width: "300px",
          height: "300px",
        }}
      >
        {/* <h1 className="text-white">My Stream</h1> */}
        <ReactPlayer
          playing
          muted
          height="100%"
          width="100%"
          url={myStream}
        />
      </div>
    )}
  </div>
  );
};

export default AudioCall;
