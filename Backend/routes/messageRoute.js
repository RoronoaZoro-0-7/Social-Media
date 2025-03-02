import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import msg from '../controllers/messageController.js';

const router = express.Router();

router.post("/",isAuth,msg.sendMessage);
router.get("/:id",isAuth,msg.getAllMessages);
router.get("/all/chats", isAuth, msg.getAllChats);

export default router;