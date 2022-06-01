import cors from "cors"
import express from "express"
import v1 from "./api/v1/v1.js"
import swaggerUI from "swagger-ui-express"
import swaggerDocs from "./api/v1/swagger/swagger.docs.v1.js"

// Create requets rooter
const app = express()
  .use(cors())
  .use('/api/v1', v1)
  .use('/api/v1/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

export default app