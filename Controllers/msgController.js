const Messages = require("./../models/msgModel");

const getUserMessages = async (req, res) => {
  try {
    const { to } = req.params;
    const from = req.user._id;
    const fromMessages = await Messages.find({
      $or: [
        { from, to },
        { from: to, to: from },
      ],
    }).sort({ sent_at: 1 });
    res.status(200).json({
      status: "success",
      results: fromMessages.length,
      data: fromMessages,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

const sendMessage = async (req, res) => {
  try {
    const message = req.body.message;
    const { to } = req.params;
    const from = req.user._id;
    const newMessage = await Messages.create({ from, to, message });
    res.status(201).json({
      status: "success",
      data: {
        newMessage,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

module.exports = { getUserMessages, sendMessage };
