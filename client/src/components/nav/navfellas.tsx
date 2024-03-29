import { useNavigate } from "react-router-dom";
import React from "react";

import "../styles/navbar.css";

// Navbar for Fellas aka. main app
// - Button to go to chats
// - Button to edit profile
// - Button to logout

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("userid");
        localStorage.removeItem("token");

        navigate("/login");
    }

    const navigateToChats = () => {
        navigate("/chats");
    }

    const navigateToProfile = () => {
        navigate("/profile");
    }

    return (
        <nav>
            <h1>Fellafinder</h1>
            <div className="navbuttons">
                <button className="navbutton" onClick={navigateToChats}>Chats</button>
                <button className="navbutton" onClick={navigateToProfile}>Profile</button>
                <button className="navbutton" onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
}

export default Navbar;
