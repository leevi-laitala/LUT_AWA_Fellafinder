"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 5001;
const upload = (0, multer_1.default)();
const corsOpts = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOpts));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(upload.array());
app.use(express_1.default.static("public"));
app.use("/", routes_1.default);
app.listen(port);
exports.default = app;
//# sourceMappingURL=app.js.map