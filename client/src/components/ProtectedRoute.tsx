import { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    adminOnly?: boolean;
    children: ReactNode;
}

const PritectedRoute: React.FC<ProtectedRouteProps> = ({ adminOnly, children }: ProtectedRouteProps) => {
    const { user ,loading } = useAuth();

    if (!loading && !user) {
        return <Navigate to="/" />;        
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (adminOnly && !user?.isAdmin) {
        return (
            <div className="p-4 text-center text-red-500 mt-10">
                <h1>Unauthorized</h1>
                <p>You must be an admin to view this page</p>
            </div>
        );
    }
    return children;
}

export default PritectedRoute;