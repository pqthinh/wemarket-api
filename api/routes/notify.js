module.exports = (app) => {
  const { authUser, authAdmin } = require("../helpers/middleware");
  /* notify */
  const notify = require("../mysql/notify");

  /**
   * @swagger
   * /common/notify/:uid:
   *   get:
   *     description: get notify for user
   *     parameters:
   *      - name: uid
   *        in: params
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.get("/common/notify/:uid", notify.getListNotify);

  /**
   * @swagger
   * /user/read-notify:
   *   post:
   *     description: read a notify
   *     parameters:
   *       - name: uid
   *         in: body
   *       - name: idNotify
   *         in: body
   *     responses:
   *       200:
   *         description: Success
   */
  app.post("/user/read-notify", notify.userReadNotify);
  /**
   * @swagger
   * /admin/get-notify:
   *   get:
   *     description: admin get notify
   *     parameters:
   *       - name: admin_id
   *         in: params
   *     responses:
   *       200:
   *         description: Success
   */
  app.get("/admin/get-notify/:idAdmin", notify.adminGetNotify);

  /**
   * @swagger
   * /admin/read-notify:
   *   post:
   *     description: admin get notify
   *     parameters:
   *       - name: idAdmin
   *         in: body
   *       - name: idNotify
   *         in: body
   *       - name: type
   *         in: body
   *     responses:
   *       200:
   *         description: Success
   */
  app.post("/admin/read-notify", notify.adminReadNotify);

  /**
   * @swagger
   * /user/delete-notify:
   *   post:
   *     description: user delete notify
   *     parameters:
   *       - name: uid
   *         in: body
   *       - name: id
   *         in: body
   *     responses:
   *       200:
   *         description: Success
   */
  app.post("/user/delete-notify", notify.userDeleteNotify);

  /**
   * @swagger
   * /admin/delete-notify:
   *   post:
   *     description: admin delete notify
   *     parameters:
   *       - name: admin_id
   *         in: body
   *       - name: id
   *         in: body
   *     responses:
   *       200:
   *         description: Success
   */
  app.post("/admin/delete-notify", notify.adminDeleteNotify);
};
