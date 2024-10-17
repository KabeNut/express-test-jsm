import express from "express";
import bodyParser from "body-parser";
import { todoRoutes, authRoutes, userRoutes } from "./routes/index.js";
import { jsonErrorsHandler } from "./utils/errorsHandler.js";

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/todos", todoRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

// Middlewares
app.use(jsonErrorsHandler)

export default app;
