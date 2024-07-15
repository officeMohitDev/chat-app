import { createContext, useState, FC, ReactNode, useContext } from "react";

interface UserData {
    [key: string]: unknown;
}

interface AppContextType {
    userData: UserData | null;
    setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface ContextProviderProps {
    children: ReactNode;
}

export const ContextProvider: FC<ContextProviderProps> = ({ children }) => {
    const [userData, setUserData] = useState<UserData | null>(JSON.parse(localStorage.getItem("user") || 'null'));

    return (
        <AppContext.Provider value={{ userData, setUserData }}>
            {children}
        </AppContext.Provider>
    );
}

export default AppContext;

export function useAppContext(): AppContextType {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within a ContextProvider');
    }
    return context;
}
