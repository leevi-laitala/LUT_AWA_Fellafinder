import mongoose, { Schema } from "mongoose";

type message_t = {
    //date: Date,
    sender: string,
    text: string,
}

const chatSchema = new Schema({ 
    user1: { type: String, required: true },
    user2: { type: String, required: true },
    chat: { type: [Object], required: true }
});

const chatModel = mongoose.model("chat", chatSchema);

export { message_t, chatModel, chatSchema };
