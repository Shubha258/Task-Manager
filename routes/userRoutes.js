const express = require("express");
const router = express.Router();
const { getProfile, signup } = require("../controllers/userControllers");
const { verifyAccessToken } = require("../middleware/index.js");

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get user profile by ID
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to retrieve
 *     responses:
 *       200:
 *         description: User profile found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
router.get("/users/:userId", verifyAccessToken, getProfile);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: User sign-up
 *     tags: [Users]
 *     requestBody:
 *       description: User object for sign-up
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 required: true
 *               password:
 *                 type: string
 *                 description: User's password
 *                 required: true
 *               name:
 *                 type: string
 *                 description: User's name
 *                 required: true
 *     responses:
 *       201:
 *         description: User signed up successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 */
router.post("/users", signup);

module.exports = router;
