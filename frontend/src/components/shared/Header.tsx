import { Popover } from 'antd'
import { Bell, Check, Cross, Search, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import axiosInstance from '../../utils/api'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const Header = () => {

    const [searchInput, setSearchInput] = useState('');
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(false);
    const { userData, profileMe, socket } = useAppContext()
    const [searchError, setSearchError] = useState('');
    const [notifications, setNotifications] = useState(profileMe?.notifications);
    const navigate = useNavigate()

    useEffect(() => {
        socket?.on("alert", (data) => {
            console.log("new added data")
            setNotifications((prev: any) => [...prev, data])
        })
        return () => {
            socket?.off("alert", (data) => {
                setNotifications((prev: any) => [...prev, data])
            });
        };
    }, [socket])

    console.log("notifcationdatta", notifications)

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchInput.trim() !== '') {
                fetchUserList();
            } else {
                setUserList([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchInput]);

    const fetchUserList = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/user/search?username=${searchInput}`);
            setUserList(res.data);
            setLoading(false);
            if (res.data.length === 0) {
                setSearchError('No users found');
            } else {
                setSearchError('');
            }
        } catch (error) {
            console.error('Error fetching user list:', error);
            setLoading(false);
            setSearchError('Error fetching users');
        }
    };

    const addUserToYourFriends = async (id: string) => {
        try {
            const res = await axiosInstance.post(`/user/invite/${id}`)
            console.log(res)
            toast.success("User added as friend")
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong!")
        }
    }

    const acceptUserInvitation = async (id: string, notificationId: string) => {
        try {
            const res = await axiosInstance.post(`/user/accept/${id}`)
            console.log(res)
            toast.success("User added as friend");
            notifications.filter((no: any) => no._id !== notificationId)
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong!")
        }
    }
    const declineUserInvitation = async (id: string, notificationId: string) => {
        try {
            const res = await axiosInstance.post(`/user/decline/${id}`)
            console.log(res)
            toast.success("User declined")
            notifications.filter((no: any) => no._id !== notificationId)
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong!")
        }
    }

    const content = (
        <div className='mt-4 w-72 absolute py-1 px13 bg-white shadow-lg'>
            {loading ? (
                <p>Loading...</p>
            ) : searchError ? (
                <p>{searchError}</p>
            ) : (
                <ul>
                    {userList?.map((user: any) => (
                        <li className='p-2 cursor-pointer hover:bg-gray-200 flex items-center justify-between' key={user._id}>
                            {user?.username}
                            <button onClick={() => { user?.invitations?.includes(userData?.userId) ? null : addUserToYourFriends(user._id) }} className='bg-blue-50 p-1 px-3 rounded-lg'>
                                {
                                    user?.invitations?.includes(userData?.userId) || user?.friends?.includes(userData?.userId) ? "Invited" : "Invite"
                                }
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

    const notificationContent = (
        <div className='w-80 space-y-3'>
            {
                notifications?.length ?
                    notifications?.map((notification: any) => {
                        return <div className='flex items-center gap-3'>
                            <p>{notification?.message}</p>
                            <button onClick={() => acceptUserInvitation(notification.sender, notification._id)} className=''>
                                <Check size={20} color='#38b000' />
                            </button>
                            <button onClick={() => declineUserInvitation(notification.sender, notification._id)} className=''>
                                <X size={20} color='#d00000' />
                            </button>

                        </div>

                    }) : (
                        <div className='flex-center
                        '>
                            <p>NOthing is here</p>
                        </div>
                    )
            }

        </div>
    );


    const profileContent = (
        <div className='space-y-1 flex flex-col items-start'>
            <p className='font-bold'>{userData?.email}</p>
            <button>Profile</button>
            <button onClick={() => {
                localStorage.removeItem("user")
                localStorage.removeItem("token")
                navigate("/login")
            }} >Logout</button>

        </div>
    )


    return (
        <div className='py-2 px-3 flex justify-between bg-white'>
            <div>
                Chat-App
            </div>
            <div className='flex items-center gap-3'>
                <div className='flex items-center gap-3'>
                    <Popover trigger="click" content={
                        notificationContent
                    }>
                        <button>
                            <Bell />
                        </button>
                    </Popover>
                    <div className='relative'>
                        <div className='flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-lg'>
                            <Search />
                            <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} type="text" className='bg-gray-50 w-full outline-none' />
                        </div>
                        {searchInput !== "" ? content : ""}
                    </div>
                </div>
                <Popover content={profileContent} trigger="click">
                    <img src={profileMe?.avatar || "/images/cuteanime.jpg"} className='w-12 h-12 rounded-full' alt="" />
                </Popover>
            </div>
        </div>
    )
}

export default Header