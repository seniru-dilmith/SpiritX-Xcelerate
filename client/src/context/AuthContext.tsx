import { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { fetchUser } from '../api/axios';

interface User {
    id: number;
    name: string;
    username: string;
    isAdmin: boolean;
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children } : { children:ReactNode } ) => {
    const [ user, setUser ] = useState<User | null>(null);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchUser();
                if (res.data && res.data.user) {
                    setUser(res.data.user);
                }
            } catch (err) {
                if (err instanceof Error) {
                    console.error("No authenticated user found", err.message);
                } else {
                    console.error("No authenticated user found", err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            { children }
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');   
    }
    return context;
}