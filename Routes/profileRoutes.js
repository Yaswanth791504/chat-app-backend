const express = require("express");
const { authorizeUser } = require("../authentication/authControllers");
const { getProfile } = require("../Controllers/profileController");
const router = express.Router();

router.route("/:id").get(authorizeUser, getProfile);

module.exports = router;
