import React, { useState, useEffect, useContext } from "react";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useToast } from "../CustomHooks/ToastContext";

const Register = () => {
  const { notifySuccess, notifyError } = useToast();
  const [loading, setLoading] = useState(false);
  const [bioLimit, setBioLimit] = useState(0);
  const [passVisible, setPassVisible] = useState(false);
  const [confPassVisible, setConfPassVisible] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");
    const userData = localStorage.getItem("userData");
    if (access && refresh && userData) {
      navigate("/");
    }
  }, [navigate]);
  const schema = yup.object().shape({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    email: yup
      .string()
      .email("Invalid Email address")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Minimum 6 characters long")
      .max(15, "Too much long password")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .required("Confirm Password is required")
      .oneOf([yup.ref("password")], "Password do not match"),
    bio: yup.string().required("Bio is required").max("100"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const passwordVisibility = () => {
    setPassVisible(!passVisible);
  };
  const ConfPasswordVisibility = () => {
    setConfPassVisible(!confPassVisible);
  };
  const registerSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword);
      formData.append("profileImage", data.image[0]);
      formData.append("bio", data.bio);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}users/api/create_user`,
        {
          method: "POST",
          body: formData,
        }
      );
      
      if (response.ok) {
        notifySuccess("User is registered successfully.");
        navigate("/login");
      }

      const responseData = await response.json()
      if(!response.ok){
        if(responseData.email){
          notifyError(responseData.email[0])
        }
      }
    } catch (error) {
      console.error("Error in code: ", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <form
        onSubmit={handleSubmit(registerSubmit)}
        className="p-4 rounded-lg bg-white border-[1px] border-solid border-gray-200"
      >
        <div className="text-center">
          <h2 className="font-bold text-xl">SignUp to account</h2>
        </div>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 mt-3">
          <div className="floating-label-content mb-4">
            <input
              placeholder=" "
              {...register("firstName")}
              type="text"
              className="floating-input border border-gray-200 shadow-sm"
              name="firstName"
            />
            <label htmlFor="first-name" className="floating-label">
              First Name
            </label>
            {errors.firstName && (
              <span className="text-sm text-red-600">
                {errors.firstName.message}
              </span>
            )}
          </div>
          <div className="floating-label-content mb-4">
            <input
              placeholder=" "
              {...register("lastName")}
              type="text"
              className="floating-input border border-gray-200 shadow-sm"
              name="lastName"
            />
            <label htmlFor="last-name" className="floating-label">
              Last Name
            </label>
            {errors.lastName && (
              <span className="text-sm text-red-600">
                {errors.lastName.message}
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1">
          <div className="floating-label-content mb-3">
            <input
              type="email"
              {...register("email")}
              placeholder=" "
              className="floating-input border border-gray-200 shadow-sm"
              name="email"
            />
            <label htmlFor="" className="floating-label">
              Email
            </label>
            {errors.email && (
              <span className="text-sm text-red-600">
                {errors.email.message}
              </span>
            )}
          </div>
        </div>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 my-2">
          <div className="floating-label-content">
            <input
              type={`${passVisible ? "text" : "password"}`}
              {...register("password")}
              className="floating-input border border-gray-200 shadow-sm"
              placeholder=" "
              name="password"
              id="password"
            />
            <button
              type="button"
              className="absolute right-2 top-2"
              onClick={passwordVisibility}
              tabIndex={-1}
            >
              {passVisible ? <EyeSlashFill /> : <EyeFill />}
            </button>
            <label htmlFor="" className="floating-label">
              Password
            </label>
            {errors.password && (
              <span className="text-sm text-red-600">
                {errors.password.message}
              </span>
            )}
          </div>
          <div className="floating-label-content mb-2">
            <input
              type={`${confPassVisible ? "text" : "password"}`}
              {...register("confirmPassword")}
              placeholder=" "
              className="floating-input border border-gray-200 shadow-sm"
              name="confirmPassword"
              id="confirmPassword"
            />
            <button
              type="button"
              className="absolute right-2 top-2"
              tabIndex={-1}
              onClick={ConfPasswordVisibility}
            >
              {confPassVisible ? <EyeSlashFill /> : <EyeFill />}
            </button>
            <label htmlFor="" className="floating-label">
              Confirm Password
            </label>
            {errors.confirmPassword && (
              <span className="text-sm text-red-600">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
        </div>
        <div className="file-choosing mb-3">
          <label htmlFor="file-input" className="sr-only">
            Choose Profile
          </label>
          <input
            type="file"
            id="file-input"
            className="file-selection-input"
            {...register("image")}
            accept="image/*"
            multiple={false}
          />
        </div>
        <div className="floating-label-content">
          <input
            type="text"
            {...register("bio")}
            onChange={(e) => setBioLimit(e.target.value.length)}
            className="floating-input border border-gray-200 shadow-sm"
            placeholder=" "
            maxLength={100}
          />
          <label className="floating-label" htmlFor="bio">
            Bio:
          </label>
          {errors.bio && (
            <span className="text-sm text-red-600">{errors.bio.message}</span>
          )}
        </div>
        <div className="flex justify-end">
          <span className="bio-limit">{bioLimit}/100</span>
        </div>
        <div className="my-3">
          <button
            type="submit"
            className="flex justify-center items-center p-1 cursor-pointer text-white w-full bg-[#008069] rounded"
          >
            {loading ? <div className="spinner"></div> : <div>Sign Up</div>}
          </button>
        </div>
        <div className="flex justify-end items-center">
          <Link className="text-slate-600" to="/login">
            Login to your account
          </Link>
        </div>
      </form>
    </div>
  );
};
export default Register;
