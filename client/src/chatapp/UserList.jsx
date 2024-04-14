import React, { useContext, useEffect, useRef, useState } from 'react';
import { useOnlineStatus } from '../CustomHooks/useOnlineStatus';
import axios from 'axios';
import AllUsers from './AllUsers';
import { ThreeDotsVertical, HouseAddFill, MoonFill, Search, WifiOff } from 'react-bootstrap-icons'
import SenderProfile from './SenderProfile';
import useClickOutside from '../CustomHooks/useClickOutside';
import { useNavigate } from 'react-router-dom';
import { ToastContext } from '../App';
import { ChatStates } from './ChatStates';


const UserList = () => {
    const navigate = useNavigate()
    const { userData, chatOpen, setChatOpen, handleUserSelect, senderProfile, setSenderProfile, allUsers, setAllUsers, messages } = useContext(ChatStates)
    const showToast = useContext(ToastContext)
    const [users, setUsers] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [showDropdown, setShowDropdown] = useState(false)


    const isOnline = useOnlineStatus();
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const dropdownRef = useRef(null);

    const handleOutsideClick = () => {
        setShowDropdown(false)
    }
    useClickOutside(dropdownRef, handleOutsideClick)
    const showPopup = () => {
        setShowDropdown(false)
        setShowLogoutPopup(true)
    }
    const logoutHandler = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('userData');
        showToast.info('You are logged out!', {
            autoClose: 3000
        });
        navigate('/login')
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}users/api/all-users-data`);
                setUsers(response.data);
                const loggedInUser = JSON.parse(localStorage.getItem('userData'));
                setLoggedInUser(loggedInUser);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    const getUserDayName = (dateString) => {
        const date = new Date(dateString);
        const options = {
            weekday: 'long'
        }
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };
    const filteredUsers = users.filter(user => user.id !== loggedInUser?.id);

    const usersWithMessages = filteredUsers.filter(user => {
        return messages.some(message => {
            return (message.sender === user.id && message.receiver === loggedInUser?.id) ||
                (message.sender === loggedInUser?.id && message.receiver === user.id);
        });
    });

    const highlightMatchedText = (text, searchInput) => {
        if (!searchInput.trim()) {
            return text;
        }
        const escapedInput = searchInput.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`(${escapedInput.replace(/\s/g, '|')})`, 'gi');
        const parts = text.split(regex);
        return (
            <>
                {parts.map((part, index) => {
                    return part.match(regex) ? <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span> : part;
                })}
            </>
        );
    };
    const getLastMessage = (userId) => {
        const userMessages = messages.filter(message =>
            (message.sender === userId && message.receiver === loggedInUser?.id) ||
            (message.sender === loggedInUser?.id && message.receiver === userId)
        );
        if (userMessages.length > 0) {
            const lastMessage = userMessages[userMessages.length - 1];
            return lastMessage.content;
        } else {
            return "";
        }
    };
    const getLastMessageTimestamp = (userId) => {
        const userMessages = messages.filter(message => message.sender === userId || message.receiver === userId);
        if (userMessages.length > 0) {
            const lastMessage = userMessages[userMessages.length - 1];
            return new Date(lastMessage.timestamp).getTime()
        } else {
            return 0
        }
    };
    const SearchedUsers = usersWithMessages.filter(user => {
        if (searchInput.trim().length === 0) {
            return true;
        } else {
            const name = `${user.firstName} ${user.lastName}`;
            return name.toLowerCase().includes(searchInput.toLowerCase());
        }
    })
    console.log(usersWithMessages)
    const sortedUsers = SearchedUsers.sort((userA, userB) => {
        const timestampA = getLastMessageTimestamp(userA.id);
        const timestampB = getLastMessageTimestamp(userB.id);
        return timestampB - timestampA
    });
    const handleUserClick = (user) => {
        setChatOpen(true)
        handleUserSelect(user);
    }
    return (
        <>
            <SenderProfile />
            <AllUsers />
            <div className={`md:w-[30%] max-h-[100vh] h-[100vh] overflow-auto ${chatOpen && 'max-md:hidden'} ${senderProfile && 'hidden'} ${allUsers && 'hidden'}`}>
                <div className="flex h-[60px] justify-between items-center px-3 bg-[#f0f2f5] border-r-[1px] border-[#d1d7db]">
                    <div className="profile-image cursor-pointer" onClick={() => setSenderProfile(true)}>
                        <img src={`${process.env.REACT_APP_BACKEND_URL}${userData.profileImage}`} alt="My Profile" className='avatar' />
                    </div>
                    <div className="user-features flex">
                        <div className='mx-2'>
                            <MoonFill color='#54656f' size={20} />
                        </div>
                        <div className='mx-2' onClick={() => setAllUsers(true)}>
                            <HouseAddFill color='#54656f' size={20} />
                        </div>
                        <div className="">
                            <div ref={dropdownRef} className="relative inline-block text-left">
                                <div>
                                    <button onClick={() => setShowDropdown(true)} type="button" className=" " id="menu-button" aria-expanded="true" aria-haspopup="true">
                                        <ThreeDotsVertical size={23} />
                                    </button>
                                </div>
                                {
                                    showDropdown && (
                                        <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                                            <div className="py-1" role="none">
                                                <li className="hover:bg-gray-100 ease-linear duration-150 text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-0" onClick={showPopup}>Logout</li>

                                            </div>
                                        </div>
                                    )
                                }

                            </div>
                        </div>
                    </div>
                </div>
                <div className="search-user-list w-100">
                    <div className='search-user'>
                        <button className='px-1'>
                            <Search size={16} />
                        </button>
                        <input type="text" onChange={(e) => setSearchInput(e.target.value)} value={searchInput} id='search-user-input' placeholder='Search...' />

                    </div>
                </div>

                <div className="real-user-list">
                    {!isOnline && <div className="offline-connection-msg">
                        <div className="wifi-icon">
                            <div className="wifi-off">
                                <i><WifiOff /></i>
                            </div>
                        </div>
                        <div className="message-content">
                            <h6>Computer Not Connected</h6>
                            <p>Make sure your computer has an active Internet connection</p>
                        </div>
                    </div>}
                    {
                        sortedUsers.length > 0 ? (
                            sortedUsers.map((user, index) => (
                                <div key={index} className='each-user' onClick={() => handleUserClick(user)}>
                                    <div className="image">
                                        <img src={`${process.env.REACT_APP_BACKEND_URL}${user.profileImage}`} className='avatar object-cover' alt="" />
                                    </div>
                                    <div className='user-list-data pl-3 pr-2 md:pl-5'>
                                        <div className='user-info'>
                                            <div className='user-name'>
                                                {highlightMatchedText(user.firstName, searchInput)} {highlightMatchedText(user.lastName, searchInput)}
                                            </div>
                                            <div className='last-msg-time'>{getUserDayName(user.created_at)}</div>
                                        </div>
                                        <div className="user-last-msg">
                                            <p>{getLastMessage(user.id)}</p>

                                        </div>
                                    </div>
                                </div>
                            ))

                        ) : (
                            <div className='flex items-center justify-center h-[calc(100vh-200px)]'>
                                <div className="p-5 rounded-lg bg-slate-300 w-[80%] text-center">

                                    <h1>No Chats Avaialable. Search your friend and start talking with!</h1>
                                </div>
                            </div>
                        )
                    }

                </div>
            </div>
            {
                showLogoutPopup && (
                    <div className="popup-container">
                        <div className="popup">
                            <h2 className="text-lg font-bold mb-4">Confirm Logout</h2>
                            <p className="mb-4">Are you sure you want to Logout?</p>
                            <div className="flex justify-end">
                                <button
                                    className="px-4 py-2 mr-4 bg-gray-300 ease-linear duration-200 text-gray-700 rounded hover:bg-gray-400"
                                    onClick={() => setShowLogoutPopup(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-slate-600 ease-linear duration-200 text-white rounded hover:bg-slate-700"
                                    onClick={logoutHandler}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default UserList