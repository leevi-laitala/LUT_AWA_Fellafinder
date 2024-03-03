import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function DefaultComponent() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
        }

        navigate("/fellas");
    });

    return (<></>);
}

export default DefaultComponent;
