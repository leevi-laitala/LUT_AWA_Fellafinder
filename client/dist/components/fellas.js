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
const react_tinder_card_1 = __importDefault(require("react-tinder-card"));
const navfellas_1 = __importDefault(require("./nav/navfellas"));
require("./styles/fellas.css");
function FellasComponent() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [fellaStack, setFellaStack] = (0, react_1.useState)([]);
    const [currentFellaIndex, setCurrentFellaIndex] = (0, react_1.useState)(0);
    function fetchFellas() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch("http://localhost:5001/api/user/users", {
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
            const data = yield res.json();
            setFellaStack(data);
        });
    }
    function updateUser(username, action) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(`http://localhost:5001/api/user/${username}`, {
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
            const data = yield res.json();
            if (data.match !== "true") {
                return;
            }
            //TODO: Match popup
        });
    }
    function swiped(dir, name, indx) {
        updateUser(name, (dir === "right") ? "like" : "dislike");
    }
    function outOfFrame(name, index) {
    }
    (0, react_1.useEffect)(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        fetchFellas();
    }, []);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(navfellas_1.default, {}), (0, jsx_runtime_1.jsx)("div", { className: "cardContainer", children: fellaStack.map((fella, index) => ((0, jsx_runtime_1.jsx)(react_tinder_card_1.default, { className: "swipe", onSwipe: (dir) => swiped(dir, fella.username, index), onCardLeftScreen: () => outOfFrame(fella.username, index), preventSwipe: ["up", "down"], children: (0, jsx_runtime_1.jsx)("div", { className: "card", children: (0, jsx_runtime_1.jsx)("h2", { children: fella.username }) }) }))) })] }) }));
}
exports.default = FellasComponent;
//# sourceMappingURL=fellas.js.map