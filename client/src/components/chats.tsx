import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "./nav/navchats";

import "./styles/chats.css"

/* Chat component
 * - Fetches mathed users, and lists them
 * - For selected user, fetches message history
 * - 
 */
function ChatsComponent() {
    const navigate = useNavigate();
    const [matches, setMatches] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [receiver, setReceiver] = useState("");
    const [receiverUsername, setReceiverUsername] = useState("");
    const [messageHistory, setMessageHistory] = useState([]);
    const maxChars = 128;

    async function fetchMatches() {
        const res = await fetch(`http://localhost:5001/api/chat/chats/${localStorage.getItem("userid")}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });


        if (res.status !== 200) {
            console.log("prööt");
            return; 
        }

        const data = await res.json();

        setMatches(data);
    }

    async function fetchMessageHistory() {
        const res = await fetch("http://localhost:5001/api/chat/messagehistory", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                sender: localStorage.getItem("userid"),
                receiver: receiver
            })
        });

        if (res.status !== 200) {
            console.log("prööt");
            return;
        }

        const data = await res.json();

        setMessageHistory(data);
    }

    useEffect(() => {
        //const token = localStorage.getItem("token");

        //if (!token) {
        //    navigate("/login");
        //    return;
        //}

        fetchMatches();
    }, []);

    async function sendMessage() {
        const sentMessageBody = {
            sender: localStorage.getItem("userid"),
            receiver: receiver,
            message: message
        }

        const res = await fetch("http://localhost:5001/api/chat/message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(sentMessageBody)
        });

        setMessage("");

        fetchMessageHistory();

        //const data = await res.json();
        //console.log(data);
    }

    function handleChangeEvent(event) {
        const msg = event.target.value;
        
        if (msg.length > maxChars) {
            setError("Message too long");
            return;
        }

        if (msg.length === 0) {
            return;
        }

        setError("");
        setMessage(event.target.value);
    }

    async function handleUserchangeEvent(event) {
        const res = await fetch(`http://localhost:5001/api/user/getuserid/${event.target.textContent}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        const data = await res.json();
        setReceiverUsername(event.target.textContent);
        setReceiver(data.userid);
        fetchMessageHistory();

        //console.log(event.target.textContent)
        //console.log(receiver)
        //console.log(receiverUsername)
    }

    return (
    <>
        <Navbar/>
        <div className="container">
            <div className="matchlist">
                <h1>Your matches:</h1>
                <div className="matchedUsers">
                    {matches.map((match) => (<>
                        <button className="matchUser" key={match.username} onClick={handleUserchangeEvent}>{match.username}</button>
                        <br/>
                    </>))}
                </div>
            </div>

            <div className="messages">
                <h1>Messages with {receiverUsername}</h1>
                {receiver && messageHistory.map((msg, idx) => (
                    <div className={`${msg.sender === localStorage.getItem("userid") ? "msgSent" : "msgReceived"}`}>
                        <div>{msg.text}</div>
                    </div>
                ))}
                {receiver && (<>
                    <textarea className="chatinput" value={message} onChange={handleChangeEvent}/>
                    <button className="sendMessage" onClick={sendMessage}>Send</button>
                </>)}
                {error && (<div className="error">{error}</div>)}
            </div>
        </div>
    </>
    );
}

export default ChatsComponent;
