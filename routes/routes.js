const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("./../controllers/AuthController");

const { getUsers, addImage } = require("./../controllers/AdminController");

const { getImageIds, getImage } = require("./../controllers/UserController");

//auth
router.post("/register", registerUser);
router.post("/sign-in", loginUser);

//admin
router.post("/admin/image/:imageId", addImage);
router.get("/get-users", getUsers);

//user
router.get("/user/:userId/getImageIds", getImageIds);
router.get("/user/:imageId/getImage", getImage);

module.exports = router;
