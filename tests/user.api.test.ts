import chai from "chai";
import chaiHttp from "chai-http";
import { afterAll, beforeAll, describe, it } from "vitest";
import app from "../src/index";
import pool from "../src/config/db";
import dotenv from "dotenv";

dotenv.config(); // Load the environment variables from .env file

chai.use(chaiHttp);

describe("User Api Tests", () => {
    let testUserIds: string[] = [];
    let testTLevelIds: string[] = [];
    let testTDepartmentIds: string[] = [];

    beforeAll(async() => {
        const levelRes = await chai.request(app).post("/t_levels").send(
            {
                level_name: "Test Level"
            }
        ).set("Authorization", process.env.TEST_TOKEN || "");

        
        const departmentRes = await chai.request(app).post("/departments").send({
            department_name: "Test Department"
        }).set("Authorization", process.env.TEST_TOKEN || "");
        
        const user = await chai.request(app).post("/users").send({
            username: "testuser",
            password: "testpassword",
            name: "Test User",
            level_id: levelRes.body.level_id,
            department_id: departmentRes.body.department_id
        }).set("Authorization", process.env.TEST_TOKEN || "");
        
        testTLevelIds.push(levelRes.body.level_id);
        testTDepartmentIds.push(departmentRes.body.department_id);
        testUserIds.push(user.body.user_id);
    })

    afterAll(async() => {
        for(const id of testUserIds) {
            await pool.query("DELETE FROM user WHERE user_id = ?", [id]);
        }

        for(const id of testTDepartmentIds) {
            await pool.query("DELETE FROM t_department WHERE department_id = ?", [id]);
        }

        for(const id of testTLevelIds) {
            await pool.query("DELETE FROM t_level WHERE level_id = ?", [id]);
        }
    });

    it("Should get all users", async() => {
        const res = await chai.request(app).get("/users").set("Authorization", process.env.TEST_TOKEN || "");

        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.be.an("array");
        chai.expect(res.body).to.have.lengthOf.at.least(1);
    });

    it("Should get a user by id", async() => {
        const res = await chai.request(app).get(`/users/${testUserIds[0]}`).set("Authorization", process.env.TEST_TOKEN || "");

        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.be.an("object");
        chai.expect(res.body.user_id).to.equal(testUserIds[0]);
    });

    it("Should create a new user", async() => {
        const levelRes = await chai.request(app).post("/t_levels").send(
            {
                level_name: "Test Level"
            }
        ).set("Authorization", process.env.TEST_TOKEN || "");

        const departmentRes = await chai.request(app).post("/departments").send({
            department_name: "Test Department"
        }).set("Authorization", process.env.TEST_TOKEN || "");

        const res = await chai.request(app).post("/users").send({
            username: "newuser",
            password: "newpassword",
            name: "New User",
            level_id: levelRes.body.level_id,
            department_id: departmentRes.body.department_id
        }).set("Authorization", process.env.TEST_TOKEN || "");

        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.be.an("object");
        chai.expect(res.body).to.have.property("user_id");

        
        testTLevelIds.push(levelRes.body.level_id);
        testTDepartmentIds.push(departmentRes.body.department_id);
        testUserIds.push(res.body.user_id);
    });

    it("Should update a user", async() => {
        const res = await chai.request(app).patch(`/users/${testUserIds[0]}`).send({
            name: "Updated User"
        }).set("Authorization", process.env.TEST_TOKEN || "");

        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.be.an("object");
        chai.expect(res.body.user_id).to.equal(testUserIds[0]);
        chai.expect(res.body.name).to.equal("Updated User");
    });

    it("Should delete a user", async() => {
        const res = await chai.request(app).delete(`/users/${testUserIds[0]}`).set("Authorization", process.env.TEST_TOKEN || "");

        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.be.an("object");
        chai.expect(res.body.message).to.equal("User deleted successfully");
    });
});