const express = require("express");
const { signup, login, getUser } = require("../controllers/authController");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Sign up a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 */
router.post("/signup", signup);

/**
 * @swagger
 * /api/users/signin:
 *   post:
 *     summary: Sign in an existing user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: User doesn't exist or Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post("/signin", login);

/**
 * @swagger
 * /api/users/get-user:
 *   get:
 *     summary: Get user details
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details fetched successfully
 *       401:
 *         description: Access denied. No token provided.
 *       404:
 *         description: User not found
 *       400:
 *         description: Invalid token
 */
router.get("/get-user", authMiddleware, getUser);

module.exports = router;
