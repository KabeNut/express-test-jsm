import AbsApiController from "../abstracts/abs-api-controller.js";
import TDepartmentService from "../services/t_department.service.js";
import { TDepartment } from "../@types/t_departments.js";
import { Response, Request, NextFunction } from "express";

class TDepartmentController extends AbsApiController<TDepartment> {
    service: TDepartmentService = new TDepartmentService();

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const t_departments = await this.service.getAll();
            res.json(t_departments);
        } catch (err) {
            next(err);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        const t_departmentId = req.params.id;
        try {
            const t_department = await this.service.getById(t_departmentId);
            if (t_department) {
                res.json(t_department);
            } else {
                throw new Error("TDepartment not found");
            }
        } catch (err) {
            next(err);
        }
    };

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const createdTDepartment = await this.service.create(req.body);
            res.json(createdTDepartment);
        } catch (err) {
            next(err);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const updatedTDepartment = await this.service.update(req.params.id, req.body);

            if(updatedTDepartment) {
                res.json(updatedTDepartment);
            } else {
                throw new Error("Failed to update TDepartment");
            }
        } catch (error) {
            throw error;
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const deleted = await this.service.delete(req.params.id);

            if(deleted) {
                res.json({ message: "TDepartment deleted successfully" });
            } else {
                throw new Error("Failed to delete TDepartment");
            }
        } catch (error) {
            throw error;
        }
    };
}

export default TDepartmentController;