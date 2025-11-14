import { Router } from "express";
import DB from "../db";
import { sessionValidator } from "../middleware/authMiddleware";

const auth = Router();

auth.post("/login", (req, res) => {
  for (const user of DB.getUsers()) {
    if (
      req.body.username === user.name &&
      req.body.password === user.password &&
      req.body.classname === user.class
    ) {
      req.session!.userId = user.id; // 1. 執行異步儲存
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err); // 如果儲存失敗，發送 500 錯誤
          return res.status(500).json({ message: "Session saving failed" });
        }
        console.log(`User ${user.id} logged in. Session saved.`); // 2. 儲存成功，發送 200 回應
        console.log("Current session:", req.session.userId);
        return res
          .status(200)
          .json({ message: "Login successful", userId: user.id });
      });
      return; // 立即退出整個 auth.post 處理函式
    }
  } // 只有在 for 迴圈跑完，且沒有找到使用者時，才會執行此行
  // print session for debugging
  console.log("Current session:", req.session.userId);

  return res
    .status(401)
    .json({ message: "Invalid username or password or classname" });
});

auth.post("/logout", sessionValidator, (req, res) => {
  req.session!.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("session");
    return res.status(200).json({ message: "Logout successful" });
  });
});

auth.post("/change-password", sessionValidator, (req, res) => {
  console.log("Session userId:", req.session.userId);
  let userInfo = DB.getUserById(req.session.userId);
  if (!userInfo) {
    return res.status(404).json({ message: "User not found." });
  }
  if (req.body.oldpassword !== userInfo.password) {
    return res.status(400).json({ message: "Old password is incorrect." });
  }
  if (DB.updateUserPassword(req.session.userId, req.body.newpassword)) {
    return res.status(200).json({ message: "Password changed successfully." });
  } else {
    return res.status(500).json({ message: "Failed to change password." });
  }
});

auth.get("/is-login", sessionValidator, (req, res) => {
  const userId = req.session!.userId;
  const users = DB.getUsers();
  if (!users.find((user) => user.id === userId)) {
    return res
      .status(401)
      .json({ message: "session has expired", valid: false });
  }
  return res.status(200).json({ message: "user is logged in", valid: true });
});

auth.get("/user-info", sessionValidator, (req, res) => {
  let userInfo = DB.getUserById(req.session.userId);
  if (userInfo) {
    return res
      .status(200)
      .json({ username: userInfo.name, studentID: userInfo.studentId });
  }
  return res.status(404).json({ message: "User not found." });
});

export default auth;
