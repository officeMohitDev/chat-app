import { createContext, useState, FC, ReactNode, useContext, useEffect } from "react";
import axiosInstance from "../utils/api";
import { Socket, io } from "socket.io-client";

interface UserData {
    [key: string]: unknown;
}

interface AppContextType {
    userData: UserData | null;
    setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
    profileMe: any;
    onlineUsers: any[],
    socket: Socket | null
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface ContextProviderProps {
    children: ReactNode;
}

export const ContextProvider: FC<ContextProviderProps> = ({ children }) => {
    const [userData, setUserData] = useState<UserData | null>(JSON.parse(localStorage.getItem("user") || 'null'));
    const [profileMe, setProfileMe] = useState<any>(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState<Socket | null>(null)
    useEffect(() => {
        if (!userData) {
            return
        }
        const fetchUserData = async () => {
            if (!userData) {
                return
            }
            try {
                const res = await axiosInstance.get('/user/me');
                setProfileMe(res.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();

        if (userData) {

            const socket = io(import.meta.env.VITE_API_BACKEND_URL, {
                query: {
                    userId: userData.userId
                }
            })

            socket.on('onlineUsers', (data) => {
                setOnlineUsers(data)
            })

            setSocket(socket)
            return () => socket.close()
        } else {
            socket?.close()
        }


    }, []);


    console.log("profile data", profileMe)

    console.log('onlineUsers', onlineUsers)

    return (
        <AppContext.Provider value={{ userData, setUserData, profileMe, onlineUsers, socket }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;

export function useAppContext(): AppContextType {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within a ContextProvider');
    }
    return context;
}
