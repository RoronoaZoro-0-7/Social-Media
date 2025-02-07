import express from 'express';
import register from '../controllers/authController.js';
import uploadFile from "../middlewares/multer.js";

const router = express.Router();

router.post("/register",register);
// router.post("/register", uploadFile ,register);

export default router;