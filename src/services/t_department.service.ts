import { TDepartment } from "../@types/t_departments.js";
import AbsService from "../abstracts/abs-service.js";
import pool from "../config/db.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { v4 as uuidv4 } from "uuid";

class TDepartmentService extends AbsService<TDepartment>{
    constructor() {
        super();
    }

    async getAll(): Promise<TDepartment[]> {
        try {
            const [rows] = await pool.query<TDepartment[] & RowDataPacket[][]>("SELECT * FROM t_department");

            return rows;
        } catch (error) {
            throw error;
        }
    }

    async getById(id: string): Promise<TDepartment | null> {
        try {
            const [rows] = await pool.query<TDepartment[] & RowDataPacket[][]>("SELECT * FROM t_department WHERE department_id = ?", [id]);

            return rows.length ? rows[0] : null;
        } catch (error) {
            throw error;
        }
    }

    async create(data: TDepartment): Promise<TDepartment | null> {
        const department_id = uuidv4();
        try {
            const [result] = await pool.query<ResultSetHeader>(
                `INSERT INTO t_department (department_id, department_name) VALUES (?, ?)`,
                [department_id, data.department_name]
            );

            if (result.affectedRows) {
                return await this.getById(department_id);
            } else {
                throw new Error("Failed to create department");
            }
        } catch (error) {
            throw error;
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const [result] = await pool.query<ResultSetHeader>("DELETE FROM t_department WHERE department_id = ?", [id]);

            return result.affectedRows ? true : false;
        } catch (error) {
            throw error;
        }
    }

    async update(id: string, data: Partial<TDepartment>): Promise<TDepartment | null> {
        try {
            const [result] = await pool.query<ResultSetHeader>(
                `UPDATE t_department SET ? WHERE department_id = ?`,
                [data, id]
            );

            if (result.affectedRows) {
                return await this.getById(id);
            } else {
                throw new Error("Failed to update department");
            }
        } catch (error) {
            throw error;
        }
    }
}

export default TDepartmentService;