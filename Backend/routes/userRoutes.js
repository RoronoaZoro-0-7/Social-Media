import express from 'express';
import isAuth from "../middlewares/isAuth.js";
import profile from '../controllers/userController.js';

const router = express.Router();

router.get("/me" , isAuth , profile.myProfile);
router.get("/:id",isAuth , profile.userProfile);

export default router;