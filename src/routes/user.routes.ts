import express from "express";
import UserController from "../controllers/user.controller.js";
import AuthJWT from "../utils/auth_jwt.js";

const router = express.Router();
const userController = new UserController();
const authJWT = new AuthJWT();

router.get("/", authJWT.verifyJWT, userController.getAll);
router.get("/:id", authJWT.verifyJWT, userController.getById);
router.post("/", authJWT.verifyJWT, userController.create);
router.patch("/:id", authJWT.verifyJWT, userController.update);
router.delete("/:id", authJWT.verifyJWT, userController.delete);

export default router;