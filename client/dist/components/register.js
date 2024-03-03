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
const navregister_1 = __importDefault(require("./nav/navregister"));
require("./styles/register.css");
function RegisterComponent() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [email, setEmail] = (0, react_1.useState)("");
    const [password, setPassword] = (0, react_1.useState)("");
    const [username, setUsername] = (0, react_1.useState)("");
    const [age, setAge] = (0, react_1.useState)("");
    const [bio, setBio] = (0, react_1.useState)("joo");
    const [error, setError] = (0, react_1.useState)("");
    function verifyAge(age) {
        const i = parseInt(age);
        if (!i) {
            return null;
        }
        if (i < 17) {
            return null;
        }
        return i;
    }
    function registerUser(event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            if (!email || !password || !username || !age) { //TODO: Missing bio?
                setError("Please fill out all fields");
                return;
            }
            if (!verifyAge(age)) {
                setError("Please enter a valid age");
                return;
            }
            let form = new FormData();
            form.append("email", email);
            form.append("password", password);
            form.append("username", username);
            form.append("age", age);
            form.append("bio", bio);
            console.log(form);
            const res = yield fetch("http://localhost:5001/api/user/register", {
                method: "POST",
                body: form
            });
            if (res.status !== 200) {
                setError("Registeration failed");
                return;
            }
            navigate("/login");
        });
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(navregister_1.default, {}), (0, jsx_runtime_1.jsxs)("div", { className: "registeration", children: [(0, jsx_runtime_1.jsx)("h1", { className: "title", children: "Create new user" }), (0, jsx_runtime_1.jsxs)("form", { id: "registeration-form", onSubmit: registerUser, children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "email", children: "Email:" }), (0, jsx_runtime_1.jsx)("input", { type: "text", id: "email", value: email, onChange: (newval) => { setEmail(newval.target.value); } }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("label", { htmlFor: "password", children: "Password:" }), (0, jsx_runtime_1.jsx)("input", { type: "password", id: "password", value: password, onChange: (newval) => { setPassword(newval.target.value); } }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("label", { htmlFor: "username", children: "Username:" }), (0, jsx_runtime_1.jsx)("input", { type: "text", id: "username", value: username, onChange: (newval) => { setUsername(newval.target.value); } }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("label", { htmlFor: "age", children: "Age:" }), (0, jsx_runtime_1.jsx)("input", { type: "number", id: "age", value: age, onChange: (newval) => { setAge(newval.target.value); } }), error && ((0, jsx_runtime_1.jsx)("div", { className: "error", children: error })), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("button", { className: "submit", id: "registerationSubmitButton", type: "submit", children: "Register" })] })] })] }));
}
exports.default = RegisterComponent;
//# sourceMappingURL=register.js.map