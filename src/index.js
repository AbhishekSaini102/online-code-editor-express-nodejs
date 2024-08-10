// src/server.js
import app from "./app.js";
import { config } from "dotenv";

// Load environment variables from .env file if it exists
config();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
