import jwt from "jsonwebtoken";
import { AuthResponse } from '../@types/auth.js';
import { Response, Request, NextFunction } from "express";

class AuthJWT {
    private JWT_SECRET: string = process.env.JWT_SECRET || "xxx";

    verifyJWT = (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ error: "Token is required" });
        }

        jwt.verify(token, this.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: "Invalid token" });
            }

            req.headers.user_id = (decoded as any).user_id

            next();
        });

    }
}

export default AuthJWT;