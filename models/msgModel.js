const mongoose = require("mongoose");

const msgSchema = new mongoose.Schema({
  message: String,
  from: mongoose.Schema.Types.ObjectId,
  to: mongoose.Schema.Types.ObjectId,
  seen: {
    type: Boolean,
    default: false,
  },
  sent_at: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Messages", msgSchema);

module.exports = Message;
