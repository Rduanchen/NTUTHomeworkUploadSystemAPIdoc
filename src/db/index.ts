import db from "../db/mockDB.json";

class DB {
  public getClassList() {
    return db.CLASS.classList;
  }
  public getLoginAmount() {
    return db.CLASS.loginAmount;
  }
  public getUsers() {
    return db.USERS;
  }
  // public getUserByNameAndPassword(
  //   name: string,
  //   password: string,
  //   className: string
  // ) {
  //   return db.USERS.find(
  //     (user) =>
  //       user.name === name &&
  //       user.password === password &&
  //       user.class === className
  //   );
  // }
  public getUserById(id: number) {
    return db.USERS.find((user) => user.id === id);
  }
  public updateUserPassword(id: number, newPassword: string) {
    const user = db.USERS.find((user) => user.id === id);
    return true;
  }
  public getUserHomeworkList(userId: number) {
    const userClass = db.USERS.find((user) => user.id === userId)?.class;
    return db.PUZZLES.filter((puzzle) => puzzle.classId === userClass);
  }
  public getCheckTestResults(puzzleId: number, userId: number) {
    return db.TEST_CASE_RESULTS.filter(
      (result) => result.puzzleId === puzzleId && result.userId === userId
    );
  }
  public getSubmitHomeworkRecords(puzzleId: number, userId: number) {
    return db.SUBMISSION.filter(
      (record) => record.puzzleId === puzzleId && record.userId === userId
    );
  }
}
export default new DB();
