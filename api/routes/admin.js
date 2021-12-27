const { authAdmin } = require("../helpers/middleware");

module.exports = (app) => {
  const user = require("../mysql/auth");
  /**
   * @swagger
   * /admin/login:
   *   post:
   *     description: login admin
   *     parameters:
   *       - name: email
   *       - name: password
   *     responses:
   *       200:
   *         description: Success
   */
  app.post("/admin/login", user.loginAdmin);

  /**
   * @swagger
   * /admin/register:
   *   post:
   *     description: login admin
   *     parameters:
   *       - name: username
   *       - name: password
   *       - name: name
   *     responses:
   *       200:
   *         description: Success
   */
  app.post("/admin/register", user.registerAdmin);

  /**
   * @swagger
   * /admin/change-password:
   *   post:
   *     description: login admin
   *     parameters:
   *       - name: oldPassword
   *       - name: newPassword
   *     responses:
   *       200:
   *         description: Success
   */
  app.post("/admin/change-password", user.changePassAdmin);

  /**
   * @swagger
   * /admin/user:
   *   post:
   *     description: filter user
   *     parameters:
   *       - name: query
   *         in: body
   *       - name: orderByDate
   *         in: body
   *       - name: orderByStatus
   *         in: body
   *     responses:
   *       200:
   *         description: Success
   */
  app.post("/admin/user", user.adminFilterUser);

  /**
   * @swagger
   * /admin/reset-password:
   *   post:
   *     description: reset-password
   *     parameters:
   *       - name: email
   *         in: body
   *     responses:
   *       200:
   *         description: Success
   */
  app.post("/admin/reset-password", user.sendEmailResetPass);
};
