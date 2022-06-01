// Login test file

import { jest } from '@jest/globals';
import "dotenv/config";
import { setupDB } from "../../utils/test.setup"
import app from "../../../../app"
import request from "supertest"

//
const TEST_ENDPOINT = "/api/v1/login";

setupDB()

describe(`POST ${TEST_ENDPOINT}`, () => {
    jest.setTimeout(10000)

    it("return 200 if", async () => {
        const res = await request(app)
            .post(TEST_ENDPOINT)
            .send({ username: "professore", password: "professore123"})

        expect(res.statusCode).toBe(200);
    });
})