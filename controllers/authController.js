const User = require("../models/User");
const jwt = require("jsonwebtoken"); // For generating tokens
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", data: newUser });
  } catch (error) {
    console.log("Sign up Error : ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const existingUser = await User.findOne({ email });

    // Handle case where user does not exist
    if (!existingUser) {
      return res.status(400).json({ message: "User doesn't exist" });
    }

    // Compare provided password with stored hashed password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    // Handle invalid password
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUser = async (req, res) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    // Strip out "Bearer " from the token if it exists
    const tokenStripped = token.startsWith("Bearer ")
      ? token.slice(7, token.length)
      : token;

    // Verify the token
    const decoded = jwt.verify(tokenStripped, process.env.JWT_SECRET);
    console.log(decoded); // Debug the decoded token

    // Find the user by ID
    const user = await User.findById(decoded.id).select("-password"); // Exclude the password field

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send user details
    res
      .status(200)
      .json({ message: "User details fetched successfully", data: user });
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = { signup, login, getUser };
