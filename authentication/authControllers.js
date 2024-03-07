/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const bcrypt = require("bcrypt");
const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");

const cloudinary = require("cloudinary").v2;

const createUser = async (req, res) => {
  try {
    if (
      !req.body.email ||
      !req.body.name ||
      !req.body.password ||
      !req.body.passwordConfirmation
    ) {
      throw new Error("Enter your details properly");
    }

    if (!req.file) {
      throw new Error("Profile image is required");
    }
    const { email, name, password, passwordConfirmation } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        status: "success",
        message: "Email has already an account, please login to continue.",
      });
    }
    cloudinary.uploader.upload(
      req.file.path,
      { public_id: req.file.filename },
      function (error, result) {
        console.log(result);
      }
    );
    const profileImage = `https://res.cloudinary.com/drv13gs45/image/upload/c_thumb,g_face,h_500,w_500/${req.file.filename}.jpg`;
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirmation,
      profileImage,
    });
    if (!newUser) {
      return res.status(400).json({
        status: "failed",
        message: "Something went wrong, please try again",
      });
    }
    res.status(201).json({
      status: "success",
      message: "User created successfully",
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

const loginUser = async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(403).json({
        status: "failed",
        message: "Email or password is not provided",
      });
    }
    const { email, password } = req.body;

    const authUser = await User.findOne({ email }).select("+password");
    if (!authUser) {
      throw new Error("User does not exist");
    }
    const authorized = await bcrypt.compare(password, authUser.password);

    if (!authorized) {
      throw new Error("Invalid username or password provided");
    }
    const token = await jwt.sign({ id: authUser._id }, process.env.SECRET);
    res.cookie("jwt", token);

    res.status(200).json({
      status: "success",
      message: "User has been logged in successfully",
      id: authUser._id,
      jwt: token,
    });
  } catch (err) {
    console.error(err.message);
    res.status(404).json({
      status: "failed",
      message: err.message,
    });
  }
};

const authorizeUser = async (req, res, next) => {
  console.log("Here");
  try {
    if (
      !req.headers.authorization ||
      req.headers.authorization === "" ||
      req.headers.authorization === null
    ) {
      throw new Error("Unauthorized access");
    }
    const token = req.headers.authorization.split(" ")[1];
    const verified = await jwt.verify(token, process.env.SECRET);
    const authUser = await User.findById(verified.id);
    if (!User) {
      throw new Error("User does not exist");
    }
    req.user = authUser;
    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({
      status: "failed",
      message: err.message,
    });
  }
};

module.exports = { loginUser, authorizeUser, createUser };
