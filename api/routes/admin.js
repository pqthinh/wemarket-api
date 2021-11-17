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
};
