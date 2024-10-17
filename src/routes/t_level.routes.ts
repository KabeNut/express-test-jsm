import express from "express";
import TLevelController from "../controllers/t_level.controller.js";


const router = express.Router();
const controller = new TLevelController();


router.get("/",  controller.getAll);
router.get("/:id",  controller.getById);
router.post("/",  controller.create);
router.patch("/:id",  controller.update);
router.delete("/:id",  controller.delete);

export default router;