const express = require("express");
const router = express.Router();
const {
  getTasks,
  getTask,
  postTask,
  putTask,
  deleteTask,
} = require("../controllers/taskControllers");
const { verifyAccessToken } = require("../middleware/index.js");

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of tasks.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get("/tasks", verifyAccessToken, getTasks);

// /**
//  * @swagger
//  * /tasks/{taskId}:
//  *   get:
//  *     summary: Get a task by ID
//  *     tags: [Tasks]
//  *     security:
//  *       - BearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: taskId
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: ID of the task to retrieve
//  *     responses:
//  *       200:
//  *         description: Task found
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Task'
//  *       400:
//  *         description: Invalid task ID
//  *       404:
//  *         description: Task not found
//  *       401:
//  *         description: Unauthorized
//  *       500:
//  *         description: Internal Server Error
//  */
// router.get("/tasks/:taskId", verifyAccessToken, getTask);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Task object that needs to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: Task created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post("/tasks", verifyAccessToken, postTask);

/**
 * @swagger
 * /tasks/{taskId}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the task to update
 *     requestBody:
 *       description: Updated task object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request
 *       403:
 *         description: You can't update task of another user
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.put("/tasks/:taskId", verifyAccessToken, putTask);

/**
 * @swagger
 * /tasks/{taskId}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the task to delete
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       400:
 *         description: Invalid task ID
 *       403:
 *         description: You can't delete task of another user
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.delete("/tasks/:taskId", verifyAccessToken, deleteTask);

module.exports = router;