import express from "express";
import TDepartmentController from "../controllers/t_department.controller.js";


const router = express.Router();
const controller = new TDepartmentController();


router.get("/",  controller.getAll);
router.get("/:id",  controller.getById);
router.post("/",  controller.create);
router.patch("/:id",  controller.update);
router.delete("/:id",  controller.delete);

export default router;