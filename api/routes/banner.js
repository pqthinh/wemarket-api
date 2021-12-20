module.exports = (app) => {
  const { authUser, authAdmin } = require("../helpers/middleware");
  const banner = require("../mysql/banner");
  /**
   * @swagger
   * /common/banner/list:
   *   get:
   *     description: common/banner/list
   *     parameters:
   *      - name: type
   *        in: query
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.get("/common/banner/list", banner.getListBannerActive);

  /**
   * @swagger
   * /admin/banner/list:
   *   get:
   *     description: get all banner active product
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
  app.get("/admin/banner/list", banner.getListBanner);

  /**
   * @swagger
   * /admin/update-banner:
   *   post:
   *     description: get banner by id
   *     parameters:
   *       - name : idBanner
   *         in : body
   *       - name : url
   *         in : body
   *       - name : type
   *         in : body
   *       - name : description
   *         in : body
   *
   *     responses:
   *       200:
   *         description: Success
   */
  app.post("/admin/update-banner", banner.updateBanner);

  /**
   * @swagger
   * /admin/banner-create:
   *   post:
   *     description: create banner by admin
   *     parameters:
   *       - name : url
   *         in : body
   *       - name : type
   *         in : body
   *       - name : description
   *         in : body
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.post("/admin/banner-create", banner.createBanner);

  /**
   * @swagger
   * /admin/banner-status:
   *   post:
   *     description: change status banner by admin
   *     parameters:
   *       - name : idBanner
   *         in : body
   *       - name : status
   *         in : body
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.post("/admin/banner-status", banner.changeStatusBanner);
};
