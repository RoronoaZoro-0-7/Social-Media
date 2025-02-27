import TryCatch from "../utils/TryCatch.js";
import getDataUrl from "../utils/urlGenerator.js";
import cloudinary from "cloudinary";
import Post from "../models/postModels.js";

const newPost = TryCatch(async (req, res) => {
    const { caption } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: "File is required" });
    }

    const fileurl = getDataUrl(file);
    const type = req.query.type;

    const option = type === "reel" ? { resource_type: "video" } : {};

    const myCloud = await cloudinary.v2.uploader.upload(fileurl.content, option);

    const post = await Post.create({
        caption,
        post: {
            id: myCloud.public_id,
            url: myCloud.secure_url
        },
        type,
        owner: req.user._id
    });

    res.status(201).json({
        message: "Post created",
        data: post
    });
});

export default {newPost};