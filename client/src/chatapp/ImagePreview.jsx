import React, { useContext } from "react";
import { Download, X } from "react-bootstrap-icons";
import { ChatStates } from "./ChatStates";

const ImagePreview = ({ url }) => {
  const { imageView, setImageView } = useContext(ChatStates);
  console.log(url)
  const downloadImage = (imageUrl) => {
    var element = document.createElement("a");
    var file = new Blob([imageUrl], { type: "image/*" });
    element.href = URL.createObjectURL(file);
    element.download = 'image.jpg';
    element.click();
  }
  return (
    <div className="w-screen z-10 opacity-95 dark:bg-gray-800 h-screen bg-white fixed top-0 right-0 bottom-0 left-0">
      <div className=" flex gap-5 items-center justify-center py-4">
        <a href={url} target="_blank" download onClick={()=> downloadImage(url)}>
          <Download size={24} className="dark:text-white" />
        </a>
        <button className="dark:text-white" onClick={() => setImageView(false)}>
          <X size={24} />{" "}
        </button>
      </div>
      <div className="h-[calc(100vh-40px)] w-full flex items-center justify-center mt-4">
        <div className="">
          <img
            src={url}
            alt=""
            className="w-auto h-full max-h-[80vh] max-w-[400px] rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
