module.exports = (app) => {
  const { authUser, authAdmin } = require("../helpers/middleware");
  /* notify */
  const history = require("../mysql/history");

  /**
   * @swagger
   * /product/seen_recent/:uid:
   *   get:
   *     description: get history -product recent view for user
   *     parameters:
   *      - name: uid
   *        in: params
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.get("/product/seen_recent/:uid", history.getListHistory);
};
