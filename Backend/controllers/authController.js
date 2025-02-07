import User from "../models/userModels.js";
import generateToken from "../utils/generateToken.js";
// import getDataUrl from "../utils/uriGenerator.js";
import bcrypt from "bcrypt";
// import cloudinary from "cloudinary";

const register = async (req, res) => {
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
        res.status(400).json({ message: 'i cannot create user' });
    }
};

export default register;