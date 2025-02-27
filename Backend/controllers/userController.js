import TryCatch from "../utils/TryCatch.js";
import User from "../models/userModels.js";
import getDataUrl from "../utils/urlGenerator.js";
import cloudinary from "cloudinary";
import bcrypt from "bcrypt";

const myProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json({ user });
});

const userProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
});

const followandunfollowUser = TryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    const loggedInUser = await User.findById(req.user._id);

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    if (user._id.toString() === loggedInUser._id.toString()) {
        return res.status(400).json({
            message: "You cannot follow yourself"
        });
    }

    if (user.followers.includes(loggedInUser._id.toString())) {
        const indexFollowing = loggedInUser.following.indexOf(user._id.toString());
        const indexFollower = user.followers.indexOf(loggedInUser._id.toString());

        loggedInUser.following.splice(indexFollowing, 1);
        user.followers.splice(indexFollower, 1);

        await user.save();
        await loggedInUser.save();

        return res.status(200).json({ message: "User unfollowed successfully" });
    } else {
        loggedInUser.following.push(user._id);
        user.followers.push(loggedInUser._id);

        await user.save();
        await loggedInUser.save();

        return res.status(200).json({ message: "User followed successfully" });
    }
});

const userFollowerandFollowingData = async (req, res) => {
    const user = await User.findById(req.params.id)
        .select("-password")
        .populate("followers", "-password")
        .populate("following", "-password");

    const followers = user.followers;
    const following = user.following;

    res.status(200).json({ followers, following });
}

const updateProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (req.body.name) {
        user.name = req.body.name;
    }
    
    const file = req.file;
    if(file){
        const fileURL = getDataUrl(file);
        
        if(user.profilePic.id){
            await cloudinary.v2.uploader.destroy(user.profilePic.id);
        }
        
        const myCLoud = await cloudinary.v2.uploader.upload(fileURL.content);
        user.profilePic.id = myCLoud.public_id;
        user.profilePic.url = myCLoud.secure_url;
    }

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
})

const updatePassword = TryCatch(async (req, res) => {
    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Both old and new passwords are required" });
    }

    if (oldPassword === newPassword) {
        return res.status(400).json({ message: "New password cannot be the same as old password" });
    }

    const comparePassword = await bcrypt.compare(oldPassword, user.password);

    if (!comparePassword) {
        return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
})

export default { myProfile, userProfile, followandunfollowUser, userFollowerandFollowingData, updateProfile, updatePassword };