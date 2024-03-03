"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
require("../styles/navbar.css");
function Navbar() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const navigateToRegister = () => {
        navigate("/register");
    };
    return ((0, jsx_runtime_1.jsxs)("nav", { children: [(0, jsx_runtime_1.jsx)("h1", { children: "Fellafinder" }), (0, jsx_runtime_1.jsx)("button", { className: "navbutton", onClick: navigateToRegister, children: "Register" })] }));
}
exports.default = Navbar;
//# sourceMappingURL=navlogin.js.map