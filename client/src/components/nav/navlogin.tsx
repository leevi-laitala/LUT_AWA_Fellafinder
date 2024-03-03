import { useNavigate } from "react-router-dom";
import React from "react";

import "../styles/navbar.css";

function Navbar() {
    const navigate = useNavigate();

    const navigateToRegister = () => {
        navigate("/register");
    }

    return (
        <nav>
            <h1>Fellafinder</h1>
            <div className="navbuttons">
                <button className="navbutton" onClick={navigateToRegister}>Register</button>
            </div>
        </nav>
    )
}

export default Navbar;
