import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TinderCard from "react-tinder-card";

import Navbar from "./nav/navfellas";

import "./styles/fellas.css"

/*  Tinder like card swiping thing
 *  - Server gives first 3 users to be "judged" upon
 *  - User can swipe either left or right, dislike or like
 */
function FellasComponent() {
    const navigate = useNavigate();

    // Fellastack contains list of users that can be liked or disliked
    const [fellaStack, setFellaStack] = useState([]);
    //const [currentFellaIndex, setCurrentFellaIndex] = useState(0);

    // Fill fellastack with users that are yet to be judged
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

    // Send like or dislike to server 
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

    // Evaluate direction, and what action it corresponds
    function swiped(dir, name, indx) {
        updateUser(name, (dir === "right") ? "like" : "dislike");
    }

    function outOfFrame(name, index) {
    }

    // Navigate to login if no token is found
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        fetchFellas();
    }, []);

    // Construct stack of cards
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
