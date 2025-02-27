import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    caption: String,

    post: {
        id: { type: String },
        url: { type: String }
    },

    type: {
        type: String,
        required: true
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: {
            type: String,
            required: true
        },
        comment: {
            type: String,
            required: true
        }
    }],
}, { timestamps: true })

export default mongoose.model("Post", postSchema);