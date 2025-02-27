import express from 'express';
import authController from "../controllers/authController.js";
import uploadFile from "../middlewares/multer.js";

const { register, login ,logout} = authController;

const router = express.Router();

// router.post("/register",register);
router.post("/register", uploadFile ,register);

router.post("/login", login);
router.get("/logout", logout);

export default router;