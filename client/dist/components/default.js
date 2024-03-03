"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
function DefaultComponent() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    (0, react_1.useEffect)(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
        }
        navigate("/fellas");
    });
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}));
}
exports.default = DefaultComponent;
//# sourceMappingURL=default.js.map