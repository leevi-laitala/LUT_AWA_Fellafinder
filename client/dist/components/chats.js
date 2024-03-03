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
const navchats_1 = __importDefault(require("./nav/navchats"));
require("./styles/chats.css");
function ChatsComponent() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [matches, setMatches] = (0, react_1.useState)([]);
    const [message, setMessage] = (0, react_1.useState)("");
    const [error, setError] = (0, react_1.useState)("");
    const [receiver, setReceiver] = (0, react_1.useState)("");
    const [receiverUsername, setReceiverUsername] = (0, react_1.useState)("");
    const [messageHistory, setMessageHistory] = (0, react_1.useState)([]);
    const maxChars = 128;
    function fetchMatches() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(`http://localhost:5001/api/chat/chats/${localStorage.getItem("userid")}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (res.status !== 200) {
                console.log("prööt");
                return;
            }
            const data = yield res.json();
            setMatches(data);
        });
    }
    function fetchMessageHistory() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch("http://localhost:5001/api/chat/messagehistory", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    sender: localStorage.getItem("userid"),
                    receiver: receiver
                })
            });
            const data = yield res.json();
            console.log(data);
            setMessageHistory(data);
        });
    }
    (0, react_1.useEffect)(() => {
        //const token = localStorage.getItem("token");
        //if (!token) {
        //    navigate("/login");
        //    return;
        //}
        fetchMatches();
    }, []);
    function sendMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            const sentMessageBody = {
                sender: localStorage.getItem("userid"),
                receiver: receiver,
                message: message
            };
            const res = yield fetch("http://localhost:5001/api/chat/message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(sentMessageBody)
            });
            setMessage("");
            //const data = await res.json();
            //console.log(data);
        });
    }
    function handleChangeEvent(event) {
        const msg = event.target.value;
        if (msg.length > maxChars) {
            setError("Message too long");
            return;
        }
        if (msg.length === 0) {
            return;
        }
        setError("");
        setMessage(event.target.value);
    }
    function handleUserchangeEvent(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(`http://localhost:5001/api/user/getuserid/${event.target.textContent}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = yield res.json();
            setReceiver(data.userid);
        });
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(navchats_1.default, {}), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { children: "Your matches:" }), (0, jsx_runtime_1.jsx)("div", { className: "matchedUsers", children: matches.map((match) => ((0, jsx_runtime_1.jsx)("button", { onClick: handleUserchangeEvent, children: match.username }, match.username))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [receiver && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("textarea", { className: "chatinput", value: message, onChange: handleChangeEvent }), (0, jsx_runtime_1.jsx)("button", { className: "sendMessage", onClick: sendMessage, children: "Send" })] })), error && ((0, jsx_runtime_1.jsx)("div", { className: "error", children: error }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "messages", children: [(0, jsx_runtime_1.jsxs)("h1", { children: ["Messages with ", receiver] }), (0, jsx_runtime_1.jsx)("button", { onClick: fetchMessageHistory, children: "Test" }), receiver && messageHistory.map((msg, idx) => ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("div", { children: "msg.text" }) })))] })] }));
}
exports.default = ChatsComponent;
//# sourceMappingURL=chats.js.map