import { Popover } from 'antd'
import { Bell, Search } from 'lucide-react'
import React from 'react'

const Header = () => {
    const content = (
        <div>
            <p>Content</p>
            <p>Content</p>
        </div>
    );
    return (
        <div className='py-2 px-3 flex justify-between bg-white'>
            <div>
                Chat-App
            </div>
            <div className='flex items-center gap-3'>
                <Popover content={
                    content
                }>
                    <button>
                        <Bell />
                    </button>
                </Popover>
                <div>
                    <div className='flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-lg'>
                        <Search />
                        <input type="text" className='bg-gray-50 w-full outline-none' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header