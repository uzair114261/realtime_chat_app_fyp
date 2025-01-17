import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { EyeFill, EyeSlashFill, LockFill } from "react-bootstrap-icons";
import { useToast } from "../CustomHooks/ToastContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    if (loginData.email === "" && loginData.password === "") {
      document.getElementsByName("email")[0].value = "";
      document.getElementsByName("password")[0].value = "";
    }
  }, [loginData]);
  const { notifySuccess, notifyError } = useToast();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      notifyError("Please fill all required fields");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('email', loginData.email);
      formData.append('password', loginData.password);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}users/api/login`,
        {
          method: 'POST',
          body: formData
        }
      );
      const responseData = await response.json();
      const { access, refresh, user } = responseData;
  
      if (response.ok) {
        localStorage.clear();
        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);
        localStorage.setItem("userData", JSON.stringify(user));
        notifySuccess("Login Successfully");
        navigate("/");
        setLoginData({
          email: "",
          password: ""
        });
      } else {
        if (responseData.error.includes('Invalid credentials')) {
          notifyError('Invalid credentials');
          setLoginData((prevData) => ({
            ...prevData,
            password: ""
          }));
        } else if (responseData.error.includes('User not found')) {
          notifyError('User not found');
          setLoginData({
            email: "",
            password: ""
          });
        }
      }
    } catch (err) {
      notifyError('Server is down, please try again later');
    } finally {
      setLoading(false);
    }
  };
  
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="h-screen flex items-center justify-center bg-slate-100">
      <form
        action=""
        className="sm:w-[350px]  p-4 bg-white rounded-lg border-[1px] border-solid border-gray-300"
        onSubmit={handleSubmit}
      >
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Realtime Chat Application</h2>
          <div className="text-xl flex justify-center py-3">
            <p className="mr-2">Enter Credentials</p>{" "}
            <LockFill className="lock-icon" size={30} />
          </div>
        </div>
        <div className="floating-label-content mb-4">
          <input
            className="floating-input border border-gray-200 shadow-sm"
            name="email"
            type="text"
            placeholder=" "
            onChange={(evnet) =>
              setLoginData({ ...loginData, email: evnet.target.value })
            }
          />
          <label className="floating-label">Email</label>
        </div>

        <div className="floating-label-content mb-4">
          <input
            type={!showPassword ? "password" : "text"}
            value={loginData.password}
            className="floating-input border border-gray-200 shadow-sm"
            name="password"
            id="password"
            placeholder=" "
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-2 top-2"
            onClick={togglePassword}
          >
            {!showPassword ? <EyeFill size={20} /> : <EyeSlashFill size={20} />}
          </button>
          <label htmlFor="password" className="floating-label">
            Password
          </label>
        </div>
        <button
          type="submit"
          className="w-full p-1 flex items-center justify-center gap-3 mb-3 rounded text-white cursor-pointer bg-[#008069] text-center"
        >
          {loading ? <div className="spinner"></div> : <div>Login</div>}
        </button>
        <div className="flex justify-end items-center">
          <Link className="text-[#008069]" to="/register">
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
};
export default Login;
