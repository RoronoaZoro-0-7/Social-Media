import TryCatch from "../utils/TryCatch.js";
import User from "../models/userModels.js";

const myProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.user._id);

    res.status(200).json({user});
});

const userProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);

    if(!user){
        res.status(404).json({message: "User not found"});
    }

    res.json(user);
});

export default {myProfile, userProfile};