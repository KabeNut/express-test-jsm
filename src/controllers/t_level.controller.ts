import AbsApiController from "../abstracts/abs-api-controller.js";
import TLevelService from "../services/t_level.service.js";
import { Response, Request, NextFunction } from "express";
import { TLevel } from "../@types/t_level.js";

class TLevelController extends AbsApiController<TLevel> {
    service: TLevelService = new TLevelService();

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const t_levels = await this.service.getAll();
            res.json(t_levels);
        } catch (err) {
            next(err);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        const t_levelId = req.params.id;
        try {
            const t_level = await this.service.getById(t_levelId);
            if (t_level) {
                res.json(t_level);
            } else {
                throw new Error("TLevel not found");
            }
        } catch (err) {
            next(err);
        }
    };

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const createdTLevel = await this.service.create(req.body);
            res.json(createdTLevel);
        } catch (err) {
            next(err);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const updatedTLevel = await this.service.update(req.params.id, req.body);

            if(updatedTLevel) {
                res.json(updatedTLevel);
            } else {
                throw new Error("Failed to update TLevel");
            }
        } catch (error) {
            throw error;
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const deleted = await this.service.delete(req.params.id);

            if(deleted) {
                res.json({ message: "TLevel deleted successfully" });
            } else {
                throw new Error("Failed to delete TLevel");
            }
        } catch (error) {
            throw error;
        }
    }
}

export default TLevelController;