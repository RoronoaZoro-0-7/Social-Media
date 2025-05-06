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
    const post = await Post.find()
        .sort({ createdAt: -1 })
        .populate("owner", "-password")
        .populate({
            path: "comments.user",
            select: "-password"
        });
    if (!post) {
        return res.status(400).json({ message: "No Post found" });
    }
    return res.status(200).json({
        data: post
    })
})

const likeUnlikePost = TryCatch(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }
    const isLiked = post.likes.includes(req.user._id);
    if (isLiked) {
        post.likes = post.likes.filter((id) => { return id.toString() !== req.user._id.toString() });
        await post.save();
        return res.status(200).json({
            message: "Unliked the Post"
        })
    }
    post.likes.push(req.user._id);
    await post.save();
    return res.status(200).json({
        message: "Liked the Post"
    })
})

const commentOnPost = TryCatch(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return res.status(400).json({
            message: "Post Not Found"
        })
    }
    post.comments.push({
        user: req.user._id,
        name: req.user.name,
        comment: req.body.comment
    })
    await post.save();
    res.status(200).json({
        message: "Comment Added to post",
        data: post
    })
})

const deleteComment = TryCatch(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return res.status(400).json({ message: "Post Not Found" });
    }

    const commentId = req.body.commentId;
    if (!commentId) {
        return res.status(400).json({ message: "Send the commentId" });
    }

    const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);

    if (commentIndex === -1) {
        return res.status(404).json({ message: "Comment Not Found" });
    }

    post.comments.splice(commentIndex, 1);
    await post.save();

    res.status(200).json({ message: "Comment Deleted Successfully" });
});

const editCaption = TryCatch(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return res.status(400).json({ message: "Post Not Found" });
    }

    if (post.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    if(!req.body.caption){
        return res.status(400).json({ message: "Caption is required" });
    }

    post.caption = req.body.caption;
    await post.save();

    res.status(200).json({ message: "Caption Updated Successfully" ,data:post});

})

export default { newPost, deletePost, getAllPosts, likeUnlikePost, commentOnPost, deleteComment, editCaption };