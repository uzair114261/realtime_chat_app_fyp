import React, { useState, useEffect, useContext } from "react";
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContext } from "../App";

const Register = () => {
  const [confPassTouch, setConfPassTouch] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfPass, setShowConfPass] = useState(false);
  const [bioLimit, setBioLimit] = useState(0);
  const navigate = useNavigate()
  useEffect(() => {
    const access = localStorage.getItem('access');
    const refresh = localStorage.getItem('refresh');
    const userData = localStorage.getItem('userData');
    if (access && refresh && userData) {
      navigate('/');
    }
  }, [navigate]);
  const showToast = useContext(ToastContext)
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    bio: "",
    profileImage: null,
  });
  const [error, setError] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const EmailHandler = (e) => {
    const newEmail = e.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setError({ ...error, email: 'Please Enter a valid email address' })
    } else {
      setError({ ...error, email: '' })
    }
    setUserData({
      ...userData,
      email: newEmail
    })
  };
  const PasswordHandler = (e) => {
    const newPassword = e.target.value;
    const symbolRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
    const numericRegex = /[0-9]/;
    if (newPassword.length < 8) {
      setError({ ...error, password: 'atleast 8 character long' });
    } else if (!symbolRegex.test(newPassword) && !numericRegex.test(newPassword)) {
      setError({ ...error, password: 'atleast one symbol or numeric character' });
    } else if (newPassword.length > 15) {
      setError({ ...error, password: 'The password is too long' });
    } else {
      setError({ ...error, password: '' })
    }
    setUserData({
      ...userData,
      password: newPassword
    })
  };
  const ConfirmPasswordHandler = (e) => {
    const newConfPassword = e.target.value;
    setConfPassTouch(true);
    setUserData({
      ...userData,
      confirmPassword: newConfPassword
    })
  };
  useEffect(() => {
    const currentPassword = userData.password;
    const newConfPassword = userData.confirmPassword;
    setError(prevError => {
      if (currentPassword !== newConfPassword) {
        return { ...prevError, confirmPassword: 'It does not match with password' }
      } else {
        return { ...prevError, confirmPassword: '' }
      }
    });
  }, [userData.password, userData.confirmPassword, setError]);
  const togglePassVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfPassVisibility = () => {
    setShowConfPass(!showConfPass);
  };
  const bioHandler = (e) => {
    const textLength = e.target.value.length;
    if (textLength <= 100) {
      setBioLimit(textLength);
      setUserData({ ...userData, bio: e.target.value })
    }
  };

  const handleRegisterSubmit = (event) => {
    event.preventDefault();
    if (!userData.email || !userData.password || !userData.confirmPassword || !userData.firstName || !userData.lastName || !userData.bio || !userData.profileImage) {
      alert('Please fill all required fields');
      return;
    }
    const formData = new FormData();
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    formData.append("confirmPassword", userData.confirmPassword);
    formData.append("firstName", userData.firstName);
    formData.append("lastName", userData.lastName);
    formData.append("bio", userData.bio);
    if (userData.profileImage) {
      formData.append("profileImage", userData.profileImage, userData.profileImage.name);
    }
    let url = `${process.env.REACT_APP_BACKEND_URL}users/api/create_user`;
    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then(res => {
        console.log(res);
        if (res.ok) {
          setUserData({
            email: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: "",
            bio: "",
            profileImage: null
          });
          showToast.success('Registration successful', {
            autoClose: 3000
          })
          navigate('/login')
        } else if (res.status === 400) {
          showToast.error('Email Already exists, Try with different one!', {
            autoClose: 3000
          })
        } else {
          console.log('An error occured', res.status);
        }
      })
      .catch((err) => {
        console.error(err);
        showToast.error('Server is not responding', {
          autoClose: 3000
        })
      });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-50">

      <form onSubmit={handleRegisterSubmit} className="p-4 bg-slate-100 rounded shadow shadow-slate-600">
        <div className="text-center">
          <h2 className="font-bold text-xl">SignUp to account</h2>
        </div>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 mt-3">
          <div className="floating-label-content mb-4">
            <input placeholder=" " type="text" className="floating-input border border-gray-200 shadow-sm" name="firstName" value={userData.firstName} onChange={(e) => setUserData({ ...userData, firstName: e.target.value })} />
            <label htmlFor="first-name" className="floating-label">First Name</label>
          </div>
          <div className="floating-label-content mb-4">
            <input placeholder=" " type="text" className="floating-input border border-gray-200 shadow-sm" name="lastName" value={userData.lastName} onChange={(e) => setUserData({ ...userData, lastName: e.target.value })} />
            <label htmlFor="last-name" className="floating-label">Last Name</label>
          </div>
        </div>
        <div className="grid grid-cols-1">
          <div className="floating-label-content mb-3">
            <input type="email" placeholder=" " className='floating-input border border-gray-200 shadow-sm' name='email' onChange={EmailHandler} value={userData.email} />
            <label htmlFor="" className="floating-label">Email</label>
          </div>
          <span className="error">{error.email}</span>
        </div>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 my-2">
          <div className="floating-label-content">
            <input type={showPassword ? 'text' : 'password'} className='floating-input border border-gray-200 shadow-sm' placeholder=" " name="password" id="password" onChange={PasswordHandler} value={userData.password} />
            <button type='button' className="absolute right-2 top-2" tabIndex={-1} onClick={togglePassVisibility}>{
              !showPassword ? <EyeFill size={20} /> : <EyeSlashFill size={20} />
            }</button>
            <label htmlFor="" className="floating-label">Password</label>
            <span className='error'>{error.password}</span>
          </div>
          <div className="floating-label-content mb-2">
            <input type={showConfPass ? 'text' : 'password'} placeholder=" " value={userData.confirmPassword} className='floating-input border border-gray-200 shadow-sm' name="confirmPassword" id="confirmPassword" onChange={ConfirmPasswordHandler} />
            <button type="button" className="absolute right-2 top-2" tabIndex={-1} onClick={toggleConfPassVisibility}>{
              !showConfPass ? <EyeFill size={20} /> : <EyeSlashFill size={20} />
            }</button>
            <label htmlFor="" className="floating-label">Confirm Password</label>
            {confPassTouch && <span className='error'>{error.confirmPassword}</span>}
          </div>
        </div>
        <div className="file-choosing mb-3">
          <label htmlFor="file-input" className="sr-only">Choose file</label>
          <input type="file" id="file-input" className="file-selection-input" accept="image/*" onChange={(event) => { setUserData({ ...userData, profileImage: event.target.files[0] }) }} />
        </div>
        <div className="floating-label-content">
          <input type="text" className="floating-input border border-gray-200 shadow-sm" placeholder=" " onChange={bioHandler} value={userData.bio} maxLength={100} />
          <label className="floating-label" htmlFor="bio">Bio:</label>
        </div>
        <div className="flex justify-end">
          <span className="bio-limit">{bioLimit}/100</span>
        </div>
        <div className="my-3">
          <button type="submit" className="btn-submit flex justify-center items-center p-2 cursor-pointer text-white w-full bg-blue-500 hover:bg-blue-700 ease-linear duration-200 rounded">Sign up</button>
        </div>
        <div className="flex justify-end items-center">
          <Link className="text-blue-600" to='/login'>Login to your account</Link>
        </div>
      </form>
    </div>

  );
};
export default Register;