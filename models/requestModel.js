const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
    },
  }
);

const Request = mongoose.model("Requests", requestSchema);

module.exports = Request;
