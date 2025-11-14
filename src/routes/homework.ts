import { Router } from "express";
import DB from "../db";
import { sessionValidator } from "../middleware/authMiddleware";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = process.env.USER_UPLOAD_FILE_PATH || "./src/db/uploadFile";

// 確保上傳目錄存在
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const userId = req.session!.userId;
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `user_${userId}_${uniqueSuffix}${ext}`);
  },
});

const homeworkRouter = Router();

homeworkRouter.get("/list", sessionValidator, (req, res) => {
  const userId = req.session!.userId;
  const user = DB.getUserById(userId);
  const homeworkList = DB.getUserHomeworkList(userId);
  res.json({
    homeworkList: homeworkList,
  });
});

homeworkRouter.get("/upload", sessionValidator, (req, res) => {
  const userId = req.session!.userId;
  const puzzleId = parseInt(req.query.puzzleId as string);

  const user = DB.getUserById(userId);
  const homeworkList = DB.getUserHomeworkList(userId);
  const puzzle = homeworkList.find((p) => p.id === puzzleId);

  if (!puzzle) {
    return res.status(404).json({ message: "Puzzle not found for this user." });
  }
  const fileName = `user_${userId}_${puzzleId}_${Date.now()}`;
});

homeworkRouter.get("/passed-students-list", sessionValidator, (req, res) => {
  const userId = req.session!.userId;
  const user = DB.getUserById(userId);

  const passedStudentsID = [1, 2, 3, 4];

  res.json({
    studentID: passedStudentsID,
  });
});

homeworkRouter.get("/check-test-result", sessionValidator, (req, res) => {
  const userId = req.session!.userId;
  const user = DB.getUserById(userId);
  const puzzleId = parseInt(req.query.puzzleId as string);

  const homeworkList = DB.getCheckTestResults(puzzleId, userId);

  res.json({
    testResults: homeworkList,
  });
});

homeworkRouter.get("/delete", sessionValidator, (req, res) => {
  const userId = req.session!.userId;
  const user = DB.getUserById(userId);
  const puzzleId = parseInt(req.query.puzzleId as string);

  const deleteResult = DB.getSubmitHomeworkRecords(puzzleId, userId);

  res.json({
    deleteResult: deleteResult,
  });
});

homeworkRouter.get("/puzzle-info", (req, res) => {
  const userId = req.session!.userId;
  const user = DB.getUserById(userId);
  // const puzzleId = req.body.puzzleId;
  const mockPuzzleInfo = {
    title: "Sum two numbers",
    puzzleId: "001",
    description:
      " # Sum two numbers\n\nWrite a function that takes two numbers as input and returns their sum.\n\n## Input\n\n- Two integers `a` and `b`.\n\n## Output\n\n- An integer representing the sum of `a` and `b`.\n\n## Example\n\n```\nInput: a = 3, b = 5\nOutput: 8\n```\n\n## Constraints\n\n- -1000 <= a, b <= 1000",
    testCases: [
      { input: "3 5", output: "8" },
      { input: "-2 10", output: "8" },
      { input: "0 0", output: "0" },
    ],
  };
  res.json({ puzzleInfo: mockPuzzleInfo });
});

// TODO: get test cases

export default homeworkRouter;
