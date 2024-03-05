/* eslint-disable no-undef */
require("dotenv").config({ path: "config.env" });
const { v2: cloudinary } = require("cloudinary");
exports.cloudinaryPic = cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const express = require("express");
const cookieParser = require("cookie-parser");
const userRouter = require("./Routes/userRoutes");
const authorizedRoutes = require("./Routes/authRoutes");
const requestRouter = require("./Routes/requestRoutes");
const messageRouter = require("./Routes/msgRoutes");
const profileRouter = require("./Routes/profileRoutes");
const socket = require("socket.io");
const http = require("http");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const server = http.createServer(app);
app.use(cors({ origin: "http://localhost:5173" }));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

const io = socket(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  },
});
io.on("connection", () => {
  console.log("User connected");
});

app.use("/api/user/profile", profileRouter);
app.use("/api/messages", messageRouter);
app.use("/api/user", userRouter);
app.use("/api/auth", authorizedRoutes);
app.use("/api/requests", requestRouter);

module.exports = server;
