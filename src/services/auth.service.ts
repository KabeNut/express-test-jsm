import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { ResultSetHeader } from "mysql2";
import { AuthResponse } from '../@types/auth.js';
import UserService from './user.service.js';

class AuthService {
    private userService: UserService = new UserService();

    async login(username: string, password: string): Promise<AuthResponse | null> {
        try {
            const user = await this.userService.getByUsername(username);

            if(!user){
                return { error: "User not found" };
            }

            const isPasswordMatch = await bcrypt.compare(password, user.password);

            if(!isPasswordMatch){
                return { error: "Invalid credentials" };
            }

            const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET || "xxx", { expiresIn: process.env.JWT_EXPIRY || "1h" });

            return {
                message: "Login success",
                token,
                data: user
            }
        } catch (error) {
            throw error;
        }
    }

    async register(data: any): Promise<AuthResponse | null> {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        try {
            if(await this.userService.getByUsername(data.username)){
                return { error: "User Already Exist" };
            }

            const result = await this.userService.create({
                username: data.username,
                password: hashedPassword,
                name: data.name,
                level_id: data.level_id,
                department_id: data.department_id
            });

            if(!result){
                return { error: "Failed to create user" };
            }

            const isPasswordMatch = await bcrypt.compare(data.password, result.password);

            if(!isPasswordMatch){
                return { error: "Invalid credentials" };
            }

            const token = jwt.sign({ user_id: result.user_id }, process.env.JWT_SECRET || "xxx", { expiresIn: process.env.JWT_EXPIRY || "1h" });

            return {
                message: "Register success",
                token,
                data: result
            }
            
        } catch (error) {
            throw error;
        }
    }
}

export default AuthService;