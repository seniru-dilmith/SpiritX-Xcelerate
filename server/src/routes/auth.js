const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Signup endpoint
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const newUser = await User.create({ username, password });
    req.session.userId = newUser.id;
    res.json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

// Login endpoint
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: "Username does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Create tokens
    const accessToken = jwt.sign(
      { id: user.id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user.id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Set tokens as HttpOnly cookies with merged options
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.json({
      message: "Login successful",
      user: { username: user.username },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });    
  }
});

// Refresh endpoint to issue a new access token using the refresh token
router.post("/refresh", (req, res) => {
  // Parse cookies manually
  const cookies = {};
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    cookieHeader.split(";").forEach((cookie) => {
      const parts = cookie.split("=");
      cookies[parts.shift().trim()] = decodeURI(parts.join("="));
    });
  }
  const refreshToken = cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    // Generate new access token
    const newAccessToken = jwt.sign(
      { id: payload.id, username: payload.username, isAdmin: payload.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.json({ message: "Access token refreshed" });
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
});

// Logout endpoint
router.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
