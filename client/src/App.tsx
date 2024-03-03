import { BrowserRouter, Route, Routes } from "react-router-dom";
import RegisterComponent from "./components/register";
import DefaultComponent from "./components/default";
import ProfileComponent from "./components/profile";
import FellasComponent from "./components/fellas";
import LoginComponent from "./components/login";
import ChatsComponent from "./components/chats";
import { useState } from "react";


function App() {
    return (
    <BrowserRouter>
        <div className="App">
            <Routes>
                <Route path="/" element={<><DefaultComponent/></>}/>
                <Route path="/register" element={<><RegisterComponent/></>}/>
                <Route path="/login" element={<><LoginComponent/></>}/>
                <Route path="/fellas" element={<><FellasComponent/></>}/>
                <Route path="/chats" element={<><ChatsComponent/></>}/>
                <Route path="/profile" element={<><ProfileComponent/></>}/>
            </Routes>
        </div>
    </BrowserRouter>
    );
}

export default App;
