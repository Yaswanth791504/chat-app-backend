const express = require("express");
const requestController = require("./../Controllers/requestController");
const authController = require("./../authentication/authControllers");
const router = express.Router();

router
  .route("/")
  .post(authController.authorizeUser, requestController.sendRequest)
  .get(authController.authorizeUser, requestController.getRequests);

router
  .route("/:id")
  .post(authController.authorizeUser, requestController.acceptRequest);

module.exports = router;
