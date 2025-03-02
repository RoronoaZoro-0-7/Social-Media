import mongoose from "mongoose";

const messageschema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    text: String
}, { timestamps: true })

export default mongoose.model("Messages", messageschema);