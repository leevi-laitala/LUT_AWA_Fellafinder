import express, { Request, Router, Response } from "express";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Validators and database models and schemas
import { emailValidate, pwdValidate, validateToken } from "../validators/validators";
import { message_t, chatModel, chatSchema } from "../models/chat";
import { userModel, userSchema } from "../models/user";

// Establish connection to database
mongoose.connect("mongodb://127.0.0.1:27017/project_testdb");
const db = mongoose.connection;

const r: Router = express.Router();

r.get("/", (req, res) => {
    res.json({msg: "Hello there"});
});

r.post("/api/user/register", emailValidate, pwdValidate, async (req, res) => {
    // Check if validations were successful
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
        return res.status(401).json({ errors: validationError });
    }

    const { email, password, username, age, bio } = req.body;

    // Check if user exists
    let founduser = await userModel.findOne({ email: email }).exec();
    if (founduser) {
        return res.status(403).json({ email: "Email already in use." });
    }

    // Gen pwd hash and save user to db
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    await userModel.create({ email: email, password: hash, username: username, age: age, bio: bio });
    return res.status(200).send();
})

r.post("/api/user/login", emailValidate, async (req, res) => {
    const founduser = await userModel.findOne({ email: req.body.email }).exec();
    if (!founduser) {
        return res.status(403).send("Login failed");
    }

    // Check if password is correct
    if (!bcrypt.compareSync(req.body.password, founduser.password)) {
        return res.status(403).send("Login failed");
    }

    // If given correct passwd, sign new token for 1 hour
    const token = jwt.sign({ userId: founduser._id, email: founduser.email }, process.env.SECRET, { expiresIn: "1h" });
    return res.status(200).json({ success: true, userid: founduser._id, token: token });
});

// Check if chat exists, eg. both users have liked each other
async function validateChat(user1: string, user2: string) {
    // Check input
    if (!user1 || !user2) {
        return null;
    }

    // Check sender/receiver pair in this order
    let chatExists = await chatModel.findOne({ user1: user1, user2: user2 });
    if (chatExists) { 
        console.log("Found first try!");
        return chatExists; 
    }

    // Check in opposite order
    chatExists = await chatModel.findOne({ user1: user2, user2: user1 });
    if (chatExists) { 
        console.log("Found second try!");
        return chatExists; 
    }

    // Create new
    chatModel.create({ user1: user1, user2: user2, chat: <message_t[]>[] });
    console.log("Created new chat!");

    // Check that the new chat is in database
    chatExists = await chatModel.findOne({ user1: user1, user2: user2 });
    return chatExists ? chatExists : null;
}

// Send new message
r.post("/api/chat/message", validateToken, async (req, res) => {
    const chat = await validateChat(req.body.sender, req.body.receiver);

    if (chat === null) {
        console.log("Failed");
        return res.status(400).send();
    }

    const newMessage: message_t = {
        sender: req.body.sender,
        text: req.body.message
    }

    chat.chat.push(newMessage);
    await chat.save();

    res.status(200).send();
});

// Get message history
r.post("/api/chat/messagehistory", validateToken, async (req, res) => {
    const chat = await validateChat(req.body.sender, req.body.receiver);

    if (chat === null) {
        console.log("Failed");
        return res.status(400).send();
    }

    //for (let c of chat.chat.toObject()) {
    //    console.log(c.sender + ": " + c.text);
    //}

    res.status(200).json(chat.chat.toObject());
});

// Convert username to id
r.get("/api/user/getuserid/:username", validateToken, async (req, res) => {
    const user = await userModel.find({ username: req.params.username });
    res.status(200).json({"userid": user[0]._id});
});

// Convert id to username
r.get("/api/user/getusername/:id", validateToken, async (req, res) => {
    const user = await userModel.find({ _id: req.params.id });
    res.status(200).json({"userid": user[0].username});
});

// Get avaliable chats with other users
r.get("/api/chat/chats/:id", validateToken, async (req, res) => {
    const user = await userModel.find({ _id: req.params.id });

    const chats = await userModel.find({
        matches: { $in: [user[0].username] }
    });

    res.json(chats);
});

// Get users that have not yet been liked or disliked
r.get("/api/user/users", validateToken, async (req, res) => {
    const users = await userModel.find({
        $and: [
            { _id: { $ne: req.user._id } },
            { username: { $nin: req.user.liked } },
            { username: { $nin: req.user.disliked } },
            { username: { $nin: req.user.matches } }
        ]
    }).limit(3).exec();

    res.json(users);
});

// Like or dislike user
r.patch("/api/user/:username", validateToken, async (req, res) => {
    const voteUser = await userModel.findOne({ username: req.params.username }).exec();
    const votedByUser = await userModel.findOne({ _id: req.body.byuser_id }).exec();
    let match = false;

    if (!voteUser) {
        return res.status(403).send("User not found");
    }

    if (req.body.disliked === "disliked") {
        votedByUser.disliked.push(voteUser.username);
    } else if (req.body.liked === "liked") {
        votedByUser.liked.push(voteUser.username);

        if (voteUser.liked.includes(votedByUser.username) && 
            !voteUser.matches.includes(votedByUser.username) &&
            !votedByUser.matches.includes(voteUser.username)) {

            votedByUser.matches.push(voteUser.username);
            voteUser.matches.push(votedByUser.username);
            match = true;
        }
    } else {
        console.log("Joo");
    }

    await voteUser.save();
    await votedByUser.save();

    return res.json({ match: (match) ? "true" : "false" });
});

// Update user bio
r.post("/api/user/updatebio/:id", async (req, res) => {
    const user = await userModel.findOne({ _id: req.params.id }).exec();

    user.bio = req.body.bio;

    await user.save();
});

export default r;
