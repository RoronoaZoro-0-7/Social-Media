import TryCatch from "../utils/TryCatch.js";
import getDataUrl from "../utils/urlGenerator.js";
import cloudinary from "cloudinary";
import Post from "../models/postModels.js";

const newPost = TryCatch(async (req, res) => {
    const { caption } = req.body;
    const owner = req.user._id;

    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.file;
    const fileurl = getDataUrl(file);

    if (!fileurl || !fileurl.content) {
        return res.status(500).json({ message: "Invalid file URL generated" });
    }

    const type = req.query.type || "image";
    const option = {
        resource_type: type === "reel" ? "video" : "image",
    };
    const mycloud = await cloudinary.v2.uploader.upload(fileurl.content, option);
    const post = await Post.create({
        caption,
        post: {
            id: mycloud.public_id,
            url: mycloud.secure_url,
        },
        type,
        owner,
    });

    res.status(201).json({
        status: "success",
        data: post
    })

});

const deletePost = TryCatch(async (req, res) => {
    console.log(req.params.id);
    const post = await Post.findById(req.params.id.toString());
    console.log(post);

    if (!post) {
        return res.status(400).json({ message: "No post with this ID" });
    }

    if (post.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    if (post.post && post.post.id) {
        await cloudinary.v2.uploader.destroy(post.post.id, {
            resource_type: post.type === "reel" ? "video" : "image",
        });
    }

    await post.deleteOne();

    res.status(200).json({ message: "Post Deleted" });
});

const getAllPosts = TryCatch(async (req, res) => {
    const post = await Post.find({type: "post",owner:req.user._id})
    .sort({createdAt: -1})
    .populate("owner");
    // const post = await Post.find({type: "post"})
    // .sort({createdAt: -1})
    // .populate("owner");
    if (!post) {
        return res.status(400).json({ message: "No Post found" });
    }
    return res.status(200).json({
        data: post
    })
})

export default { newPost, deletePost, getAllPosts };