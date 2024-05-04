import React, { useState,useCallback, useContext } from "react";
import MySelf from "../images/Me.jpeg";
import { Steam, TelephoneFill } from "react-bootstrap-icons";
import { ChatStates } from "./ChatStates";
import { useSocket } from "../provider/SocketProvider";
import peer from "./peer";

const AudioCall = () => {
    const {selectedUser, callAccepted, setCallAccepted, acceptCall, incomingCall, callEnd} = useContext(ChatStates)
    const socket = useSocket()
    const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const handleUserJoined = useCallback(({email, id})=> {
        setRemoteSocketId(id);
        handleCallUser(id);
        
    }, [])
    const handleCallUser = useCallback(async (id) => {
        const callingStrem = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
        })
        const offer = await peer.getOffer();
        socket.emit('user:call',{to: id, offer})
        setMyStream(callingStrem)
    },[socket, remoteSocketId])

    const handleIncomingCall = useCallback(async({from, offer}) => {
        setRemoteSocketId(from);
        const audioStrem = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
        })
        setMyStream(audioStrem)
        console.log('Incoming Call', from, offer)
        const ans = await peer.getAnswer(offer)
        socket.emit('call-accepted', {to: from, ans})
    },[socket])

    const sendStream = useCallback(async()=> {
        for(const track of myStream.getTracks()){
            peer.peer.addTrack(track, myStream)
        }
    },[myStream])

    
  return (
    <div className="bg-green-100 h-screen w-screen flex items-center justify-center">
      <div className="p-4 min-w-[300px] md:w-[400px] bg-white rounded-lg border-[1px] border-solid border-gray-300">
        <div className="text-center">
          <h2 className="text-3xl">Audio Call</h2>
        </div>
        <div className="w-full mt-2">
          <div className="h-[150px] w-[150px] rounded-full mx-auto">
            <img src={`${process.env.REACT_APP_BACKEND_URL}${selectedUser.profileImage}`} alt="" className="w-full h-full rounded-full" />
          </div>
        </div>
        <div className="text-center mt-2">
          <h2 className="text-xl">{selectedUser.firstName} {selectedUser.lastName}</h2>
          <h2 className="text-gray-500">00:12</h2>
        </div>
        <div className="flex gap-3 mt-4 justify-center">
          <button className="h-[50px] w-[50px] flex items-center justify-center bg-green-500 rounded-full border-none">
            <TelephoneFill color="white" />
          </button>
          <button className="h-[50px] w-[50px] flex items-center justify-center bg-red-500 rounded-full border-none">
            <TelephoneFill color="white" className="rotate-[135deg]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioCall;
