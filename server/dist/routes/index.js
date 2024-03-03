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
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const validators_1 = require("../validators/validators");
const chat_1 = require("../models/chat");
const user_1 = require("../models/user");
mongoose_1.default.connect("mongodb://127.0.0.1:27017/project_testdb");
const db = mongoose_1.default.connection;
const r = express_1.default.Router();
r.get("/", (req, res) => {
    res.json({ msg: "Hello there" });
});
r.get("/private", validators_1.validateToken, (req, res) => {
    console.log(req.body);
    res.json({ msg: "Secret place" });
});
r.post("/api/user/register", validators_1.emailValidate, validators_1.pwdValidate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if validations were successful
    const validationError = (0, express_validator_1.validationResult)(req);
    if (!validationError.isEmpty()) {
        return res.status(401).json({ errors: validationError });
    }
    const { email, password, username, age, bio } = req.body;
    // Check if user exists
    let founduser = yield user_1.userModel.findOne({ email: email }).exec();
    if (founduser) {
        return res.status(403).json({ email: "Email already in use." });
    }
    // Gen pwd hash and save user to db
    const salt = bcryptjs_1.default.genSaltSync(10);
    const hash = bcryptjs_1.default.hashSync(password, salt);
    yield user_1.userModel.create({ email: email, password: hash, username: username, age: age, bio: bio });
    return res.status(200).send();
}));
r.post("/api/user/login", validators_1.emailValidate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const founduser = yield user_1.userModel.findOne({ email: req.body.email }).exec();
    if (!founduser) {
        return res.status(403).send("Login failed");
    }
    if (!bcryptjs_1.default.compareSync(req.body.password, founduser.password)) {
        return res.status(403).send("Login failed");
    }
    const token = jsonwebtoken_1.default.sign({ userId: founduser._id, email: founduser.email }, process.env.SECRET, { expiresIn: "1h" });
    return res.status(200).json({ success: true, userid: founduser._id, token: token });
}));
// Check if chat exists
function validateChat(user1, user2) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check input
        if (!user1 || !user2) {
            return null;
        }
        // Check sender/receiver pair in this order
        let chatExists = yield chat_1.chatModel.findOne({ user1: user1, user2: user2 });
        if (chatExists) {
            console.log("Found first try!");
            return chatExists;
        }
        // Check in opposite order
        chatExists = yield chat_1.chatModel.findOne({ user1: user2, user2: user1 });
        if (chatExists) {
            console.log("Found second try!");
            return chatExists;
        }
        // Create new
        chat_1.chatModel.create({ user1: user1, user2: user2, chat: [] });
        console.log("Created new chat!");
        // Check that the new chat is in database
        chatExists = yield chat_1.chatModel.findOne({ user1: user1, user2: user2 });
        return chatExists ? chatExists : null;
    });
}
r.post("/api/chat/message", validators_1.validateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = yield validateChat(req.body.sender, req.body.receiver);
    if (chat === null) {
        console.log("Failed");
        return res.status(400).send();
    }
    const newMessage = {
        sender: req.body.sender,
        text: req.body.message
    };
    chat.chat.push(newMessage);
    yield chat.save();
    res.status(200).send();
}));
r.post("/api/chat/messagehistory", validators_1.validateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = yield validateChat(req.body.sender, req.body.receiver);
    if (chat === null) {
        console.log("Failed");
        return res.status(400).send();
    }
    //for (let c of chat.chat.toObject()) {
    //    console.log(c.sender + ": " + c.text);
    //}
    res.status(200).json(chat.chat.toObject());
}));
r.get("/api/user/getuserid/:username", validators_1.validateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.userModel.find({ username: req.params.username });
    res.status(200).json({ "userid": user[0]._id });
}));
r.get("/api/user/getusername/:id", validators_1.validateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.userModel.find({ _id: req.params.id });
    res.status(200).json({ "userid": user[0].username });
}));
r.get("/api/chat/chats/:id", validators_1.validateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.userModel.find({ _id: req.params.id });
    const chats = yield user_1.userModel.find({
        matches: { $in: [user[0].username] }
    });
    res.json(chats);
}));
r.get("/api/user/users", validators_1.validateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.userModel.find({
        $and: [
            { _id: { $ne: req.user._id } },
            { username: { $nin: req.user.liked } },
            { username: { $nin: req.user.disliked } },
            { username: { $nin: req.user.matches } }
        ]
    }).limit(3).exec();
    res.json(users);
}));
r.patch("/api/user/:username", validators_1.validateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const voteUser = yield user_1.userModel.findOne({ username: req.params.username }).exec();
    const votedByUser = yield user_1.userModel.findOne({ _id: req.body.byuser_id }).exec();
    let match = false;
    if (!voteUser) {
        return res.status(403).send("User not found");
    }
    if (req.body.disliked === "disliked") {
        votedByUser.disliked.push(voteUser.username);
    }
    else if (req.body.liked === "liked") {
        votedByUser.liked.push(voteUser.username);
        if (voteUser.liked.includes(votedByUser.username) &&
            !voteUser.matches.includes(votedByUser.username) &&
            !votedByUser.matches.includes(voteUser.username)) {
            votedByUser.matches.push(voteUser.username);
            voteUser.matches.push(votedByUser.username);
            match = true;
        }
    }
    else {
        console.log("Joo");
    }
    yield voteUser.save();
    yield votedByUser.save();
    return res.json({ match: (match) ? "true" : "false" });
}));
r.post("/api/user/updatebio/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.userModel.findOne({ _id: req.params.id }).exec();
    user.bio = req.body.bio;
    yield user.save();
}));
exports.default = r;
//# sourceMappingURL=index.js.map