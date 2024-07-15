import { Send } from 'lucide-react'
import React from 'react'

const MessageInput = () => {
    return (
        <div className='py-1 flex items-center'>
            <div className='flex w-[93%] items-center gap-3 bg-gray-50 px-3 py-2 rounded-lg'>
                <input type="text" className='bg-gray-200 w-full outline-none py-2 px-2 rounded-lg' />
            </div>
            <button>
                <Send color='blue' />
            </button>
        </div>
    )
}

export default MessageInput