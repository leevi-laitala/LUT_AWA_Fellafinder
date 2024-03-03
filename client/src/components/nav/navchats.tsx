import { useNavigate } from "react-router-dom";
import React from "react";

import "../styles/navbar.css";

// Navbar for Chats
// - Button to edit profile
// - Button to logout

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("userid");
        localStorage.removeItem("token");

        navigate("/login");
    }

    const navigateToProfile = () => {
        navigate("/profile");
    }

    return (
        <nav>
            <h1><a href="/fellas">Fellafinder</a></h1>
            <div className="navbuttons">
                <button className="navbutton" onClick={navigateToProfile}>Profile</button>
                <button className="navbutton" onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
}

export default Navbar;
