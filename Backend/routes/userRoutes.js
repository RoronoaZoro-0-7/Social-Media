import express from 'express';
import isAuth from "../middlewares/isAuth.js";
import profile from '../controllers/userController.js';
import uploadFile from '../middlewares/multer.js';

const router = express.Router();

router.get("/me", isAuth, profile.myProfile);
router.get("/:id", isAuth, profile.userProfile);
router.post("/:id", isAuth, profile.updatePassword);
router.put("/:id", isAuth, profile.updateProfile);
// router.put("/:id", isAuth , uploadFile , profile.updateProfile);
router.put("/follow/:id", isAuth, profile.followandunfollowUser);
router.post("/followdata/:id", isAuth, profile.userFollowerandFollowingData);

export default router;