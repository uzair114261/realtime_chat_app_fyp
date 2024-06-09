import React, { useCallback, useContext, useMemo, useRef, useState } from "react";
import {
  CameraVideoFill,
  TelephoneFill,
  ThreeDotsVertical,
  ArrowLeft,
  SendFill,
  Plus,
  MicFill,
  CameraFill,
  ImageFill,
  Files,
  LockFill,
  FilePdf,
  MicMute,
  MicMuteFill,
  Trash,
} from "react-bootstrap-icons";
import ReceiverProfile from "./ReceiverProfile";
import useClickOutside from "../CustomHooks/useClickOutside";
import { ChatStates } from "./ChatStates";
import { useSocket } from "../provider/SocketProvider";
import VoiceMessage from "./VoiceMessage";
import ImagePreview from "./ImagePreview";

const ChatMessages = () => {
  const {
    receiverInfo,
    setReceiverInfo,
    chatOpen,
    setChatOpen,
    selectedUser,
    messages,
    userData,
    sendTextMessage,
    setSendTextMessage,
    sendButton,
    setFile,
    file,
    setAudioCall,
    setVideoCall,
    setCallAccepted,
    genrateAudioCall,
    genrateVideoCall,
    setAudioFile,
    audioBlob,
    setAudioBlob, imageView, setImageView, imageUrl, setImageUrl,
    deleteMessage
  } = useContext(ChatStates);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showInputBox, setShowInputBox] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const dropdownRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [recording, setRecording] = useState(false);
  
  const mediaRecorderRef = useRef(null);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
  
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };
  
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        setAudioBlob(blob);
        const audioBlobFile = new File([blob], 'audio.wav', { type: 'audio/wav' });
        setAudioFile([audioBlobFile]); // Remove the square brackets around audioBlobFile
      };
  
      mediaRecorder.start();
      setRecording(true);
    })
    .catch((error) => console.error("Error accessing microphone:", error));
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setRecording(false);
    }
  };

  const handleChange = (e) => {
    setFile([...file, e.target.files[0]]);
  };
  const handleOutsideClick = () => {
    setShowDropdown(false);
    setShowInputBox(false);
  };
  useClickOutside(dropdownRef, handleOutsideClick);

  const handlePressEnter = (event) => {
    if (event.key === "Enter") {
      sendButton();
    }
  };
  const messageTime = (timeString) => {
    const timestamp = new Date(timeString);
    const minutes = timestamp.getMinutes();
    let hours = timestamp.getHours();

    let amOrPm = "AM";
    if (hours === 0) {
      hours = 12;
    } else if (hours === 12) {
      amOrPm = "PM";
    } else if (hours > 12) {
      amOrPm = "PM";
      hours -= 12;
    }
    return `${hours}:${minutes} ${amOrPm}`;
  };

  const filteredMessages = messages.filter(
    (message) =>
      (message.sender === selectedUser?.id &&
        message.receiver === userData?.id) ||
      (message.sender === userData?.id && message.receiver === selectedUser?.id)
  );

  

  const showImagePreview = useCallback((URL) => {
    setImageView(true)
    setImageUrl(URL);
  }, [imageView]);
  

  return (
    <>
      
      {selectedUser ? (
        <>
          <div
            className={`${
              receiverInfo ? "md:w-[40%] max-md:hidden" : "md:w-[70%]"
            } max-h-[100vh] relative  h-[100vh] overflow-auto ${
              !chatOpen && "max-md:hidden"
            }`}
          >
            <div className="flex justify-between items-center dark:bg-slate-900 bg-[#f0f2f5] h-[60px] px-1 md:px-3">
              <div className="flex">
                <button
                  className="mr-1 md:hidden"
                  onClick={() => setChatOpen(false)}
                >
                  <ArrowLeft className="text-black dark:text-white" />
                </button>
                <div
                  className="receiver-info h-full flex items-center cursor-pointer"
                  onClick={() => setReceiverInfo(true)}
                >
                  <div className="flex">
                    <img
                      className="avatar"
                      src={`${process.env.REACT_APP_BACKEND_URL}${selectedUser.profileImage}`}
                      alt="Receiver Profile"
                    />
                  </div>
                  <div className=" ml-3">
                    <h5 className="text-md leading-4 mb-1 dark:text-white">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h5>
                    
                  </div>
                </div>
              </div>
              <div className="flex gap-5 items-center">
                <button
                  className=""
                  id="audioCall"
                  onClick={() => {
                    genrateAudioCall();
                    setAudioCall(true);
                    setCallAccepted(true);
                  }}
                >
                  <TelephoneFill
                    className="text-[#54656f] dark:text-white"
                    size={20}
                  />
                </button>
                <button
                  className=""
                  id="videoCall"
                  onClick={() => {
                    genrateVideoCall();
                    setVideoCall(true);
                    setCallAccepted(true);
                  }}
                >
                  <CameraVideoFill
                    className="text-[#54656f] dark:text-white"
                    size={20}
                  />
                </button>
                <button
                  onClick={() => setShowDropdown(true)}
                  type="button"
                  className=" "
                  id="menu-button"
                  aria-expanded="true"
                  aria-haspopup="true"
                >
                  <ThreeDotsVertical
                    size={20}
                    className="text-[#54656f] dark:text-white"
                  />
                </button>
                <div className="relative ">
                  <div
                    ref={dropdownRef}
                    className="relative inline-block text-left"
                  >
                    {showDropdown && (
                      <div
                        className="absolute right-[20px] z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="menu-button"
                        tabindex="-1"
                      >
                        <div className="py-1" role="none">
                          <li
                            className="hover:bg-gray-100 ease-linear duration-150 text-gray-700 block px-4 py-2 text-sm"
                            role="menuitem"
                            tabindex="-1"
                            id="menu-item-0"
                          >
                            Clear Chat
                          </li>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[calc(100vh-60px)] max-h-[calc(100vh-60px)] overflow-y-auto overflow-x-hidden bg-[#AED8C7] dark:bg-slate-800 flex flex-col-reverse">
              <div className="flex flex-col mb-20">
                {filteredMessages.map((message, index) => (
                  <div
                    key={message.id}
                    className={` group flex justify-between items-end py-1 px-2 text-sm rounded mt-1 mx-2 md:mx-4 relative ${
                      message.sender === userData.id
                        ? "self-end bg-[#D9FDD3] dark:bg-slate-700"
                        : "self-start bg-[#ffff] dark:bg-slate-600"
                    }`}
                  >
                    {message.sender === userData.id && (
                      <div className="absolute -left-10 items-center   h-full ps-5 hidden group-hover:flex">
                      <Trash className="w-5 mt-2 text-red-700 cursor-pointer" onClick={() => deleteMessage(message.id)} />
                    </div>
                    )}
                    {message.content_type.includes("image") ? (
                      <div
                        className={`max-w-[400px] h-[400px] bg-[${
                          message.sender === userData.id ? "#D9FDD3" : "#fff"
                        }] dark:bg-[${
                          message.sender === userData.id
                            ? "slate-600"
                            : "slate-600"
                        }]`}
                      >
                        <img onClick={() => showImagePreview(`${process.env.REACT_APP_BACKEND_URL}${message.file}`)}
                          className="w-full h-[380px] cursor-pointer"
                          src={`${process.env.REACT_APP_BACKEND_URL}${message.file}`}
                          alt=""
                        />
                        <div className="flex justify-between items-center h-[20px]">
                          <div className="max-w-[180px] mt-1">
                            {message.content}
                          </div>
                          <div className="max-w-[70px] text-gray-500 text-[10px] flex items-end">
                            {message.time}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {message.content_type.includes("video") ? (
                          <div
                            className={`max-w-[400px]  bg-[${
                              message.sender === userData.id
                                ? "#D9FDD3"
                                : "#fff"
                            }] dark:bg-[${
                              message.sender === userData.id
                                ? "slate-600"
                                : "slate-600"
                            }]`}
                          >
                            <video
                              className="w-full max-h-[380px]"
                              src={`${process.env.REACT_APP_BACKEND_URL}${message.file}`}
                              alt=""
                              controls
                            />
                            <div className="flex justify-between items-center h-[20px]">
                              <div className="max-w-[180px] mt-1">
                                {message.content}
                              </div>
                              <div className="max-w-[70px] text-gray-500 text-[10px] flex items-end">
                                {message.time}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            {message.content_type.includes("audio") ? (
                              <>
                                <div
                                  className={`max-w-[400px]  bg-[${
                                    message.sender === userData.id
                                      ? "#D9FDD3"
                                      : "#fff"
                                  }] dark:bg-[${
                                    message.sender === userData.id
                                      ? "slate-600"
                                      : "slate-600"
                                  }]`}
                                >
                                  <VoiceMessage
                                    className="w-full min-w-[400px]"
                                    url={`${process.env.REACT_APP_BACKEND_URL}${message.file}`}
                                    
                                  />
                                  
                                </div>
                              </>
                            ) : (
                              <>
                                
                                <>
                                  {!message.content_type.includes("image") &&
                                  !message.content_type.includes("video") &&
                                  !message.content_type.includes("text") &&
                                  !message.content_type.includes("audio") ? (
                                    <>
                                      <a
                                        target="_blank"
                                        href={`${process.env.REACT_APP_BACKEND_URL}${message.file}`}
                                        className="bg-white p-3 flex flex-col gap-y-3 rounded-lg justify-center text-center"
                                      >
                                        <FilePdf className="text-7xl text-red-600 text-center mx-auto" />
                                        <div className="truncate max-w-[150px]">
                                          {message.file?.replace(
                                            "/media/messages/",
                                            ""
                                          )}
                                        </div>
                                      </a>{" "}
                                      <div className="flex justify-between items-center h-[20px]">
                                        <div className="max-w-[180px] mt-1">
                                          {message.content}
                                        </div>
                                        <div className="max-w-[70px] text-gray-500 text-[10px] flex items-end">
                                          {message.time}
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="max-w-[250px] min-w-[220px] flex">
                                      <div className="max-w-[180px] min-w-[150px] dark:text-white ">
                                        {message.content}
                                      </div>
                                      <div className="max-w-[70px] min-w-[70px] text-gray-500 text-xs flex justify-end items-end dark:text-white">
                                        {messageTime(message.timestamp)}
                                      </div>
                                    </div>
                                  )}
                                </>
                                
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                ))}
                {imageView && <ImagePreview url={imageUrl}/>}
              </div>
              {file.length > 0 && (
                <div className="absolute bottom-[10px] max-w-xl z-40 rounded-lg w-full bg-[#f0f2f5] dark:bg-slate-950 shadow-md px-4  ">
                  <div className="flex gap-2 items-center overflow-auto py-10 justify-center">
                    {file.map((singleFile) => (
                      <>
                        {singleFile.type.includes("image") && (
                          <img
                            src={URL.createObjectURL(singleFile)}
                            className="w-[100px] "
                          />
                        )}
                        {singleFile.type.includes("video") && (
                          <video
                            src={URL.createObjectURL(singleFile)}
                            controls
                            className="w-[500px] "
                          />
                        )}
                        {!singleFile.type.includes("video") &&
                          !singleFile.type.includes("image") && (
                            <>
                              <div className="bg-white p-3 flex flex-col gap-y-3 rounded-lg justify-center text-center">
                                <FilePdf className="text-7xl text-red-600 text-center mx-auto" />
                                <div className="truncate max-w-[150px]">
                                  {singleFile.name}
                                </div>
                              </div>
                            </>
                          )}
                      </>
                    ))}
                  </div>
                  <div>
                    <div className="flex h-[50px] items-center justify-between">
                      <div className="relative">
                        <div
                          ref={dropdownRef}
                          className="relative inline-block"
                        >
                          <div>
                            <button
                              onClick={() => setShowInputBox(true)}
                              type="button"
                              className=" "
                              id="menu-button"
                              aria-expanded="true"
                              aria-haspopup="true"
                            >
                              <Plus size={23} className="dark:text-white" />
                            </button>
                          </div>
                          {showInputBox && (
                            <div
                              className="absolute right-[-160px] top-[-130px] z-10 mt-2 w-[170px] origin-top-right rounded-md bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                              role="menu"
                              aria-orientation="vertical"
                              aria-labelledby="menu-button"
                              tabindex="-1"
                            >
                              <div className="py-1" role="none">
                                <li
                                  className="hover:bg-gray-100 dark:text-white dark:hover:text-black ease-linear duration-150 text-gray-700 block px-4 py-2 text-sm"
                                  role="menuitem"
                                  tabindex="-1"
                                  id="menu-item-0"
                                >
                                  <button
                                    className="flex items-center gap-5 w-full"
                                    onClick={() =>
                                      imageInputRef.current.click()
                                    }
                                  >
                                    <CameraFill size={22} color="red" />
                                    <p>Images</p>
                                  </button>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleChange}
                                    ref={imageInputRef}
                                    style={{ display: "none" }}
                                  />
                                </li>
                                <li
                                  className="hover:bg-gray-100 dark:text-white dark:hover:text-black ease-linear duration-150 text-gray-700 block px-4 py-2 text-sm"
                                  role="menuitem"
                                  tabindex="-1"
                                  id="menu-item-0"
                                >
                                  <button
                                    className="flex items-center gap-5 w-full"
                                    onClick={() =>
                                      videoInputRef.current.click()
                                    }
                                  >
                                    <ImageFill color="#2563eb" size={22} />
                                    <p>Videos</p>
                                  </button>
                                  <input
                                    type="file"
                                    accept="video/*"
                                    onChange={handleChange}
                                    ref={videoInputRef}
                                    style={{ display: "none" }}
                                  />
                                </li>
                                <li
                                  className="hover:bg-gray-100 dark:text-white dark:hover:text-black ease-linear duration-150 text-gray-700 block px-4 py-2 text-sm"
                                  role="menuitem"
                                  tabindex="-1"
                                  id="menu-item-0"
                                >
                                  <button
                                    className="flex items-center gap-5 w-full"
                                    onClick={() => fileInputRef.current.click()}
                                  >
                                    <Files color="#2563eb" size={22} />
                                    <p>Files</p>
                                  </button>
                                  <input
                                    type="file"
                                    accept=".xlsx,.xls,.doc, .docx,.ppt, .pptx,.txt,.pdf"
                                    onChange={handleChange}
                                    ref={fileInputRef}
                                    style={{ display: "none" }}
                                  />
                                </li>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={sendButton}
                        className="rotate-45 text-xl h-[30px] w-[30px]"
                      >
                        <SendFill size={30} color="#54656f" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="absolute bottom-0 w-full bg-[#f0f2f5] dark:bg-slate-950 shadow-md px-4 h-[65px] flex items-center">
                <div className="flex-none">
                  <div className="flex h-[50px] items-center justify-center">
                    <div className="relative">
                      <div ref={dropdownRef} className="relative inline-block">
                        <div>
                          <button
                            onClick={() => setShowInputBox(true)}
                            type="button"
                            className=" "
                            id="menu-button"
                            aria-expanded="true"
                            aria-haspopup="true"
                          >
                            <Plus size={23} className="dark:text-white" />
                          </button>
                        </div>
                        {showInputBox && (
                          <div
                            className="absolute right-[-160px] top-[-130px] z-10 mt-2 w-[170px] origin-top-right rounded-md bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="menu-button"
                            tabindex="-1"
                          >
                            <div className="py-1" role="none">
                              <li
                                className="hover:bg-gray-100 dark:text-white dark:hover:text-black ease-linear duration-150 text-gray-700 block px-4 py-2 text-sm"
                                role="menuitem"
                                tabindex="-1"
                                id="menu-item-0"
                              >
                                <button
                                  className="flex items-center gap-5 w-full"
                                  onClick={() => imageInputRef.current.click()}
                                >
                                  <CameraFill size={22} color="red" />
                                  <p>Images</p>
                                </button>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleChange}
                                  ref={imageInputRef}
                                  style={{ display: "none" }}
                                />
                              </li>
                              <li
                                className="hover:bg-gray-100 dark:text-white dark:hover:text-black ease-linear duration-150 text-gray-700 block px-4 py-2 text-sm"
                                role="menuitem"
                                tabindex="-1"
                                id="menu-item-0"
                              >
                                <button
                                  className="flex items-center gap-5 w-full"
                                  onClick={() => videoInputRef.current.click()}
                                >
                                  <ImageFill color="#2563eb" size={22} />
                                  <p>Videos</p>
                                </button>
                                <input
                                  type="file"
                                  accept="video/*"
                                  onChange={handleChange}
                                  ref={videoInputRef}
                                  style={{ display: "none" }}
                                />
                              </li>
                              <li
                                className="hover:bg-gray-100 dark:text-white dark:hover:text-black ease-linear duration-150 text-gray-700 block px-4 py-2 text-sm"
                                role="menuitem"
                                tabindex="-1"
                                id="menu-item-0"
                              >
                                <button
                                  className="flex items-center gap-5 w-full"
                                  onClick={() => fileInputRef.current.click()}
                                >
                                  <Files color="#2563eb" size={22} />
                                  <p>Files</p>
                                </button>
                                <input
                                  type="file"
                                  accept=".xlsx,.xls,.doc, .docx,.ppt, .pptx,.txt,.pdf"
                                  onChange={handleChange}
                                  ref={fileInputRef}
                                  style={{ display: "none" }}
                                />
                              </li>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <input
                  type="text"
                  autoFocus
                  value={sendTextMessage}
                  onKeyPress={handlePressEnter}
                  onChange={(event) => setSendTextMessage(event.target.value)}
                  className="grow px-2 py-2 rounded outline-none dark:bg-slate-800 dark:text-white"
                  placeholder="Type a message"
                />
                <div className="send flex-none px-2">
                  <div className="flex">
                   
                      <div className={audioBlob ? '' : 'hidden'}>
                       
                        <VoiceMessage
                                    className="w-full min-w-[400px]"
                                    url={audioBlob ? URL.createObjectURL(audioBlob) : ''}
                                    
                                  />
                       
                      </div>
                   
                    {sendTextMessage.length > 0 || audioBlob ? (
                      <button
                        onClick={sendButton}
                        className="rotate-45 text-xl h-[30px] w-[30px]"
                      >
                        <SendFill size={30} color="#54656f" />
                      </button>
                    ) : (
                      <>
                        {recording ? (
                          <button
                            type="button"
                            onClick={stopRecording}
                            className="text-xl bg-[#008069] h-[30px] w-[30px] flex items-center justify-center rounded-[50%]"
                          >
                            <MicMuteFill size={17} color="#fff" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={startRecording}
                            className="text-xl bg-[#008069] h-[30px] w-[30px] flex items-center justify-center rounded-[50%]"
                          >
                            <MicFill size={17} color="#fff" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ReceiverProfile />
        </>
      ) : (
        <>
          <div className="hidden bg-[#f0f2f5] dark:bg-slate-800 md:w-[70%] sm:flex items-center justify-center gap-5 flex-col">
            <div className="text-center w-[70%]">
              <h2 className="text-3xl text-gray-600 dark:text-white">
                Realtime Chat Application
              </h2>
              <p className="text-gray-600 text-sm dark:text-white">
                Make audio & video calls and do messages to your friends and
                family and share multimedia files for faster and reliable
                experience
              </p>
            </div>
            <div className="text-center flex items-center gap-5">
              <LockFill className="lock-icon dark:text-white" />{" "}
              <p className="text-gray-600 text-sm dark:text-white">
                Your messages and calls are end-to-end encrypted.
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default ChatMessages;
