import TryCatch from '../utils/TryCatch.js';
import Chat from '../models/chatModels.js';
import Message from '../models/messageModels.js';

const sendMessage = TryCatch(async (req, res) => {
    const { receiverId, message } = req.body;

    if (!receiverId) {
        return res.status(400).json({ message: "Receiver ID is required" });
    }
    if (!message) {
        return res.status(400).json({ message: "Message is required" });
    }

    const senderId = req.user._id;

    let chat = await Chat.findOne({
        users: { $all: [senderId, receiverId] }
    })

    if (!chat) {
        chat = new Chat({
            users: [senderId, receiverId],
            latestMessage: {
                text: message,
                sender: senderId
            }
        })
        await chat.save();
    }
    const newMessage = new Message({
        chatId: chat._id,
        sender: senderId,
        text: message
    })
    await newMessage.save();
    await chat.updateOne({
        latestMessage: {
            text: message,
            sender: senderId
        }
    })
    res.status(200).json({
        message: "Message sent successfully",
        msg: newMessage,
        chat: chat
    })
})

const getAllMessages = TryCatch(async (req, res) => {
    const id = req.params.id;
    const userId = req.user._id;

    const chat = await Chat.findOne({
        users: { $all: [userId, id] }
    })

    if (!chat) {
        return res.status(404).json({
            message: "No chat with this user"
        })
    }
    const messages = await Message.find({
        chatId: chat._id
    });
    return res.status(200).json({
        msg: messages
    })
})

const getAllChats = TryCatch(async (req, res) => {
    const userId = req.user._id;
    try {
        const chats = await Chat.find({ users: userId })
            .populate({
                path: "users",
                select: "name profilePic"
            });

        chats.forEach((e) => {
            e.users = e.users.filter((user) => {
                user._id.toString() !== userId.toString();
            })
        })

        return res.status(200).json({ chats });
    }
    catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

export default { sendMessage, getAllMessages, getAllChats };