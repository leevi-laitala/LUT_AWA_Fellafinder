import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({ 
    email: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: false },
    age: { type: Number, required: false },
    bio: { type: String, required: false },
    liked: { type: [String], required: false },
    disliked: { type: [String], required: false },
    matches: { type: [String], required: false }
});

const userModel = mongoose.model("user", userSchema);

export { userModel, userSchema };
