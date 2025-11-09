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
      req.session!.userId = user.id;
      return res
        .status(200)
        .json({ message: "Login successful", userId: user.id });
    }
  }
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

auth.get("/change-password", sessionValidator, (req, res) => {
  let userInfo = DB.getUserById(req.session.userId);
  if (!userInfo) {
    return res.status(404).json({ message: "User not found." });
  }
  if (req.body.oldPassword !== userInfo.password) {
    return res.status(400).json({ message: "Old password is incorrect." });
  }
  if (DB.updateUserPassword(req.session.userId, req.body.newPassword)) {
    return res.status(200).json({ message: "Password changed successfully." });
  } else {
    return res.status(500).json({ message: "Failed to change password." });
  }
});

auth.get("/is-login", sessionValidator, (req, res) => {
  if (req.session && req.session.userId && DB.getUserById(req.session.userId)) {
    return res.status(200).json({ valid: true });
  } else {
    return res.status(401).json({ message: "session has expired" });
  }
  return res.status(500).json({ message: "Internal server error" });
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
