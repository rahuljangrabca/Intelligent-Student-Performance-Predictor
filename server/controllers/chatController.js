const Message = require("../models/Messages");

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    const newMsg = new Message({
      senderId: req.user.id,
      receiverId,
      message
    });

    await newMsg.save();

    res.json(newMsg);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get chat messages
exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: req.user.id, receiverId: userId },
        { senderId: userId, receiverId: req.user.id }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};