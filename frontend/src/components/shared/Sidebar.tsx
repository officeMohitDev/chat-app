import { MoreHorizontal, Search } from 'lucide-react'
import React from 'react'
import ChatBlock from '../chat/ChatBlock'
import { Popover } from 'antd';

const Sidebar = () => {

    const content = (
        <div>
            <p>Content</p>
            <p>Content</p>
        </div>
    );

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
                    <ChatBlock />
                    <ChatBlock />
                    <ChatBlock />
                    <ChatBlock />
                    <ChatBlock />
                    <ChatBlock />
                    <ChatBlock />
                    <ChatBlock />
                    <ChatBlock />
                    <ChatBlock />
                </div>
            </div>
        </div>
    )
}

export default Sidebar