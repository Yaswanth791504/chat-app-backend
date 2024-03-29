const express = require("express");
const userController = require("./../Controllers/userController");
const authorize = require("./../authentication/authControllers");
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

router
  .route("/updateProfileImage")
  .put(
    authorize.authorizeUser,
    upload.single("profileImage"),
    userController.updateUserProfileImage
  );

router
  .route("/updateBackgroundImage")
  .put(
    authorize.authorizeUser,
    upload.single("backgroundImage"),
    userController.updateBackgroundImage
  );

router.route("/").get(authorize.authorizeUser, userController.getUserProfile);
router.route("/search").post(authorize.authorizeUser, userController.getUsers);

router
  .route("/:id")
  .get(authorize.authorizeUser, userController.getFriendsChats)
  .delete(authorize.authorizeUser, userController.deleteFriend);

router
  .route("/search/users")
  .post(authorize.authorizeUser, userController.searchfromUsers);
module.exports = router;
