const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Define route for adding a user
router.post("/add-user", userController.addUser);
// Add this route
router.get("/user-data", userController.getAllUsers);
// Fetch user by ID
router.get("/user/:id", userController.getUserById);
router.put("/update-user/:id", userController.updateUser);
module.exports = router;
