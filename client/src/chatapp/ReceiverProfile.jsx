import React, { useState, useContext, useCallback } from "react";
import { XLg, Trash3Fill } from "react-bootstrap-icons";
import { ChatStates } from "./ChatStates";
import ImagePreview from "./ImagePreview";

function ReceiverProfile() {
  const { receiverInfo, setReceiverInfo, selectedUser, imageView, setImageView, imageUrl, setImageUrl } =
    useContext(ChatStates);
  const formatedDate = new Date(selectedUser?.created_at).toLocaleString();
  const [deletePopUp, setDeletePopUp] = useState(false);
  const handleDelete = () => {
    alert("Delete Logic will execute");
    setDeletePopUp(false);
  };
  const ImageSrc = `${process.env.REACT_APP_BACKEND_URL}${selectedUser.profileImage}`
  
  const showImagePreview = useCallback((URL)=>{
    setImageView(true);
    setImageUrl(URL)
  },[imageView])
  
  return (
    <>
    {imageView && <ImagePreview url={imageUrl} />}
    <div
      className={`${
        receiverInfo
          ? "md:w-[30%] overflow-auto dark:border-l-[1px] border-[#d1d7db]"
          : "hidden"
      }`}
    >
      <div className="header sm:border-l-[1px] sm:border-[#d1d7db] dark:border-none bg-[#f0f2f5] dark:bg-slate-900 h-[60px] flex items-center px-4">
        <button
          className="mr-4 hover:bg-slate-300 dark:hover:bg-transparent ease-linear duration-200  h-[30px] w-[30px] flex items-center justify-center rounded-[50%]"
          onClick={() => setReceiverInfo(false)}
        >
          <XLg size={18} className="dark:text-white" />
        </button>{" "}
        <br />
        <h3 className="ml-3 dark:text-white">Contact Info</h3>
      </div>
      <div className="max-h-[calc(100vh-60px)] bg-[#f0f2f5] dark:bg-slate-800 overflow-y-auto overflow-x-hidden ">
        <div className="receiver-info bg-white dark:bg-slate-800 shadow-lg dark:shadow-none  px-4 py-8 ">
          <div className="image" onClick={()=>showImagePreview(ImageSrc)}>
            <img
              src={ImageSrc}
              alt="receiverImage"
            />
          </div>
          <h2 className="text-xl text-center text-gray-700 mt-3 dark:text-white">
            {selectedUser.firstName} {selectedUser.lastName}
          </h2>
          <p className="text-gray-600 text-center dark:text-white">
            {selectedUser.email}
          </p>
        </div>
        <div className="receiver-about bg-white shadow-lg dark:bg-slate-900 dark:shadow-none  px-4 py-4 mt-3">
          <p className="text-gray-600 dark:text-white">About</p>
          <p className="text-gray-900 text-sm md:text-lg dark:text-white">
            {selectedUser.bio}
          </p>
        </div>
        <div className="joined-since bg-white shadow-lg dark:bg-slate-900 dark:shadow-none  px-4 py-4 mt-3 mb-3">
          <p className="text-gray-600 dark:text-white">Joined Since</p>
          <p className="text-gray-900 text-sm md:text-lg dark:text-white">
            {formatedDate}
          </p>
        </div>
        <div className="bg-white shadow-lg py-4 dark:bg-slate-900 dark:shadow-none mt-3 mb-3">
          <li
            className="flex items-center  px-4 py-2 text-red-500 hover:bg-slate-100 dark:hover:bg-transparent cursor-pointer ease-linear duration-100"
            onClick={() => setDeletePopUp(true)}
          >
            {" "}
            <Trash3Fill className="mr-5" /> Delete Chat
          </li>
        </div>
      </div>
      {deletePopUp && (
        <div className="popup-container">
          <div className="popup">
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this chat?</p>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 mr-4 bg-gray-300 ease-linear dark:bg-white duration-200 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => setDeletePopUp(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-slate-600 ease-linear duration-200 text-white rounded hover:bg-slate-700 dark:bg-slate-900"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
    </>
    
  );
}

export default ReceiverProfile;
