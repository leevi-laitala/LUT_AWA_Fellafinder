import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/*  Default Component for root
 *  - Navigates to login if token not specified
 *  - Navigates to "tinder" if logged in
 */
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
