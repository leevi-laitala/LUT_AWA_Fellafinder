import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "./nav/navprofile";

/*  Profile Component
 *  - User can update their bio
 *      - Bio is shown on the swipable cards for other users
 */
function ProfileComponent() {
    const navigate = useNavigate();
    const [bio, setBio] = useState("");

    async function updateBio() {
        const res = await fetch(`http://localhost:5001/api/user/updatebio/${localStorage.getItem("userid")}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ bio: bio })
        });
    }

    return (
    <>
        <Navbar/>
        <div className="profilespecs">
            <label htmlFor="bio">Update bio:</label>
            <input type="text" id="bio" value={bio} 
                   onChange={(newval) => {setBio(newval.target.value)}}/>
            <button className="update" onClick={updateBio}>Update Bio</button>
        </div>
    </>
    );
}

export default ProfileComponent;
