import { MoreHorizontal, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import ChatBlock from '../chat/ChatBlock'
import { Popover } from 'antd';
import { useAppContext } from '../../context/AppContext';

const Sidebar = () => {
    const { profileMe, onlineUsers, socket } = useAppContext()

    const [friendList, setFriendList] = useState<any[]>(profileMe?.friends)

    const content = (
        <div>
            <p>Content</p>
            <p>Content</p>
        </div>
    );

    useEffect(() => {
        socket?.on("friend", (data) => {
            console.log("friend data", data);

            setFriendList(prev => [...prev, data])
        })
        return () => {
            socket?.off("friend", (data) => {
                setFriendList(prev => [...prev, data])
            });
        };
    }, [socket])

    return (
        <div className='py-2 px-3 bg-white'>
            <div className='space-y-1'>
                <div className='flex py-4 items-center justify-between'>
                    <h2 className='text-xl'>Messages</h2>
                    <Popover content={content} title="Title" trigger="click">
                        <button> <MoreHorizontal /></button>
                    </Popover>

                </div>
                <div className='flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-lg'>
                    <Search />
                    <input type="text" className='bg-gray-50 w-full outline-none' />
                </div>
                <div className='flex flex-col hideScroll gap-2 h-[calc(100vh-190px)] overflow-auto'>
                    {
                        friendList?.length ?
                            friendList.map((friend: any) => (
                                <ChatBlock isOnline={onlineUsers.includes(friend._id)} username={friend?.username} avatar={friend?.avatar} />
                            )) : (
                                <div className='h-full flex-center'>You don't have any friends!!</div>
                            )
                    }
                </div>
            </div>
        </div>
    )
}

export default Sidebar