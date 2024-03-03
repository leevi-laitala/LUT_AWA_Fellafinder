import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "./nav/navregister";

import "./styles/register.css"

function RegisterComponent() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [age, setAge] = useState("");
    const [bio, setBio] = useState("joo");

    const [error, setError] = useState("");

    function verifyAge(age) {
        const i = parseInt(age);

        if (!i) { return null; }
        if (i < 17) { return null; }

        return i;
    }
    
    async function registerUser(event) {
        event.preventDefault();

        if (!email || !password || !username || !age) { //TODO: Missing bio?
            setError("Please fill out all fields");
            return;
        }

        if (!verifyAge(age)) {
            setError("Please enter a valid age");
            return;
        }

        let form = new FormData();
        form.append("email", email);
        form.append("password", password);
        form.append("username", username);
        form.append("age", age);
        form.append("bio", bio);

        console.log(form);

        const res = await fetch("http://localhost:5001/api/user/register", {
            method: "POST",
            body: form
        });

        if (res.status !== 200) {
            setError("Registeration failed");
            return;
        }

        navigate("/login");
    }

    return (
    <>
        <Navbar/>
        <div className="registeration">
            <h1 className="title">Create new user</h1>

            <form id="registeration-form" onSubmit={registerUser}>

                <label htmlFor="email">Email:</label>
                <input type="text" id="email" value={email} 
                       onChange={(newval) => {setEmail(newval.target.value)}}/>

                <br/>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" value={password} 
                       onChange={(newval) => {setPassword(newval.target.value)}}/>

                <br/>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" value={username} 
                       onChange={(newval) => {setUsername(newval.target.value)}}/>

                <br/>
                <label htmlFor="age">Age:</label>
                <input type="number" id="age" value={age} 
                       onChange={(newval) => {setAge(newval.target.value)}}/>

                {error && (<div className="error">{error}</div>)}

                <br/>
                <button className="submit" id="registerationSubmitButton" type="submit">Register</button>
            </form>
        </div>
    </>
    );
}

export default RegisterComponent;
