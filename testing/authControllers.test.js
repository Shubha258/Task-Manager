const { login } = require("../controllers/authControllers");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { createAccessToken } = require("../utils/token");

jest.mock("../models/user");
jest.mock("bcrypt");
jest.mock("../utils/token");

describe("login", () => {
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if email or password is missing", async () => {
    const req = { body: { email: "test@test.com" } }; // Missing password
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ status: false, msg: "Please enter all details!!" });
  });

  it("should return 400 if user is not found", async () => {
    User.findOne.mockResolvedValue(null);

    const req = { body: { email: "test@test.com", password: "password" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@test.com" });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ status: false, msg: "This email is not registered!!" });
  });

  it("should return 400 if the password is incorrect", async () => {
    const mockUser = { _id: "123", email: "test@test.com", password: "hashedPassword" };
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    const req = { body: { email: "test@test.com", password: "wrongPassword" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(req, res);

    expect(bcrypt.compare).toHaveBeenCalledWith("wrongPassword", "hashedPassword");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ status: false, msg: "Password incorrect!!" });
  });

  it("should return 200 and a token if login is successful", async () => {
    const mockUser = { _id: "123", email: "test@test.com", password: "hashedPassword" };
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    createAccessToken.mockReturnValue("mockToken");

    const req = { body: { email: "test@test.com", password: "password" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(req, res);

    expect(bcrypt.compare).toHaveBeenCalledWith("password", "hashedPassword");
    expect(createAccessToken).toHaveBeenCalledWith({ id: "123" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token: "mockToken",
      user: mockUser,
      status: true,
      msg: "Login successful..",
    });
  });

  it("should return 500 if there is an internal server error", async () => {
    User.findOne.mockRejectedValue(new Error("DB error"));

    const req = { body: { email: "test@test.com", password: "password" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ status: false, msg: "Internal Server Error" });
  });
});
