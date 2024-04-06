import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ArrowLeft, Search } from 'react-bootstrap-icons';
import { ChatStates } from './ChatStates';

function AllUsers() {
    const { allUsers, setAllUsers, setChatOpen } = useContext(ChatStates)
    const [users, setUsers] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}users/api/all-users-data`);
                setUsers(response.data);
                const loggedUserData = JSON.parse(localStorage.getItem('userData'));
                setLoggedInUser(loggedUserData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const goBack = () => {
        setSearchInput('');
        setChatOpen(false);
    };

    const getUserDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${day}-${month}-${year}`;
    };

    const filteredUsers = users.filter(user => user.id !== loggedInUser?.id);
    const SearchedUsers = filteredUsers.filter(user => {
        if (searchInput.trim().length === 0) {
            return true;
        } else {
            return user.email.toLowerCase().includes(searchInput.toLowerCase());
        }
    });

    return (
        <div className={`${allUsers ? "md:w-[30%] max-h-[100vh] h-[100vh] overflow-auto" : "hidden"}`}>
            <div className="bg-[#008069] h-[60px] flex justify-start items-center px-3">
                <button onClick={() => setAllUsers(false)} className='text-white text-xl'><ArrowLeft /></button>
                <h3 className='ml-4 text-white text-xl'>All Users</h3>
            </div>
            <div className="max-h-[calc(100vh-60px)] bg-[#f0f2f5] overflow-y-auto overflow-x-hidden ">

                <div className="search-user-list w-100">
                    <div className='search-user'>
                        <button className='px-1'>
                            <Search size={16} />
                        </button>
                        <input type="text" className='' onChange={(e) => setSearchInput(e.target.value)} value={searchInput} id='search-user-input' placeholder='Search...' />
                    </div>
                </div>
            </div>
            {
                SearchedUsers.length > 0 ? (
                    SearchedUsers.map((user, index) => (
                        <div key={index} className='each-user' onClick={goBack}>
                            <div className="image">
                                <img src={`${process.env.REACT_APP_BACKEND_URL}${user.profileImage}`} className='avatar ' alt="" />
                            </div>
                            <div className='user-list-data pl-3 pr-2 md:pl-5'>
                                <div className='user-info'>
                                    <div className='user-name'>{user.firstName} {user.lastName}</div>
                                    <div className='last-msg-time'>{getUserDate(user.created_at)}</div>
                                </div>
                                <div className="user-last-msg">
                                    <p>{user.email}</p>
                                </div>
                            </div>
                        </div>
                    ))

                ) : (
                    <div className='flex items-center justify-center h-[calc(100vh-200px)]'>
                        <div className="p-5 rounded-lg bg-slate-300 w-[80%] text-center">
                            <h1>You friend is not found. Please enter correct email address</h1>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default AllUsers
