const { getProfile, signup } = require("../controllers/userControllers");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

jest.mock("../models/user");
jest.mock("bcrypt");
jest.mock("express-validator");

describe("User Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getProfile", () => {
    it("should return 400 if there are validation errors", async () => {
      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest
          .fn()
          .mockReturnValue([{ msg: "Invalid request parameters" }]),
      });

      const req = { user: { id: "123" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ msg: "Invalid request parameters" }],
      });
    });

    it("should return 404 if user is not found", async () => {
      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(true),
      });

      User.findById.mockResolvedValue(null);

      const req = { user: { id: "123" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        msg: "User not found",
      });
    });

    it("should return 200 and the user profile if user is found", async () => {
      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(true),
      });

      const mockUser = {
        _id: "123",
        name: "John Doe",
        email: "john@example.com",
      };
      User.findById.mockResolvedValue(mockUser);

      const req = { user: { id: "123" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getProfile(req, res);

      expect(User.findById).toHaveBeenCalledWith("123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        user: mockUser,
        status: true,
        msg: "Profile found successfully..",
      });
    });

    it("should return 500 if there is an internal server error", async () => {
      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(true),
      });

      User.findById.mockRejectedValue(new Error("DB error"));

      const req = { user: { id: "123" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        msg: "Internal Server Error",
      });
    });
  });

  describe("signup", () => {
    it("should return 400 if any field is missing", async () => {
      const req = { body: { name: "John Doe" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Please fill all the fields",
      });
    });

    it("should return 400 if non-string values are provided", async () => {
      const req = {
        body: { name: 123, email: "test@test.com", password: "pass" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Please send string values only",
      });
    });

    it("should return 400 if password is less than 4 characters", async () => {
      const req = {
        body: { name: "John Doe", email: "test@test.com", password: "abc" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Password length must be atleast 4 characters",
      });
    });

    it("should return 400 if email is invalid", async () => {
      const req = {
        body: { name: "John Doe", email: "invalidemail", password: "password" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: "Invalid Email" });
    });

    it("should return 400 if email is already registered", async () => {
      User.findOne = jest.fn().mockResolvedValue({ email: "test@test.com" });
      const req = {
        body: {
          name: "John Doe",
          email: "test@test.com",
          password: "password",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: "This email is already registered",
      });
    });

    it("should create a new user if all validations pass", async () => {
      User.findOne.mockResolvedValue(null);
      User.create = jest.fn().mockResolvedValue({ _id: "newUserId" }); // Mock a successful creation
      bcrypt.hash.mockResolvedValue("hashedPassword");
      const req = {
        body: {
          name: "John Doe",
          email: "test@test.com",
          password: "password",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await signup(req, res);

      expect(User.create).toHaveBeenCalledWith({
        name: "John Doe",
        email: "test@test.com",
        password: "hashedPassword",
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Congratulations!! Account has been created for you..",
      });
    });

    it("should return 500 if there is an internal server error", async () => {
      User.findOne.mockRejectedValue(new Error("DB error"));
      const req = {
        body: {
          name: "John Doe",
          email: "test@test.com",
          password: "password",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ msg: "Internal Server Error" });
    });
  });
});
