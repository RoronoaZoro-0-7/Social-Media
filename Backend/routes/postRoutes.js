import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import post from '../controllers/postController.js';
import uploadFile from '../middlewares/multer.js';

const router = express.Router();

router.post("/new", isAuth, uploadFile, post.newPost);
router.delete("/:id", isAuth, post.deletePost);
router.get("/all", isAuth, post.getAllPosts);
router.post("/like/:id", isAuth, post.likeUnlikePost);
router.post("/comment/:id", isAuth, post.commentOnPost);
router.delete("/comment/:id", isAuth, post.deleteComment);
router.put("/:id", isAuth, post.editCaption);

export default router;