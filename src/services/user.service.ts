import { User } from "../@types/user.js";
import pool from "../config/db.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import AbsService from "../abstracts/abs-service.js";
import { v4 as uuidv4 } from "uuid";

class UserService extends AbsService<User> {
    constructor() {
        super();
    }

    async getAll(): Promise<User[]> {
        try {
            const [rows] = await pool.query<User[] & RowDataPacket[][]>("SELECT * FROM user");

            return rows;
        } catch (error) {
            throw error;
        }
    }

    async getById(id: string): Promise<User | null> {
        try {
            const [rows] = await pool.query<User[] & RowDataPacket[][]>("SELECT * FROM user WHERE user_id = ?", [id]);

            return rows.length ? rows[0] : null;
        } catch (error) {
            throw error;
        }
    }

    async create(data: User): Promise<User | null> {
        const user_id = uuidv4();
        try {
            const [result] = await pool.query<ResultSetHeader>(
                `INSERT INTO user (user_id, username, password, name, level_id, department_id) VALUES (?,?, ?, ?, ?, ?)`,
                [user_id, data.username, data.password, data.name, data.level_id, data.department_id]
            );

            if(result.affectedRows) {
                return await this.getById(user_id);
            }else {
                throw new Error("Failed to create user");
            }
        } catch (error) {
            throw error;
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const [result] = await pool.query<ResultSetHeader>("DELETE FROM user WHERE user_id = ?", [id]);

            return result.affectedRows ? true : false;
        } catch (error) {
            throw error;
        }
    }

    async update(id: string, data: Partial<User>): Promise<User | null> {
        try {
            const [result] = await pool.query<ResultSetHeader>(
                `UPDATE user SET ? WHERE user_id = ?`,
                [data, id]
            );

            if(result.affectedRows) {
                return await this.getById(id);
            } else {
                throw new Error("Failed to update user");
            }
        } catch (error) {
            throw error;
        }
    }

    async getByUsername(username: string): Promise<User | null> {
        try {
            const [result] = await pool.query<User[] & RowDataPacket[][]>("SELECT * FROM user WHERE username = ?", [username]);

            return result.length ? result[0] : null;
        } catch (error) {
            throw error;
        }
    }
}

export default UserService;