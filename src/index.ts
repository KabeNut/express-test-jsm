import express from "express";
import bodyParser from "body-parser";
import { todoRoutes, authRoutes, userRoutes, tLevelRoutes, tDepartmentRoutes } from "./routes/index.js";
import { jsonErrorsHandler } from "./utils/errorsHandler.js";

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/todos", todoRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/t_levels", tLevelRoutes);
app.use("/t_departments", tDepartmentRoutes);

// Middlewares
app.use(jsonErrorsHandler)

export default app;
