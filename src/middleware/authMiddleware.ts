import { Request, Response, NextFunction } from "express";
import DB from "../db";

// 登入驗證 middleware
export function sessionValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Please log in first." });
  }
  if (!DB.getUserById(req.session.userId)) {
    return res.status(401).json({ message: "Please log in first." });
  }

  // ✅ 驗證成功，繼續執行下一個 middleware 或路由
  next();
}

export function puzzleAccessValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.session!.userId;
  const puzzleId = parseInt(req.params.puzzleId || req.query.puzzleId);

  const homeworkList = DB.getUserHomeworkList(userId);
  const puzzle = homeworkList.find((p) => p.id === puzzleId);

  if (!puzzle) {
    return res
      .status(403)
      .json({ message: "You do not have access to this puzzle." });
  }

  // ✅ 驗證成功，繼續執行下一個 middleware 或路由
  next();
}
