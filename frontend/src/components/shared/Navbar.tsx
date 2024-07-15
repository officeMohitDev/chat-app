import { MoreVertical } from 'lucide-react'
import React from 'react'

const Navbar = () => {
  return (
    <div className='py-2 bg-white'>
      <div className='flex py-2 rounded-lg cursor-pointer justify-between gap-1 items-center'>
        <div className='flex items-center gap-4'>
          <div>
            <img src="/images/cuteanime.jpg" className='w-12 h-12 rounded-full' alt="" />
          </div>
          <div>
            <h5 className='text-[16px]'>Cute Girl</h5>
            <p className='text-[12px] text-gray-600'>Online</p>
          </div>
        </div>
        <button className='mr-5'>
          <MoreVertical />
        </button>
      </div>
    </div>
  )
}

export default Navbar