import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "./nav/navlogin";

import "./styles/register.css"

function LoginComponent() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Error shows if wrong credentials are provided
    const [error, setError] = useState("");

    // Evaluate fields and make login request to server
    async function loginUser(event) {
        event.preventDefault();

        if (!email || !password) {
            setError("Missing fields");
            return;
        }

        let form = new FormData();
        form.append("email", email);
        form.append("password", password);

        const res = await fetch("http://localhost:5001/api/user/login", {
            method: "POST",
            body: form
        });

        if (res.status !== 200) {
            setError("Login failed");
            return;
        }

        const data = await res.json();

        if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("userid", data.userid);
        }

        setError("Jeerock, login success!");
        navigate("/fellas");
    }

    return (
    <>
        <Navbar/>
        <div className="login">
            <h1 className="title">Login</h1>
            <form id="login-form" onSubmit={loginUser}>
                <label htmlFor="email">Email:</label>
                <input type="text" id="email" value={email} 
                       onChange={(newval) => {setEmail(newval.target.value)}}/>

                <label htmlFor="password">Password:</label>
                <input type="password" id="password" value={password} 
                       onChange={(newval) => {setPassword(newval.target.value)}}/>

                {error && (<div className="error">{error}</div>)}

                <button className="submit" id="loginSubmitButton" type="submit">Login</button>
            </form>
        </div>
    </>
    );
}

export default LoginComponent;
