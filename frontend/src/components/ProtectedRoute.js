import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const [isRedirecting, setIsRedirecting] = useState(false);
    const userId = localStorage.getItem('userId');
    
    // If no user is logged in, show a message and redirect after a short delay
    if (!userId && !isRedirecting) {
        setIsRedirecting(true);
        return (
            <div className="login-warning">
                <h2>✨ You need to log in to see this page! ✨</h2>
                <Navigate to="/login" replace />
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
