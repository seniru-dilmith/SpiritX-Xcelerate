const express = require("express");
const { signup, login, refreshTokens, logout, verifyCookies } = require("../controllers/auth");
const router = express.Router();

// Signup endpoint
router.post("/signup", signup);

// Login endpoint
router.post("/login", login);

// Refresh endpoint to issue a new access token using the refresh token
router.post("/refresh", refreshTokens);

// Logout endpoint
router.post("/logout", logout);

// Get current user
router.get("/me", verifyCookies);

module.exports = router;
