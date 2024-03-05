const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcrypt");
const User = require("./../models/userModel");

const getUser = async (req, res) => {
  try {
    const { name } = req.body;
    const foundUser = await User.find({ name }).select(
      "name email profileImage"
    );
    if (!foundUser) {
      return res.status(200).json({
        status: "success",
        message: "User not found",
      });
    }
    return res.status(200).json({
      status: "success",
      message: foundUser,
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: "failed",
      message: "something went wrong, please try again",
    });
  }
};

const getFriendsChats = async (req, res) => {
  try {
    const { id } = req.params;
    const friendsChats = await User.findById(id)
      .select("friends")
      .populate("friends", "name profileImage email");
    if (!friendsChats) {
      throw new Error("Something went wrong");
    }
    res.status(200).json({
      status: "success",
      data: friendsChats,
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: "failed",
      message: "something went wrong, please try again",
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const { name } = req.body;
    const users = await User.find({
      name: { $regex: name },
      _id: { $ne: req.user._id },
      friends: { $ne: req.user._id },
    }).select({
      name: 1,
      email: 1,
      profileImage: 1,
    });

    if (!users) {
      throw new Error("No user found");
    }
    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: "failed",
      message: "something went wrong, please try again",
    });
  }
};

const deleteFriend = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id: userId } = req.user;

    const userFriend = await User.findById(id).select("friends");
    const friendUser = await User.findById(userId).select("friends");

    if (
      !userFriend.friends.includes(userId) ||
      !friendUser.friends.includes(id)
    ) {
      throw new Error("You are not friends with this user");
    }
    const user = await User.findByIdAndUpdate(id, {
      $pull: { friends: userId },
    });
    const currentUser = await User.findByIdAndUpdate(userId, {
      $pull: { friends: id },
    });
    if (!user || !currentUser) {
      throw new Error("Something went wrong");
    }
    res.status(200).json({
      status: "success",
      message: "Friend deleted successfully",
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("password");
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      throw new Error("Invalid password");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const { _id: id } = req.user;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      {
        new: true,
      }
    );
    if (!updatedUser) {
      throw new Error("Something went wrong");
    }
    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { _id: id } = req.user;
    const user = await User.findById(id).select({
      name: 1,
      email: 1,
      profileImage: 1,
      backgroundImage: 1,
    });
    if (!user) {
      throw new Error("User not found");
    }
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

const updateUserProfileImage = async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        req.file.path,
        { public_id: req.file.filename },
        function (error, result) {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      );
    });
    const profileImage = `https://res.cloudinary.com/drv13gs45/image/upload/c_thumb,g_face,h_500,w_500/${req.file.filename}.jpg`;
    const { _id: id } = req.user;
    const updated = await User.findByIdAndUpdate(
      id,
      { profileImage },
      { new: true }
    );

    console.log(updated);
    if (!updated) {
      throw new Error("Something went wrong");
    }
    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

const updateBackgroundImage = async (req, res) => {
  try {
    cloudinary.uploader.upload(
      req.file.path,
      { public_id: req.file.filename },
      function (error, result) {
        console.log(result);
      }
    );
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        backgroundImage: `https://res.cloudinary.com/drv13gs45/image/upload/c_thumb,g_center,h_400,w_800/${req.file.filename}.jpg`,
      },
      {
        new: true,
      }
    );
    if (!user) {
      throw new Error("Something went wrong");
    }
    console.log(user);
    res.status(200).json({
      status: "success",
      message: "Background Image updated successfully",
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

const searchfromUsers = async (req, res) => {
  try {
    const users = await User.findById(req.user._id).select("friends");

    if (!users) {
      throw new Error("No user found");
    }

    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: "failed",
      message: "something went wrong, please try again",
    });
  }
};

module.exports = {
  getUser,
  getFriendsChats,
  getUsers,
  deleteFriend,
  updateUserProfile,
  getUserProfile,
  updateUserProfileImage,
  updateBackgroundImage,
  searchfromUsers,
};
