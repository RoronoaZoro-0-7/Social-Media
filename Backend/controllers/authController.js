import User from "../models/userModels.js";
import generateToken from "../utils/generateToken.js";
// import getDataUrl from "../utils/uriGenerator.js";
import bcrypt from "bcrypt";
// import cloudinary from "cloudinary";
import TryCatch from "../utils/TryCatch.js";

const register = TryCatch(async (req, res) => {
    try {
        const { name, email, password, gender } = req.body;
        // const file = req.file;

        if (!name || !email || !password || !gender /* || !file */) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // const fileUrl = getDataUrl(file);
        const hashedPassword = await bcrypt.hash(password, 10);

        // const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content);

        user = await User.create({
            name,
            email,
            password: hashedPassword,
            gender,
            // profilePic: {
            //     id: myCloud.public_id,
            //     url: myCloud.secure_url
            // }
        });

        if (!user) {
            return res.status(400).json({ message: "User not created" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            message: "User created successfully",
            user
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const login = TryCatch(async (req, res) => {
    const {email , password} = req.body;

    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message: "No User with this email"});
    }

    // This return bool value true or false
    const comparePassword = await bcrypt.compare(password, user.password);
    if(!comparePassword){
        return res.status(400).json({message: "Invalid Password"});
    }

    generateToken(user._id, res);

    res.status(200).json({
        message: "User logged in successfully",
        user
    });

});

const logout = TryCatch(async (req, res) => {
    res.cookie("token","",{maxAge: 0});

    res.json({
        message: "Logged out successfully"
    });

});

export default { register, login , logout};