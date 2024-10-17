import chaiHttp from "chai-http";
import chai from "chai";
import pool from "../src/config/db";
import app from "../src/index";
import { afterAll, beforeAll, describe, it } from "vitest";
import { expect } from "chai";
import dotenv from "dotenv";

dotenv.config(); // Load the environment variables from .env file

chai.use(chaiHttp);

describe("TLevel API Tests", () => {
    let testLevelIds: string[] = [];

    beforeAll(async () => {
        const res = await chai.request(app).post("/t_levels").send({
            level_name: "Test Level",
        }).set("Authorization", process.env.TEST_TOKEN || "");
        testLevelIds.push(res.body.level_id);
    });

    afterAll(async () => {
        for (const id of testLevelIds) {
            await pool.query("DELETE FROM t_level WHERE level_id = ?", [id]);
        }
        testLevelIds = [];
    });

    it("Should get all levels", async () => {
        const res = await chai.request(app).get("/t_levels").set("Authorization", process.env.TEST_TOKEN || "");

        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.lengthOf.at.least(1);
    });

    it("Should get a level by id", async () => {
        console.log(testLevelIds[0]);
        const res = await chai.request(app).get(`/t_levels/${testLevelIds[0]}`).set("Authorization", process.env.TEST_TOKEN || "");

        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body.level_id).to.equal(testLevelIds[0]);
    });

    it("Should create a new level", async () => {
        const res = await chai.request(app).post("/t_levels").send({
            level_name: "Test New Level",
        }).set("Authorization", process.env.TEST_TOKEN || "");

        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body.level_name).to.equal("Test New Level");
        testLevelIds.push(res.body.level_id);
    });

    it("Should update a level", async () => {
        console.log(testLevelIds[0]);

        const res = await chai.request(app).patch(`/t_levels/${testLevelIds[0]}`).send({
            level_name: "Test Level updated"
        }).set("Authorization", process.env.TEST_TOKEN || "");

        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body.level_name).to.equal("Test Level updated");
    });

    it("Should delete a level", async () => {
        const res = await chai.request(app).delete(`/t_levels/${testLevelIds[0]}`).send({
            level_name: "Test Level"
        }).set("Authorization", process.env.TEST_TOKEN || "");

        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body.message).to.equal("TLevel deleted successfully");
    });
    

});