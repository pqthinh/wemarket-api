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
   *        - name: uid
   *          in : body
   *     responses:
   *       200:
   *         description: Success
   */
  app.get("/user/info", user.getUserDetail);

  /**
   * @swagger
   * /user/create:
   *   post:
   *     description: create user
   *     parameters:
   *       - name: uid
   *       - name: username
   *       - name: address
   *       - name: email
   *       - name: phone
   *       - name: gender
   *       - name: birthday
   *       - name: avatar
   *     responses:
   *       200:
   *         description: Success
   */
  app.post("/user/create", user.createUser);

  /**
   * @swagger
   * /admin/active-user:
   *   post:
   *     description: active user
   *     parameters:
   *       - name: uid
   *         in : body
   *     responses:
   *       200:
   *         description: Success
   */
  app.get("/admin/active-user", authAdmin, user.adminActiveUser);
};
