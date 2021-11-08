module.exports = (app) => {
  const { authUser, authAdmin } = require("../helpers/middleware");
  /* product */
  const product = require("../mysql/product");
  /**
   * @swagger
   * /common/product:
   *   get:
   *     description: get all product active product
   *     parameters:
   *        limit:
   *        offset:
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
   *        idProduct:
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
  app.get("/admin/product", authAdmin, product.adminGetAllPost);

  /**
   * @swagger
   * /common/product/list-by-category:
   *   get:
   *     description: get all product /product/list-by-category
   *     parameters:
   *        idCategory
   *        limit
   *        offset
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.post(
    "/common/product/list-by-category",
    product.listActiveProductByCategory
  );

  /**
   * @swagger
   * /product/create:
   *   post:
   *     description: get all product for admin
   *     parameters:
   *        idCategory
   *        limit
   *        offset
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.post("/product/create", authUser, product.createProduct);

  /**
   * @swagger
   * /product/delete:
   *   post:
   *     description: delete product
   *     parameters: 
   *        code
   *        name
   *        description
   *        idCategory
   *        price
   *        uid
   *        address
   *        quantity
   *        lat
   *        lng
   *        images: String
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.post("/product/delete", authAdmin, product.deleteProduct);

  /**
   * @swagger
   * /product/update:
   *   post:
   *     description: get all product for admin
   *     parameters:
   *        idProduct
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.post("/product/update", authUser, product.updateProduct);

  /**
   * @swagger
   * /user/product:
   *   post:
   *     description: get all post of user
   *     parameters:
     *        idProduct
     *        code
     *        name
     *        description
     *        idCategory
     *        price
     *        address
     *        quantity
     *        lat
     *        lng
     *        images: String
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.post("/user/product", authUser, product.getAllPostOfUser);
};
