import db from "../db/mockDB.json";

class DB {
  public getClassList() {
    return db.CLASS.classList;
  }
  public getLoginAmount() {
    return db.CLASS.loginAmount;
  }
}

export default new DB();
