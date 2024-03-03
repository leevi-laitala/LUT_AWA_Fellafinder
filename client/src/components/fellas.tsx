import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TinderCard from "react-tinder-card";

import Navbar from "./nav/navfellas";

import "./styles/fellas.css"

function FellasComponent() {
    const navigate = useNavigate();

    const [fellaStack, setFellaStack] = useState([]);
    const [currentFellaIndex, setCurrentFellaIndex] = useState(0);

    async function fetchFellas() {
        const res = await fetch("http://localhost:5001/api/user/users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (res.status !== 200) {
            navigate("/login");
            return; 
        }

        const data = await res.json();
        setFellaStack(data);
    }

    async function updateUser(username, action) {
        const res = await fetch(`http://localhost:5001/api/user/${username}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                liked: `${(action === "like") ? "liked" : null}`,
                disliked: `${(action === "dislike") ? "disliked" : null}`,
                byuser_id: `${localStorage.getItem("userid")}`
            })
        });

        const data = await res.json();

        if (data.match !== "true") { return; }

        //TODO: Match popup

    }

    function swiped(dir, name, indx) {
        updateUser(name, (dir === "right") ? "like" : "dislike");
    }

    function outOfFrame(name, index) {
    }

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        fetchFellas();
    }, []);

    return (
    <>
        <div>
            <Navbar/>
            <div className="cardContainer">
                { fellaStack.map((fella, index) => (
                    <TinderCard 
                    className="swipe"
                    onSwipe={(dir) => swiped(dir, fella.username, index)}
                    onCardLeftScreen={() => outOfFrame(fella.username, index)}
                    preventSwipe={["up", "down"]}
                    >
                        <div className="card">
                            <h2>{fella.username}</h2>
                            <div>{fella.bio}</div>
                        </div>
                    </TinderCard>
                ))}
            </div>
        </div>
    </>
    );
}

export default FellasComponent;
