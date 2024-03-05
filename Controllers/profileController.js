const User = require("../models/userModel");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select({
      name: 1,
      email: 1,
      profileImage: 1,
      _id: 0,
    });
    if (!user) {
      throw new Error("User not found");
    }
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

module.exports = { getProfile };
