import { TLevel } from "../@types/t_level.js";
import pool from "../config/db.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import AbsService from "../abstracts/abs-service.js";
import { v4 as uuidv4 } from "uuid";

class TLevelService extends AbsService<TLevel> {
    constructor() {
        super();
    }

    async getAll(): Promise<TLevel[]> {
        try {
            const [rows] = await pool.query<TLevel[] & RowDataPacket[][]>("SELECT * FROM t_level");

            return rows;
        } catch (error) {
            throw error;
        }
    }

    async getById(id: string): Promise<TLevel | null> {
        try {
            const [rows] = await pool.query<TLevel[] & RowDataPacket[][]>("SELECT * FROM t_level WHERE level_id = ?", [id]);

            return rows.length ? rows[0] : null;
        } catch (error) {
            throw error;
        }
    }

    async create(data: TLevel): Promise<TLevel | null> {
        const level_id = uuidv4();
        try {
            const [result] = await pool.query<ResultSetHeader>(
                `INSERT INTO t_level (level_id, level_name) VALUES (?, ?)`,
                [level_id, data.level_name]
            );

            if(result.affectedRows) {
                return await this.getById(level_id);
            }else {
                throw new Error("Failed to create level");
            }
        } catch (error) {
            throw error;
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const [result] = await pool.query<ResultSetHeader>("DELETE FROM t_level WHERE level_id = ?", [id]);

            return result.affectedRows ? true : false;
        } catch (error) {
            throw error;
        }
    }

    async update(id: string, data: Partial<TLevel>): Promise<TLevel | null> {
        try {
            const [result] = await pool.query<ResultSetHeader>("UPDATE t_level SET ? WHERE level_id = ?", [data, id]);

            if(result.affectedRows) {
                return await this.getById(id);
            }else {
                throw new Error("Failed to update level");
            }
        } catch (error) {
            throw error;
        }
    }
}

export default TLevelService;