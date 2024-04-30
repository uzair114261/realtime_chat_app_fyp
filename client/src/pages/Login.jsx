import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { EyeFill, EyeSlashFill, LockFill } from 'react-bootstrap-icons';
import axios from 'axios';
import { ToastContext } from '../App';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false)
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    const showToast = useContext(ToastContext);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!loginData.email || !loginData.password) {
            showToast.warning('Please fill all required fields', {
                autoClose: 3000
            });
            return;
        }
        try {
            setLoading(true)
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}users/api/login`, loginData)
            const { access, refresh, user } = response.data;
            localStorage.clear()
            localStorage.setItem('access', access);
            localStorage.setItem('refresh', refresh);
            localStorage.setItem('userData', JSON.stringify(user))
            showToast.success('Login Successfully', {
                autoClose: 3000
            })
            setLoading(false)
            navigate('/')
        } catch (err) {
            if (err.response) {
                if (err.response.status === 404) {
                    showToast.error('user not found', {
                        autoClose: 3000
                    })
                } else if (err.response.status === 401) {
                    showToast.error('Incorrect Password!', {
                        autoClose: 3000
                    })
                } else {
                    showToast.warning('Server error. Please try again later.', {
                        autoClose: 3000
                    })
                }
            }
        } finally {
            setLoginData({
                email: '',
                password: ''
            })
        }
    }
    const togglePassword = () => {
        setShowPassword(!showPassword);
    }
    return (
        <div className='h-screen flex items-center justify-center bg-slate-100'>
            <form action="" className='sm:w-[350px]  shadow shadow-slate-600 ease-linear duration-200 bg-white  p-4 rounded' onSubmit={handleSubmit}>
                <div className="text-center">
                    <h2 className='text-2xl font-semibold'>Realtime Chat Application</h2>
                    <div className='text-xl flex justify-center py-3'><p className='mr-2'>Enter Credentials</p> <LockFill className='lock-icon' size={30} /></div>
                </div>
                <div class="floating-label-content mb-4">
                    <input className="floating-input border border-gray-200 shadow-sm" name='email' type="text" placeholder=" " onChange={(evnet) => setLoginData({ ...loginData, email: evnet.target.value })} />
                    <label className="floating-label">Email</label>
                </div>

                <div className='floating-label-content mb-4'>
                    <input type={!showPassword ? 'password' : 'text'} value={loginData.password} className='floating-input border border-gray-200 shadow-sm' name="password" id="password" placeholder=" " onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
                    <button type='button' tabIndex={-1} className='absolute right-2 top-2' onClick={togglePassword}>{
                        !showPassword ? <EyeFill size={20} /> : <EyeSlashFill size={20} />
                    }</button>
                    <label htmlFor="password" className='floating-label'>Password</label>
                </div>
                <button type='submit' className='w-full p-1 flex items-center justify-center gap-3 mb-3 rounded text-white cursor-pointer bg-blue-500 hover:bg-blue-700 ease-linear duration-200 text-center'>
                    {loading ? <div className='spinner'></div> : <div>Login</div>}
                </button>
                <div className='flex justify-end items-center'>
                    <Link className='text-blue-800' to="/register">Create an account</Link>
                </div>
            </form>
        </div>
    )
}
export default Login