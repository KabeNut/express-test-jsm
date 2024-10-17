import { User } from "./user.js";

export interface AuthResponse {
    message?: string;
    error?: string;
    token?: string;
    data?: User;
    errors?: [];
}