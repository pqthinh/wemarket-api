const { authAdmin } = require("../helpers/middleware");

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
  app.post("/user/create", user.createUser);
  /**
   * @swagger
   * /user/create:
   *   get:
   *     description: create user 
   *     parameters:
   *          uid
   *          username
   *          address
   *          email
   *          phone
   *          gender
   *          birthday
   *          avatar
   *     responses:
   *       200:
   *         description: Success
   */
  app.get("/admin/active-user",authAdmin, user.adminActiveUser);
};
