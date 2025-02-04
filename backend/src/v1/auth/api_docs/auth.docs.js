/**
 * @swagger
 * /v1/auth/signup:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user with the provided details. Validates the input, checks if the email is already registered, and stores the user data after hashing the password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: Akshay
 *                 description: The first name of the user.
 *               last_name:
 *                 type: string
 *                 example: Chandra
 *                 description: The last name of the user.
 *               email:
 *                 type: string
 *                 example: akshay@gmail.com
 *                 description: The email address of the user. Must be unique.
 *               password:
 *                 type: string
 *                 example: password
 *                 description: The password for the user.
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: User created
 *       400:
 *         description: Invalid request or user creation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Email already registered
 */


/**
 * @swagger
 * /v1/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user by verifying their credentials. Returns an access token and a refresh token upon successful login.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 example: akshay@gmail.com or akshay
 *                 description: The email or username of the user.
 *               password:
 *                 type: string
 *                 example: password
 *                 description: The user's password.
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: User logged in!
 *                 accessToken:
 *                   type: string
 *                   example: "akdslfjsalkfjaflkicvklsakjdlfalk..."
 *       400:
 *         description: Invalid credentials or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Invalid credentials
 *       401:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Validation error message"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Internal server error
 */
