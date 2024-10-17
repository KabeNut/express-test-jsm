import AuthService from "../services/auth.service.js";
import { AuthResponse } from "../@types/auth.js";
import { Request, Response, NextFunction } from "express";

class AuthController {
    service: AuthService = new AuthService();

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await this.service.login(req.body.username, req.body.password);

            if(response && response.token){
                res.json(response);
            } else {
                res.status(401).json(response);
            }
        } catch (error) {
            next(error);
        }
    }

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await this.service.register(req.body);

            if(response && response.token){
                res.json(response);
            } else {
                res.status(401).json(response);
            }
        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;