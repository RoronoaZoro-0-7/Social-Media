import express from 'express';
import dotenv from 'dotenv';
import mongoose from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import cloudinary from 'cloudinary';
import cookieParser from 'cookie-parser';

cloudinary.config({
    cloud_name : process.env.Cloudinary_Cloud_Name,
    api_key : process.env.Cloudinary_Api_Key,
    api_secret : process.env.Cloudinary_Api_Secret
});

// mongoose;
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/user", userRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/post",postRoutes);

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(process.env.PORT, () => {
    console.log('Server is running on port 3000');
});