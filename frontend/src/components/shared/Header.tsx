import { Popover } from 'antd'
import { Bell, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import axiosInstance from '../../utils/api'
import { useAppContext } from '../../context/AppContext'

const Header = () => {

    const [searchInput, setSearchInput] = useState('');
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(false);
    const { userData } = useAppContext()
    const [searchError, setSearchError] = useState('');



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

    const content = (
        <div className='mt-4 w-72 absolute py-1 px13 bg-white shadow-lg'>
            {loading ? (
                <p>Loading...</p>
            ) : searchError ? (
                <p>{searchError}</p>
            ) : (
                <ul>
                    {userList.map((user: any) => (
                        <li className='p-2 cursor-pointer hover:bg-gray-200 flex items-center justify-between' key={user._id}>
                            {user.username}
                            <button className='bg-blue-50 p-1 px-3 rounded-lg'>
                                {
                                    user?.invitation?.includes(userData?.userId) ? "Invited" : "Invite"
                                }
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
    const notificationContent = (
        <div>
            <h1>hello</h1>
            <h1>Mom</h1>
        </div>
    );


    return (
        <div className='py-2 px-3 flex justify-between bg-white'>
            <div>
                Chat-App
            </div>
            <div className='flex items-center gap-3'>
                <Popover content={
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
        </div>
    )
}

export default Header