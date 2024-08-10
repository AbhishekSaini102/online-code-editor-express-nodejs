import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

// Define storage configuration for multer
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({ dest: path.join(__dirname, "../uploads/") });


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/hello", (req, res) => {
  res.send("Hello, Abhishek!");
});

// Import routes
import cppRoutes from "./routes/cpp.routes.js";
import rustRoutes from "./routes/rust.routes.js";
import javaRoutes from "./routes/java.routes.js";
import pythonRoutes from "./routes/python.routes.js";

// Use routes
// app.use("/execute/cpp", cppRoutes);
app.use("/execute/cpp", upload.single("file"), cppRoutes);
app.use("/execute/rust", upload.single("file"), rustRoutes);
app.use("/execute/java", upload.single("file"), javaRoutes);
app.use("/execute/python", upload.single("file"), pythonRoutes);


export default app;
