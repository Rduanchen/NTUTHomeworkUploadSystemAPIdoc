import auth from "./auth";
import system from "./system";
import homework from "./homework";
import { Router } from "express";

const router = Router();

router.use("/auth", auth);
router.use("/system", system);
router.use("/homework", homework);
router.use("/status", (req, res) => {
  if (!req.session.views) {
    req.session.views = 1;
  } else {
    req.session.views++;
  }
  res.json({
    status: "ok",
    views: req.session.views,
    userID: req.session.userID,
  });
});

export default router;
