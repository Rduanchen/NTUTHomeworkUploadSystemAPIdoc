import { Request, Response, NextFunction } from "express";
import DB from "../db";

// 登入驗證 middleware
export function sessionValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.session || !req.session.userId) {
    const users = DB.getUsers();
    users.filter((user) => user.id === req.session!.userId);
    if (users.length === 0) {
      return res.status(401).json({ message: "Please log in first." });
    }
  }
  next();
}

export function puzzleAccessValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.session!.userId;
  const puzzleId = parseInt(
    (req.params.puzzleId as string) || (req.query.puzzleId as string)
  );

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
