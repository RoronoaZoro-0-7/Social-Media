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
    });

    if (!chat) {
        return res.status(200).json({ msg: [] });
    }
    const messages = await Message.find({
        chatId: chat._id
    });
    return res.status(200).json({
        msg: messages
    });
})

const getAllChats = TryCatch(async (req, res) => {
    console.log("getAllChats req.user:", req.user);
    const userId = req.user._id;
    try {
        const chats = await Chat.find({ users: userId })
            .populate({
                path: "users",
                select: "name profilePic"
            });

        chats.forEach((e) => {
            e.users = e.users.filter((user) => user._id.toString() !== userId.toString());
        })

        return res.status(200).json({ chats });
    }
    catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

const startChat = TryCatch(async (req, res) => {
    const { recipientId } = req.body;
    const userId = req.user._id;
    if (!recipientId) {
        return res.status(400).json({ message: "Recipient ID is required" });
    }
    let chat = await Chat.findOne({ users: { $all: [userId, recipientId] } }).populate({
        path: "users",
        select: "name profilePic"
    });
    if (!chat) {
        chat = new Chat({
            users: [userId, recipientId],
            latestMessage: { text: "", sender: userId }
        });
        await chat.save();
        chat = await Chat.findById(chat._id).populate({
            path: "users",
            select: "name profilePic"
        });
    }
    // Remove current user from users array for frontend
    chat.users = chat.users.filter((user) => user._id.toString() !== userId.toString());
    return res.status(200).json(chat);
});

export default { sendMessage, getAllMessages, getAllChats, startChat };