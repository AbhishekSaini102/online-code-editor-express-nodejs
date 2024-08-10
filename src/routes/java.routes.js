  // import { Router } from "express";
  // import fs from "fs";
  // import { execSync } from "child_process";
  // import path from "path";
  // import { fileURLToPath } from "url";

  // const __filename = fileURLToPath(import.meta.url);
  // const __dirname = path.dirname(__filename);

  // const router = Router();

  // router.post("/", (req, res) => {
  // console.log(req.file); // Debugging line
  // const file = req.file;

  // if (!file || path.extname(file.originalname) !== ".java") {
  //     return res.status(400).json({ error: "Please upload a .java file" });
  // }

  // const tempFilePath = path.join(__dirname, "../../uploads", file.filename);
  // const originalFileName = file.originalname;
  // const originalFilePath = path.join(
  //     __dirname,
  //     "../../uploads",
  //     originalFileName
  // );
  // const execFileName = path.basename(originalFileName, ".java");

  // console.log(`Temp File path: ${tempFilePath}`); // Debugging line
  // console.log(`Original File path: ${originalFilePath}`); // Debugging line

  // try {
  //     // Rename the temporary file to original filename
  //     fs.renameSync(tempFilePath, originalFilePath);

  //     // Compile Java code
  //     execSync(`javac "${originalFilePath}"`);

  //     // Run compiled code
  //     const output = execSync(
  //     `java -cp "${__dirname}/../../uploads" ${execFileName}`
  //     ).toString();

  //     // Clean up files
  //     fs.unlinkSync(originalFilePath); // Keep this line to delete the .java file
  //     fs.unlinkSync(
  //     path.join(__dirname, "../../uploads", `${execFileName}.class`)
  //     ); // Delete the .class file

  //     res.json({ result: output });
  // } catch (error) {
  //     console.error(error); // Log full error details for debugging
  //     res.status(500).json({ error: `Error: ${error.message}` });
  // }
  // });

  // export default router;

  // import { Router } from "express";
  // import fs from "fs";
  // import { execSync } from "child_process";
  // import path from "path";
  // import { fileURLToPath } from "url";

  // const __filename = fileURLToPath(import.meta.url);
  // const __dirname = path.dirname(__filename);

  // const router = Router();

  // router.post("/", (req, res) => {
  //   const file = req.file;

  //   if (!file || path.extname(file.originalname) !== ".java") {
  //     return res.status(400).json({ error: "Please upload a .java file" });
  //   }

  //   const tempFilePath = path.join(__dirname, "../../uploads", file.filename);
  //   const originalFileName = file.originalname;
  //   const originalFilePath = path.join(
  //     __dirname,
  //     "../../uploads",
  //     originalFileName
  //   );

  //   console.log(`Temp File path: ${tempFilePath}`);
  //   console.log(`Original File path: ${originalFilePath}`);

  //   try {
  //     // Rename the temporary file to the original filename
  //     fs.renameSync(tempFilePath, originalFilePath);

  //     // Extract class name from file
  //     const fileContent = fs.readFileSync(originalFilePath, "utf8");
  //     const classNameMatch = fileContent.match(/public\s+class\s+(\w+)/);
  //     if (!classNameMatch) {
  //       throw new Error("No public class found in the file");
  //     }
  //     const className = classNameMatch[1];
  //     const execFileName = className;

  //     // Ensure the file name matches the class name
  //     const renamedFilePath = path.join(
  //       __dirname,
  //       "../../uploads",
  //       `${execFileName}.java`
  //     );
  //     if (originalFileName !== `${execFileName}.java`) {
  //       fs.renameSync(originalFilePath, renamedFilePath);
  //     }

  //     // Compile Java code
  //     try {
  //       execSync(`javac "${renamedFilePath}"`, { stdio: "pipe" });
  //     } catch (compilationError) {
  //       const errorMessage = compilationError.stderr
  //         ? compilationError.stderr.toString()
  //         : compilationError.message;
  //       throw new Error(`Compilation Error: ${errorMessage}`);
  //     }

  //     // Run compiled code
  //     try {
  //       const output = execSync(
  //         `java -cp "${path.dirname(renamedFilePath)}" ${execFileName}`,
  //         { stdio: "pipe" }
  //       ).toString();
  //       res.json({ result: output });
  //     } catch (executionError) {
  //       const errorMessage = executionError.stderr
  //         ? executionError.stderr.toString()
  //         : executionError.message;
  //       throw new Error(`Execution Error: ${errorMessage}`);
  //     }

  //     // Clean up files
  //     fs.unlinkSync(renamedFilePath); // Delete the .java file
  //     fs.unlinkSync(
  //       path.join(path.dirname(renamedFilePath), `${execFileName}.class`)
  //     ); // Delete the .class file
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: `Error: ${error.message}` });
  //   }
  // });

  // export default router;




  import { Router } from "express";
  import fs from "fs";
  import { execSync } from "child_process";
  import path from "path";
  import { fileURLToPath } from "url";

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const router = Router();

  router.post("/", (req, res) => {
    const file = req.file;

    if (!file || path.extname(file.originalname) !== ".java") {
      return res.status(400).json({ error: "Please upload a .java file" });
    }

    const tempFilePath = path.join(__dirname, "../../uploads", file.filename);
    const originalFileName = file.originalname;
    const originalFilePath = path.join(
      __dirname,
      "../../uploads",
      originalFileName
    );

    console.log(`Temp File path: ${tempFilePath}`);
    console.log(`Original File path: ${originalFilePath}`);

    try {
      // Rename the temporary file to the original filename
      fs.renameSync(tempFilePath, originalFilePath);

      // Extract class name from file
      const fileContent = fs.readFileSync(originalFilePath, "utf8");
      const classNameMatch = fileContent.match(/public\s+class\s+(\w+)/);
      if (!classNameMatch) {
        throw new Error("No public class found in the file");
      }
      const className = classNameMatch[1];
      const execFileName = className;

      // Ensure the file name matches the class name
      const renamedFilePath = path.join(
        __dirname,
        "../../uploads",
        `${execFileName}.java`
      );
      if (originalFileName !== `${execFileName}.java`) {
        fs.renameSync(originalFilePath, renamedFilePath);
        console.log(`Renamed file to: ${renamedFilePath}`);
      }

      // Compile Java code
      try {
        execSync(`javac "${renamedFilePath}"`, { stdio: "inherit" });
      } catch (compilationError) {
        console.error(
          `Compilation Error Output: ${compilationError.stderr.toString()}`
        );
        const errorMessage = compilationError.stderr
          ? compilationError.stderr.toString()
          : compilationError.message;
        throw new Error(`Compilation Error: ${errorMessage}`);
      }

      // Run compiled code
      try {
        const output = execSync(
          `java -cp "${path.dirname(renamedFilePath)}" ${execFileName}`,
          { stdio: "pipe" }
        ).toString();
        res.json({ result: output });
      } catch (executionError) {
        console.error(
          `Execution Error Output: ${executionError.stderr.toString()}`
        );
        const errorMessage = executionError.stderr
          ? executionError.stderr.toString()
          : executionError.message;
        throw new Error(`Execution Error: ${errorMessage}`);
      }

      // Clean up files
      try {
        fs.unlinkSync(renamedFilePath); // Delete the .java file
        console.log(`Deleted file: ${renamedFilePath}`);
        fs.unlinkSync(
          path.join(path.dirname(renamedFilePath), `${execFileName}.class`)
        ); // Delete the .class file
        console.log(
          `Deleted file: ${path.join(
            path.dirname(renamedFilePath),
            `${execFileName}.class`
          )}`
        );
      } catch (cleanupError) {
        console.error(`Cleanup Error: ${cleanupError.message}`);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: `Error: ${error.message}` });
    }
  });

  export default router;
