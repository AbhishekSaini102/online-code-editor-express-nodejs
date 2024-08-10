import { Router } from "express";
import fs from "fs";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

router.post("/", (req, res) => {
  console.log(req.file); // Debugging line
  const file = req.file;

  if (!file || path.extname(file.originalname) !== ".cpp") {
    return res.status(400).json({ error: "Please upload a .cpp file" });
  }

  const tempFilePath = path.join(__dirname, "../../uploads", file.filename);
  const originalFileName = file.originalname;
  const originalFilePath = path.join(
    __dirname,
    "../../uploads",
    originalFileName
  );
  const execFileName = "user_code";

  console.log(`Temp File path: ${tempFilePath}`); // Debugging line
  console.log(`Original File path: ${originalFilePath}`); // Debugging line

  try {
    // Rename the temporary file to original filename
    fs.renameSync(tempFilePath, originalFilePath);

    // Compile C++ code
    execSync(`g++ "${originalFilePath}" -o "${execFileName}.exe"`);

    // Run compiled code
    const output = execSync(`"${execFileName}.exe"`).toString();

    // Clean up files
    fs.unlinkSync(originalFilePath); // Keep this line to delete the .cpp file
    fs.unlinkSync(`${execFileName}.exe`); // Keep this line to delete the executable

    res.json({ result: output });
  } catch (error) {
    console.error(error); // Log full error details for debugging
    res.status(500).json({ error: `Error: ${error.message}` });
  }
});

export default router;


