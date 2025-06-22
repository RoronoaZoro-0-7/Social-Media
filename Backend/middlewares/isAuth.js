import jwt from 'jsonwebtoken';
import User from '../models/userModels.js';

const isAuth = async(req,res,next) => {
    try {
        const token = req.cookies.token;
        console.log("isAuth middleware: token =", token);
        if(!token){
            console.log("isAuth: No token, unauthorized");
            return res.status(403).json({message: "Unauthorized"});
        }
        const decodedData = jwt.verify(token,process.env.JWT_SECRET);
        if(!decodedData){
            console.log("isAuth: Token expired or invalid");
            res.status(400).json({
                message:"Token Expired"
            });
        }
        req.user = await User.findById(decodedData.id);
        console.log("isAuth: req.user =", req.user);

        next();
    } catch (error) {
        console.log("isAuth: Error", error);
        res.status(500).json({message: "Please Login"});
    }
}

export default isAuth;