module.exports = (app) => {
  /* User */
  const user = require("../mysql/auth");
  /**
   * @swagger
   * /user/auth:
   *   get:
   *     description: get info user
   *     parameters:
   *     responses:
   *       200:
   *         description: Success
   */
  app.get("/user/info", user.getUserDetail);
};
