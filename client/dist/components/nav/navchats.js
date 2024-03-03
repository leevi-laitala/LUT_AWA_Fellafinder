"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
require("../styles/navbar.css");
function Navbar() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const handleLogout = () => {
        localStorage.removeItem("userid");
        localStorage.removeItem("token");
        navigate("/login");
    };
    const navigateToProfile = () => {
        console.log("jeeorck");
    };
    return ((0, jsx_runtime_1.jsxs)("nav", { children: [(0, jsx_runtime_1.jsx)("h1", { children: (0, jsx_runtime_1.jsx)("a", { href: "/fellas", children: "Fellafinder" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "navbuttons", children: [(0, jsx_runtime_1.jsx)("button", { className: "navbutton", onClick: navigateToProfile, children: "Profile" }), (0, jsx_runtime_1.jsx)("button", { className: "navbutton", onClick: handleLogout, children: "Logout" })] })] }));
}
exports.default = Navbar;
//# sourceMappingURL=navchats.js.map