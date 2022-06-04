// Login test file
import setupTest  from "../../base/test.setup"

import { createAccount, getUserDataByFilter } from "./account.services"

import app from "../../../../app"
import request from "supertest"

const LOGIN_ENDPOINT = "/api/v1/login";
const TEST_ENDPOINT = "/api/v1/account"; 
const TEST_ENDPOINT_2 = "/api/v1/account";

// Setup database to test 
setupTest()

describe(`POST ${TEST_ENDPOINT}`, () => {

    it("return 200 if account exists", async () => {
        await createAccount(
            "firstname", 
            "lastname", 
            "username", 
            "password", 
            "email@email.com", 
            "STUDENT"
        )
        const { body } = await request(app)
            .post(LOGIN_ENDPOINT)
            .send({ username: "username", password: "password"})

        const res = await request(app)
            .get(TEST_ENDPOINT)
            .set("Authorization", `Bearer ${body.accessToken}`)
        
        expect(res.statusCode).toBe(200);
    })  
})


describe(`DELETE ${TEST_ENDPOINT}`, () => {

    
    it("return 200 if account exists", async () => {
        console.log(await getUserDataByFilter());
        await createAccount(
            "firstname", 
            "lastname", 
            "username", 
            "password", 
            "email@email.com", 
            "STUDENT"
        )
        const { body } = await request(app)
            .post(LOGIN_ENDPOINT)
            .send({ username: "username", password: "password"})
        const res = await request(app)
            .delete(TEST_ENDPOINT)
            .set("Authorization", `Bearer ${body.accessToken}`)
        
        expect(res.statusCode).toBe(200);
    })  
})

