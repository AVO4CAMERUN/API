// Main server script
import "dotenv/config"
import app from "./app.js"

// Start http-server
const port = process.env.SERVER_PORT || 3000;

app.listen(port, async () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}/api/v1/docs`);
});

// inserire commento principale