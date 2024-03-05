/* eslint-disable no-unused-vars */
const User = require("../models/userModel");
const Request = require("./../models/requestModel");

const sendRequest = async (req, res) => {
  try {
    const { to } = req.body;
    const from = req.user._id;
    const existingRequest = await Request.findOne({ from, to });
    if (existingRequest) {
      return res.status(202).json({
        status: "success",
        message: "Request already sent",
      });
    }
    const sendingRequest = await Request.create({
      from,
      to,
    });

    if (!sendingRequest) {
      throw new Error("Something went wrong, please try again");
    }
    res.status(200).json({
      status: "success",
      message: "Request sent successfully",
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

const acceptRequest = async (req, res) => {
  try {
    const { id: from } = req.params;
    const { _id: to } = req.user;

    const RequestDeleted = await Request.deleteOne({ from, to });
    if (!RequestDeleted) {
      return res.status(400).json({
        status: "failed",
        message: "Request Not Found, please try again",
      });
    }
    const fromUser = await User.updateOne(
      { _id: from },
      { $push: { friends: to } }
    );
    const toUser = await User.updateOne(
      { _id: to },
      { $push: { friends: from } }
    );

    if (!fromUser || !toUser) {
      return res.status(400).json({
        status: "failed",
        message: "Something went wrong, please try again",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Request accepted successfully",
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

const getRequests = async (req, res) => {
  try {
    const { _id: to } = req.user;
    const requests = await Request.find({ to })
      .populate("from", "name profileImage")
      .sort({ created_at: -1 });

    if (!requests) {
      return res.status(400).json({
        status: "failed",
        message: "Something went wrong, please try again",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Requests fetched successfully",
      requests,
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

const sendRequestToAllUsersFromAllUsers = async () => {
  try {
    const users = await User.find({}).select("_id");
    const userMap = await users.map(async (doc) => {
      const updatedUser = await User.findByIdAndUpdate(doc._id, {
        $set: {
          friends: users.filter((res) => res._id !== doc._id),
        },
      });
      return updatedUser;
    });
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { sendRequest, acceptRequest, getRequests };
