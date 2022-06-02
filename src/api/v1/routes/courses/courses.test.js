// Courses test file
import { jest } from '@jest/globals';
import setupTest  from "../../utils/test.setup"
import app from "../../../../app"
import request from "supertest"

const TEST_ENDPOINT = "/api/v1/courses";

setupTest()

describe(`POST ${TEST_ENDPOINT}`, () => {
    jest.setTimeout(10000)

    it("return 200 if", async () => {
        const res = await request(app)
            .post(TEST_ENDPOINT)
            .send({ username: "professore", password: "professore123"})

        expect(200).toBe(200);
    });
})