import { Router } from "express";
import DB from "../db";

const systemRoute = Router();

systemRoute.get("/class-list", (req, res) => {
  const classList = DB.getClassList();
  res.json({ classes: classList });
});

systemRoute.get("/login-amount", (req, res) => {
  res.json({ amount: DB.getLoginAmount() });
});

export default systemRoute;
