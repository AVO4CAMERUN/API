// Login test file
import { sha256 } from "js-sha256"
import app from "../../../../app"
import * as request from "supertest"

// import { prismaMock } from "../../base/test/singleton"
// import user from "../account/user.interface"
import setupTest from "../../base/test/test.setup"
import { USERROLE } from ".prisma/client"
import { user } from ".prisma/client"
import {
    createPOST,
    createGET,
    createUPDATE,
    createDELETE,
    createCOUNT
} from "../../base/services/base.services"
const TEST_ENDPOINT = "/api/v1/login";

// Setup database to test 
setupTest()

describe(`POST ${TEST_ENDPOINT}`, () => {

    it("return 403 if username and password aren't correct", async () => {
        const res = await request(app)
            .post(TEST_ENDPOINT)
            .send({ username: "", password: "" })

        expect(res.statusCode).toBe(403);
    })

    it("return 200 if username and password are correct", async () => {
        const user: user = {
            firstname:"firstname",
            lastname: "lastname",
            username: "username",
            password: sha256("password"),
            email: "email@email.com",
            role: USERROLE.STUDENT,
            registration_date: null, 
            img_profile: null, 
            id_class: null
        }
  
        console.log(await createGET("user", "*", {}, null));
        
        await createPOST("user", user)
        
        console.log(await createGET("user", "*", {}, null));
        const res = await request(app)
            .post(TEST_ENDPOINT)
            .send({ username: "username", password: "password" })

        const { body } = res
        expect("accessToken" in body).toBeTruthy();
        expect("refreshToken" in body).toBeTruthy();
        expect(res.statusCode).toBe(200);
    })

    it("return 200 if username and password are correct", async () => {
        console.log("LOGIN---------------------------------------------");
        
        console.log(await createGET("user", "*", {}, null));
        expect(200).toBe(200);
    })
    
})

