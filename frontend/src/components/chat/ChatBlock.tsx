import React from 'react'

const ChatBlock = ({ username, avatar, isOnline }: { username: string; avatar: string; isOnline: boolean }) => {
    return (
        <div className='flex hover:bg-gray-50 py-2  px-2 rounded-lg cursor-pointer justify-between gap-1 items-center'>
            <div className='flex items-center gap-4'>
                <div className='relative'>
                    <img src={avatar || "/images/cuteanime.jpg"} className='w-12 h-12 rounded-full' alt="" />
                    {
                        isOnline ?
                            <div className='h-2 w-2 rounded-full bg-green-500 absolute bottom-0 right-1'></div>
                            :
                            ""
                    }
                </div>
                <div>
                    <h5 className='text-[16px]'>{username}</h5>
                    <p className='text-[12px] text-gray-600'>Last msg</p>
                </div>
            </div>
            <div className='p-2 rounded-full bg-red-700 w-6 flex-center text-[12px] h-6  text-white'>
                5
            </div>
        </div>
    )
}

export default ChatBlock