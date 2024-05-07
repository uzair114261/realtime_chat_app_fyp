import React, { useCallback, useContext, useState } from "react";
import { ArrowLeft } from "react-bootstrap-icons";
import { ChatStates } from "./ChatStates";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ImagePreview from "./ImagePreview";

function SenderProfile() {
  const [loading, setLoading] = useState(false);
  const { userData, senderProfile, setSenderProfile, imageView, setImageView, imageUrl, setImageUrl } =
    useContext(ChatStates);
  const formatedDate = new Date(userData?.created_at).toLocaleString();
  const [showUpdateUser, setShowUpdateUser] = useState(false);
  const schema = yup.object().shape({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    bio: yup.string().required("Bio is required").max("100"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const updateProfile = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("bio", data.bio);
      formData.append("profileImage", data.image[0]);
      console.log(data);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}users/api/update-user/${userData.email}`,
        {
          method: "POST",
          body: formData,
        }
      );
      console.log(response);
      if (response.ok) {
        // showToast.success("User Profile has been updated");
        const storedUserData =
          JSON.parse(localStorage.getItem("userData"));
        const updateUserData = {
          ...storedUserData,
          firstName: data.firstName,
          lastName: data.lastName,
          bio: data.bio,
          // profileImage: `${process.env.REACT_APP_BACKEND_URL}${userData.profileImage}`,
          profileImage: data.image[0]
        };
        localStorage.setItem("userData", JSON.stringify(updateUserData));

        setShowUpdateUser(false);
        setSenderProfile(false);
      }
    } catch (error) {
      console.error("Error in code: ", error);
    } finally {
      setLoading(false);
    }
  };
  const ImageSrc = `${process.env.REACT_APP_BACKEND_URL}${userData?.profileImage}`;
  const showImagePreview = useCallback((URL)=>{
    setImageView(true);
    setImageUrl(URL)
  },[imageView])
  return (
    <>
      {imageView && <ImagePreview url={imageUrl} />}
      <div
        className={`${
          senderProfile
            ? "md:w-[30%] max-h-[100vh] h-[100vh] overflow-auto"
            : "hidden"
        }`}
      >
        <div className="bg-[#008069] dark:bg-slate-900 h-[60px] flex justify-start items-center px-3">
          <button
            onClick={() => setSenderProfile(false)}
            className="text-white text-xl"
          >
            <ArrowLeft />
          </button>
          <h3 className="ml-4 text-white text-xl">Profile</h3>
        </div>
        <div className="max-h-[calc(100vh-60px)] bg-[#f0f2f5] dark:bg-slate-800 overflow-y-auto overflow-x-hidden ">
          <div className="sender-info bg-[#f0f2f5] dark:bg-slate-800  px-4 py-8 ">
            <div className="image">
              <img
                onClick={() => showImagePreview(ImageSrc)}
                src={ImageSrc}
                alt="senderImage"
              />
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 shadow-lg  px-4 md:px-8 py-4 mt-3">
            <p className="text-gray-600 dark:text-white">Your Name</p>
            <p className="text-gray-900 dark:text-white text-sm md:text-lg">
              {userData?.firstName} {userData?.lastName}
            </p>
          </div>
          <div className="px-4 md:px-8 py-2 mt-3">
            <p className="text-gray-700 text-sm  dark:text-white">
              This is not your username or pin. This name will be visible to
              your Contacts only.
            </p>
          </div>
          <div className="joined-since bg-white dark:bg-slate-900 shadow-lg   px-4 md:px-8 py-4 mt-3 mb-3">
            <p className="text-gray-600 dark:text-white">About</p>
            <p className="text-gray-900 dark:text-white">{userData?.bio}</p>
          </div>
          <div className="joined-since bg-white shadow-lg dark:bg-slate-900  px-4 md:px-8 py-4 mt-3 mb-3">
            <p className="text-gray-600 dark:text-white">Joined Since</p>
            <p className="text-gray-900 dark:text-white text-sm md:text-lg">
              {formatedDate}
            </p>
          </div>
          <div className="px-4 md:px-8 py-4 mt-3 mb-3">
            <button
              className="bg-[#008069] px-2 py-1 rounded text-sm text-white dark:bg-white dark:text-black"
              onClick={() => setShowUpdateUser(true)}
            >
              Update Profile
            </button>
          </div>
        </div>
        {showUpdateUser && (
          <div className="popup-container">
            <div className="popup">
              <h2 className="text-lg font-bold mb-4">Update Your Profile</h2>
              <div className="mb-4 mx-auto">
                <form action="" onSubmit={handleSubmit(updateProfile)}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                    <div className="">
                      <label htmlFor="firstName" className="block">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        className="w-full p-2 border-[1px] border-gray-400 border-solid rounded outline-blue-500 dark:bg-gray-700 dark:outline-none"
                        {...register("firstName")}
                      />
                      {errors.firstName && (
                        <div className="error">{errors.firstName.message}</div>
                      )}
                    </div>
                    <div className="">
                      <label htmlFor="lastName" className="block">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        className="w-full p-2 border-[1px] border-gray-400 border-solid rounded outline-blue-500 dark:bg-gray-700 dark:outline-none"
                        {...register("lastName")}
                      />
                      {errors.lastName && (
                        <div className="error">{errors.lastName.message}</div>
                      )}
                    </div>
                  </div>
                  <div className="">
                    <label htmlFor="lastName" className="block">
                      Bio
                    </label>
                    <input
                      maxLength={100}
                      type="text"
                      id="lastName"
                      className="w-full p-2 border-[1px] border-gray-400 border-solid rounded outline-blue-500 dark:bg-gray-700 dark:outline-none"
                      {...register("bio")}
                    />
                    {errors.bio && (
                      <div className="error">{errors.lastName.message}</div>
                    )}
                  </div>
                  <div className="file-choosing my-3">
                    <label htmlFor="file-input" className="sr-only">
                      Choose Profile
                    </label>
                    <input
                      type="file"
                      id="file-input"
                      className="file-selection-input"
                      accept="image/*"
                      multiple={false}
                      {...register("image")}
                    />
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      className="px-4 py-2 mr-4 bg-gray-300 ease-linear duration-200 text-gray-700 dark:bg-white rounded hover:bg-gray-400"
                      onClick={() => setShowUpdateUser(false)}
                    >
                      Cancel
                    </button>
                    <button
                      tabIndex="1"
                      className="px-4 py-2 bg-slate-600 ease-linear duration-200 dark:bg-slate-900 text-white rounded hover:bg-slate-700"
                    >
                      {loading ? (
                        <div className="flex gap-2 items-center">
                          <div>Updating</div> <div className="spinner"></div>
                        </div>
                      ) : (
                        "Update"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default SenderProfile;
