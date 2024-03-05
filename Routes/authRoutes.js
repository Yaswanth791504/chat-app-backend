const express = require("express");
const authController = require("./../authentication/authControllers");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/profileImages");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.route("/login").post(authController.loginUser);
router
  .route("/signup")
  .post(upload.single("profileImage"), authController.createUser);
module.exports = router;
