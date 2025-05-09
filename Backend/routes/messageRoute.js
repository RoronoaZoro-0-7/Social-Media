import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import msg from '../controllers/messageController.js';

const router = express.Router();

router.post("/", isAuth, msg.sendMessage);
router.get("/:id", isAuth, msg.getAllMessages);

// in video he changed this router position into the index file
// because of get issue and i have changes this into api into /all/chats
router.get("/all/chats", isAuth, msg.getAllChats);

export default router;
