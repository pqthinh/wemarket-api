module.exports = (app) => {
  const { auth } = require("../helpers/middleware");
  /* product */
  const product = require("../mysql/product");
  /**
   * @swagger
   * /common/product:
   *   get:
   *     description: get all product active product
   *     parameters:
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.get("/common/product", product.getAllPostActive);

  /**
   * @swagger
   * /common/product:
   *   post:
   *     description: get all product active product
   *     parameters:
   *        -idProduct:
   *         idIUser:
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.post("/common/product", product.getProductDetail);

  /**
   * @swagger
   * /admin/product:
   *   get:
   *     description: get all product for admin
   *     parameters:
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.get("/admin/product", auth, product.adminGetAllPost);
  app.post("/product/list-by-category", product.ListActiveProductByCategory);
};
