const express = require("express");
const messageController = require("../Controllers/msgController");
const authorize = require("./../authentication/authControllers");
const router = express.Router();

router
  .route("/:to")
  .get(authorize.authorizeUser, messageController.getUserMessages)
  .post(authorize.authorizeUser, messageController.sendMessage);

module.exports = router;
