import AbsApiController from "../abstracts/abs-api-controller.js";
import UserService from "../services/user.service.js";
import { Response, Request, NextFunction } from "express";
import { User } from "../@types/user.js";

class UserController extends AbsApiController<User> {
    service: UserService = new UserService();

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await this.service.getAll();
            res.json(users);
        } catch (err) {
            next(err);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.id;
        try {
            const user = await this.service.getById(userId);
            if (user) {
                res.json(user);
            } else {
                throw new Error("User not found");
            }
        } catch (err) {
            next(err);
        }
    };

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const createdUser = await this.service.create(req.body);
            res.json(createdUser);
        } catch (err) {
            next(err);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const updatedUser = await this.service.update(req.params.id, req.body);

            if(updatedUser) {
                res.json(updatedUser);
            } else {
                throw new Error("Failed to update user");
            }
        } catch (error) {
            throw error;
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const deleted = await this.service.delete(req.params.id);

            if(deleted) {
                res.json({ message: "User deleted successfully" });
            } else {
                throw new Error("Failed to delete user");
            }
        } catch (error) {
            throw error;
        }
    };
}

export default UserController;