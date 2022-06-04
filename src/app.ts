import * as cors from "cors"
import * as express from "express"
import * as swaggerUI from "swagger-ui-express"
import v1 from "./api/v1/index"
import swaggerDocs from "./api/v1/swagger/v1.swagger.docs"

// Create requets rooter
const app = express()
  .use(cors())
  .use('/api/v1', v1)
  .use('/api/v1/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

export default app