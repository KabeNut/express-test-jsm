import pool from "../src/config/db";
import { afterAll, beforeAll, describe, it } from "vitest";
import app from "../src/index";
import chai from "chai";
import chaiHttp from "chai-http";
import dotenv from "dotenv";

dotenv.config(); // Load the environment variables from .env file

chai.use(chaiHttp);

describe("TDepartment API Tests", () => {
    let testDepartmentIds: string[] = [];

    beforeAll(async () => {
        const res = await chai.request(app).post("/t_departments").send({
            department_name: "Test Department",
        }).set("Authorization", process.env.TEST_TOKEN || "");
        testDepartmentIds.push(res.body.department_id);
    });

    afterAll(async () => {
        for (const id of testDepartmentIds) {
            await pool.query("DELETE FROM t_department WHERE department_id = ?", [id]);
        }
        testDepartmentIds = [];
    });

    it("Should get all departments", async () => {
        const res = await chai.request(app).get("/t_departments").set("Authorization", process.env.TEST_TOKEN || "");

        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.be.an("array");
        chai.expect(res.body).to.have.lengthOf.at.least(1);
    });

    it("Should get a department by id", async () => {
        const res = await chai.request(app).get(`/t_departments/${testDepartmentIds[0]}`).set("Authorization", process.env.TEST_TOKEN || "");

        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.be.an("object");
        chai.expect(res.body.department_id).to.equal(testDepartmentIds[0]);
    });

    it("Should create a new department", async () => {
        const res = await chai.request(app).post("/t_departments").send({
            department_name: "Test New Department",
        }).set("Authorization", process.env.TEST_TOKEN || "");

        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.be.an("object");
        chai.expect(res.body.department_name).to.equal("Test New Department");
        testDepartmentIds.push(res.body.department_id);
    });

    it("Should update a department", async () => {
        const res = await chai.request(app).patch(`/t_departments/${testDepartmentIds[0]}`).send({
            department_name: "Test Department updated",
        }).set("Authorization", process.env.TEST_TOKEN || "");

        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.be.an("object");
        chai.expect(res.body.department_name).to.equal("Test Department updated");
    });

    it("Should delete a department", async () => {
        const res = await chai.request(app).delete(`/t_departments/${testDepartmentIds[0]}`).set("Authorization", process.env.TEST_TOKEN || "");

        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.be.an("object");
        chai.expect(res.body.message).to.equal("TDepartment deleted successfully");
    });
});
