const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Get the MongoDB URL from environment variable

const mongoUrl =process.env.MONGO_URL
// const port=process.env.PORT
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Mongodb connected...");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Mount routes
app.use("/api", authRoutes);
app.use("/api", taskRoutes);
app.use("/api", userRoutes);

// Define the options for swaggerJsdoc
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Management API",
      version: "1.0.0",
      description: "API for managing tasks",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Local development server",
      },
    ],
    components: {
      schemas: {
        Task: {
          type: "object",
          required: ["description"],
          properties: {
            description: {
              type: "string",
              description: "The detailed description of the task",
            },
            status: {
              type: "string",
              description: "The current status of the task",
              enum: ["pending", "completed"],
            },
          },
        },
        User: {
          type: "object",
          required: ["email", "password", "name"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
            },
            password: {
              type: "string",
              description: "User's password",
            },
            name: {
              type: "string",
              description: "User's name",
            },
          },
        },
      },
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    // Specify the files containing your API routes
  },
  apis: ["./routes/*.js"],
};

// Generate the swagger documentation using the options
const specs = swaggerJsdoc(options);

// Serve the swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Backend is running on port ${port}`);
});
