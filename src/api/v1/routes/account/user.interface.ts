// User interface
import { USERROLE } from ".prisma/client"

export default interface user {
    firstname: string,
    lastname: string,
    username: string,
    password: string,
    email: string,
    role: USERROLE,
}