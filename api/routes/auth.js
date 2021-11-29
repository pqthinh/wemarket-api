const { authAdmin } = require("../helpers/middleware");

module.exports = (app) => {
  /* User */
  const user = require("../mysql/auth");
  /**
   * @swagger
   * /user/info/:uid:
   *   get:
   *     description: get info user
   *     parameters:
   *        - name: uid
   *          in : body
   *     responses:
   *       200:
   *         description: Success
   */
  app.get("/user/info/:uid", user.getUserDetail);

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

  /**
   * @swagger
   * /user/update:
   *   post:
   *     description: update user
   *     parameters:
   *       - name: uid
   *         in: body
   *       - name: username
   *         in: body
   *       - name: address
   *         in: body
   *       - name: email
   *         in: body
   *       - name: phone
   *         in: body
   *       - name: gender
   *         in: body
   *       - name: birthday
   *         in: body
   *       - name: avatar
   *         in: body
   *     responses:
   *       200:
   *         description: Success
   */
  app.post("/user/update", user.updateUser);
  /**
   * @swagger
   * /user/list:
   *   get:
   *     description: list all user for admin include active, inactive, pending account
   *     parameters:
   *      - name: limit
   *        in: query
   *      - name: offset
   *        in: query
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.get("/user/list", user.listAllUserForAdmin);
};
