import e from "express";
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    "name": {
        type: String,
        required: true
    },
    "email": {
        type: String,
        required: true,
        unique: true
    },
    // "salt":{
    //     type:Number,
    //     required: true
    // },
    "password": {
        type: String,
        required: true
    },
    "gender": {
        type: String,
        required: true,
        enum: ["male", "female"]
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
    ,
    "profilePic": {
        id: String,
        url: String
    }
}, {
    timestamps: true
})

export default mongoose.model("User", userSchema);