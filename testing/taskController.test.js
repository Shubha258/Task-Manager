const {
  getTasks,
  getTask,
  postTask,
  putTask,
  deleteTask,
} = require("../controllers/taskControllers");
const Task = require("../models/task");

jest.mock("../models/task"); // Mock the Task model

describe("Task Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: "userId" },
      params: { taskId: "taskId" },
      body: { description: "Test Task", status: "Pending" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("getTasks", () => {
    it("should return tasks for the logged-in user", async () => {
      Task.find.mockResolvedValue([
        { description: "Test Task", user: "userId" },
      ]);

      await getTasks(req, res);

      expect(Task.find).toHaveBeenCalledWith({ user: req.user.id });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        tasks: [{ description: "Test Task", user: "userId" }],
        status: true,
        msg: "Tasks found successfully..",
      });
    });

    it("should handle errors and return 500", async () => {
      Task.find.mockRejectedValue(new Error("Error"));

      await getTasks(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        msg: "Internal Server Error",
      });
    });
  });

  describe("getTask", () => {
    it("should return a task by ID for the logged-in user", async () => {
      Task.findOne.mockResolvedValue({
        description: "Test Task",
        user: "userId",
      });

      await getTask(req, res);

      expect(Task.findOne).toHaveBeenCalledWith({
        user: req.user.id,
        _id: req.params.taskId,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        task: { description: "Test Task", user: "userId" },
        status: true,
        msg: "Task found successfully..",
      });
    });

    it("should return 404 if no task is found", async () => {
      Task.findOne.mockResolvedValue(null);

      await getTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        msg: "No task found..",
      });
    });

    it("should handle errors and return 500", async () => {
      Task.findOne.mockRejectedValue(new Error("Error"));

      await getTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        msg: "Internal Server Error",
      });
    });
  });

  describe("postTask", () => {
    it("should create a new task and return 201", async () => {
      Task.create.mockResolvedValue({
        description: "Test Task",
        user: "userId",
      });

      await postTask(req, res);

      expect(Task.create).toHaveBeenCalledWith({
        user: req.user.id,
        description: req.body.description,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        task: { description: "Test Task", user: "userId" },
        status: true,
        msg: "Task created successfully..",
      });
    });

    it("should return 400 if description is missing", async () => {
      req.body.description = null;

      await postTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        msg: "Description of task not found",
      });
    });

    it("should handle errors and return 500", async () => {
      Task.create.mockRejectedValue(new Error("Error"));

      await postTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        msg: "Internal Server Error",
      });
    });
  });

  describe("putTask", () => {
    it("should update a task and return 200", async () => {
      Task.findById.mockResolvedValue({
        description: "Test Task",
        user: "userId",
      });
      Task.findByIdAndUpdate.mockResolvedValue({
        description: "Updated Task",
        user: "userId",
        status: "Completed",
      });

      await putTask(req, res);

      expect(Task.findById).toHaveBeenCalledWith(req.params.taskId);
      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
        req.params.taskId,
        { description: req.body.description, status: req.body.status },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        task: {
          description: "Updated Task",
          user: "userId",
          status: "Completed",
        },
        status: true,
        msg: "Task updated successfully..",
      });
    });

    it("should return 404 if no task is found", async () => {
      Task.findById.mockResolvedValue(null);

      await putTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        msg: "Task with given id not found",
      });
    });

    it("should return 403 if trying to update another user's task", async () => {
      Task.findById.mockResolvedValue({
        description: "Test Task",
        user: "differentUserId",
      });

      await putTask(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        msg: "You can't update task of another user",
      });
    });

    it("should handle errors and return 500", async () => {
      Task.findById.mockRejectedValue(new Error("Error"));

      await putTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        msg: "Internal Server Error",
      });
    });
  });

  describe("deleteTask", () => {
    it("should delete a task and return 200", async () => {
      Task.findById.mockResolvedValue({
        description: "Test Task",
        user: "userId",
      });

      await deleteTask(req, res);

      expect(Task.findById).toHaveBeenCalledWith(req.params.taskId);
      expect(Task.findByIdAndDelete).toHaveBeenCalledWith(req.params.taskId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        msg: "Task deleted successfully..",
      });
    });

    it("should return 404 if no task is found", async () => {
      Task.findById.mockResolvedValue(null);

      await deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        msg: "Task with given id not found",
      });
    });

    it("should return 403 if trying to delete another user's task", async () => {
      Task.findById.mockResolvedValue({
        description: "Test Task",
        user: "differentUserId",
      });

      await deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        msg: "You can't delete task of another user",
      });
    });

    it("should handle errors and return 500", async () => {
      Task.findById.mockRejectedValue(new Error("Error"));

      await deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        msg: "Internal Server Error",
      });
    });
  });
});
