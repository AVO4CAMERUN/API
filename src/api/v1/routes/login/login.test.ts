// Login test file
import app from "../../../../app"
import * as request from "supertest"
import { prismaMock } from '../../base/test/singleton'
import { createAccount } from "../account/account.services"
import { USERROLE } from ".prisma/client"
const TEST_ENDPOINT = "/api/v1/login";

// Setup database to test 
// setupTest()


describe(`POST ${TEST_ENDPOINT}`, () => {

    it("return 403 if username and password aren't correct", async () => {
        const res = await request(app)
            .post(TEST_ENDPOINT)
            .send({ username: "", password: "" })

        expect(res.statusCode).toBe(403);
    })

    it("return 200 if username and password are correct", async () => {
       
        const user = {
            firstname: "firstname",
            lastname: "lastname",
            username: "username",
            password: "password",
            email: "email@email.com",
            role: USERROLE.STUDENT,
            registration_date: null, 
            img_profile : null,
            id_class: null
        }
        // prismaMock.user.create.mockResolvedValue(user)

        const r = await createAccount(user)

        const res = await request(app)
            .post(TEST_ENDPOINT)
            .send({ username: "username", password: "password" })

        const { body } = res
        expect("accessToken" in body).toBeTruthy();
        expect("refreshToken" in body).toBeTruthy();
        expect(res.statusCode).toBe(200);
    })
})

describe(`PUT ${TEST_ENDPOINT}`, () => {

    it("return 401 if refreshToken isn't present", async () => {
        const res = await request(app)
            .put(TEST_ENDPOINT)
            .send({ token: "" })

        expect(res.statusCode).toBe(401);
    })

    it("return 403 if refreshToken isn't correct", async () => {
        const res = await request(app)
            .put(TEST_ENDPOINT)
            .send({ token: "example" })

        expect(res.statusCode).toBe(403);
    })

    it("return 200 if refreshToken is correct", async () => {
        await createAccount({
            firstname: "firstname",
            lastname: "lastname",
            username: "username",
            password: "password",
            email: "email@email.com",
            role: "STUDENT"
        })
        const { body } = await request(app)
            .post(TEST_ENDPOINT)
            .send({ username: "username", password: "password" })

        const res = await request(app)
            .put(TEST_ENDPOINT)
            .send({ token: body.refreshToken })

        expect(res.statusCode).toBe(200);
    })
})

describe(`DELETE ${TEST_ENDPOINT}`, () => {

    it("return 403 if refreshToken is fake", async () => {
        const res = await request(app)
            .delete(TEST_ENDPOINT)
            .send({ token: "fakeRefreshToken" })

        expect(res.statusCode).toBe(403);
    })

    it("return 200 if refreshToken is correct", async () => {
        await createAccount({
            firstname: "firstname",
            lastname: "lastname",
            username: "username",
            password: "password",
            email: "email@email.com",
            role: "STUDENT"
        })
        const { body } = await request(app)
            .post(TEST_ENDPOINT)
            .send({ username: "username", password: "password" })

        const { refreshToken } = body

        const res = await request(app)
            .delete(TEST_ENDPOINT)
            .send({ token: refreshToken })


        expect(res.statusCode).toBe(200);
    })
})
