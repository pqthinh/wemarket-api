module.exports = (app) => {
    const { authUser, authAdmin } = require("../helpers/middleware");
    const banner = require("../mysql/banner");
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
     * /admin/banner/get:
     *   post:
     *     description: get banner by id
     *     parameters:
     *       - name : idBanner
     *         in : body
     *       - name : idAdmin
     *         in : body
     *
     *     responses:
     *       200:
     *         description: Success
     */
    app.get("/admin/banner/get", banner.getBannerDetail);
  
    /**
     * @swagger
     * admin/banner/create:
     *   post:
     *     description: create banner by admin
     *     parameters:
     *        - name: url
     *     responses:
     *       200:
     *         description: Success
     *
     */
    app.post("/admin/banner/create", banner.createBanner);
  
  };