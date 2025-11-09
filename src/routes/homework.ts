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
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `user_${userId}_${uniqueSuffix}${ext}`);
    }
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

    const passedStudentsID = [1, 2, 3, 4]

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


// TODO: get test cases




export default homeworkRouter;
