import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import post from '../controllers/postController.js';
import uploadFile from '../middlewares/multer.js';

const router = express.Router();

router.post("/new", isAuth, uploadFile, post.newPost);
router.delete("/:id", isAuth, post.deletePost);
router.get("/all", isAuth, post.getAllPosts);
export default router;