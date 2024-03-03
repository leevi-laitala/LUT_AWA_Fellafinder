"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const navlogin_1 = __importDefault(require("./nav/navlogin"));
require("./styles/register.css");
function LoginComponent() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [email, setEmail] = (0, react_1.useState)("");
    const [password, setPassword] = (0, react_1.useState)("");
    const [error, setError] = (0, react_1.useState)("");
    //useEffect(() => {
    //})
    function loginUser(event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            if (!email || !password) {
                setError("Missing fields");
                return;
            }
            let form = new FormData();
            form.append("email", email);
            form.append("password", password);
            const res = yield fetch("http://localhost:5001/api/user/login", {
                method: "POST",
                body: form
            });
            if (res.status !== 200) {
                setError("Login failed");
                return;
            }
            const data = yield res.json();
            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("userid", data.userid);
            }
            setError("Jeerock, login success!");
            navigate("/fellas");
        });
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(navlogin_1.default, {}), (0, jsx_runtime_1.jsxs)("div", { className: "login", children: [(0, jsx_runtime_1.jsx)("h1", { className: "title", children: "Login" }), (0, jsx_runtime_1.jsxs)("form", { id: "login-form", onSubmit: loginUser, children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "email", children: "Email:" }), (0, jsx_runtime_1.jsx)("input", { type: "text", id: "email", value: email, onChange: (newval) => { setEmail(newval.target.value); } }), (0, jsx_runtime_1.jsx)("label", { htmlFor: "password", children: "Password:" }), (0, jsx_runtime_1.jsx)("input", { type: "password", id: "password", value: password, onChange: (newval) => { setPassword(newval.target.value); } }), error && ((0, jsx_runtime_1.jsx)("div", { className: "error", children: error })), (0, jsx_runtime_1.jsx)("button", { className: "submit", id: "loginSubmitButton", type: "submit", children: "Login" })] })] })] }));
}
exports.default = LoginComponent;
//# sourceMappingURL=login.js.map