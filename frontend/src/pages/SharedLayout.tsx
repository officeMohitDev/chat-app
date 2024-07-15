import { useAppContext } from '../context/AppContext'
import Sidebar from '../components/shared/Sidebar';
import Navbar from '../components/shared/Navbar';
import { Outlet } from 'react-router-dom';
import MessageInput from '../components/chat/MessageInput';
import Header from '../components/shared/Header';
const SharedLayout = () => {
    const { userData } = useAppContext();
    console.log("userdata", userData)
    return (
        <>
            <Header />
            <div className='flex w-full gap-4 '>
                <div className='flex-[2]'>
                    <Sidebar />
                </div>
                <div className='flex-[7] flex justify-between flex-col bg-yellow-50'>
                    <Navbar />
                    <div className='bg-blue-50 h-full'>
                        Bruh
                    </div>
                    <div className='bg-gray-50'>
                        <MessageInput />
                    </div>
                </div>
            </div>
        </>
    )
}

export default SharedLayout