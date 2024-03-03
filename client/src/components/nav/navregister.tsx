import { useNavigate } from "react-router-dom";
import React from "react";

import "../styles/navbar.css";

// Navbar for Registeration
// - Button to login

function Navbar() {
    const navigate = useNavigate();

    const navigateToLogin = () => {
        navigate("/login");
    }

    return (
        <nav>
            <h1>Fellafinder</h1>
            <button className="navbutton" onClick={navigateToLogin}>Login</button>
        </nav>
    )
}

export default Navbar;
