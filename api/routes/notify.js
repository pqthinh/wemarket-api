module.exports = (app) => {
    const { authUser, authAdmin } = require("../helpers/middleware");
    /* notify */
    const notify = require("../mysql/notify");


    /**
     * @swagger
     * /common/notify:
     *   get:
     *     description: get notify
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
    app.get("/common/notify" ,notify.getListNotify );

    /**
   * @swagger
   * /user/get-notify:
   *   post:
   *     description: get notify
   *     parameters:
   *       - name: uid
   *         in: body
   *       - name: id
   *         in: body
   *     responses:
   *       200:
   *         description: Success
   */
    app.post("/user/get-notify", notify.userGetNotify);
/**
   * @swagger
   * /admin/get-notify:
   *   post:
   *     description: admin get notify
   *     parameters:
   *       - name: admin_id
   *         in: body
   *       - name: id
   *         in: body
   *     responses:
   *       200:
   *         description: Success
   */
 app.post("/admin/get-notify", notify.adminGetNotify);
   
    
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
  