import Chat from "../models/chatModel.js";


export const sendMessage = async (req, res) => {
  const { mentorId, studentId, sender, text } = req.body;

  try {
    let chat = await Chat.findOne({ mentor: mentorId, student: studentId });

    if (!chat) {
      chat = await Chat.create({
        mentor: mentorId,
        student: studentId,
        messages: [{ sender, text }],
      });
    } else {
      chat.messages.push({ sender, text });
      await chat.save();
    }

    res.status(200).json({ message: "Message sent", chat });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending message", error: error.message });
  }
};


export const getChat = async (req, res) => {
  const { mentorId, studentId } = req.params;

  try {
    const chat = await Chat.findOne({ mentor: mentorId, student: studentId });
    if (!chat) return res.status(404).json({ message: "No chat found" });

    res.status(200).json(chat);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching chat", error: error.message });
  }
};
