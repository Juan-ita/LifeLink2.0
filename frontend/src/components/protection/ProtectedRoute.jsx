import { Navigate } from "react-router-dom";

function ProtectedRoute ({ children, allowedRoles}){

    // Get the JWT token from local storage
    const token = localStorage.getItem("access_token");

    // Get the logged in user's role
    const role = localStorage.getItem("user_role");

    // If there is no token , send the user back to login
    if(!token) {
        return <Navigate to='/login' />;
    }

    // if the user's role is not allowed, send them home
    if (allowedRoles && !allowedRoles.includes(role)){
        return <Navigate to='/'/>
    }

    // if everything is ok, show the protected page
    return children;
}

export default ProtectedRoute;