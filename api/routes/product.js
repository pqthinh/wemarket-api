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
   *      - name: limit
   *        in: query
   *      - name: offset
   *        in: query
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.get("/common/product", product.getAllPostActive);

  /**
   * @swagger
   * /common/product/{idProduct}:
   *   get:
   *     description: get product detail
   *     parameters:
   *       - name : idProduct
   *         in : params
   *         type : integer
   *
   *     responses:
   *       200:
   *         description: Success
   */
  app.get("/common/product/:idProduct", product.getProductDetail);

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
   *      - name: idCategory
   *        in: query
   *      - name: limit
   *        in: query
   *      - name: offset
   *        in: query
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
   *     description: Create product
   *     parameters:
   *        - name: name
   *        - name: description
   *        - name: categoryId
   *        - name: price
   *        - name: uid
   *        - name: address
   *        - name: quantity
   *        - name: lat
   *        - name: lng
   *        - name: image
   *        - name: tag
   *        - name: images
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.post("/product/create", product.createProduct);

  /**
   * @swagger
   * /product/delete:
   *   post:
   *     description: delete product
   *     parameters:
   *       - name: idProduct
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.post("/product/delete", product.deleteProduct);

  /**
   * @swagger
   * /product/update:
   *   post:
   *     description: get all product for admin
   *     parameters:
   *        - name: idProduct
   *        - name: name
   *        - name: description
   *        - name: categoryId
   *        - name: price
   *        - name: uid
   *        - name: address
   *        - name: quantity
   *        - name: lat
   *        - name: lng
   *        - name: image
   *        - name: tag
   *        - name: images
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.post("/product/update", product.updateProduct);

  /**
   * @swagger
   * /user/product:
   *   post:
   *     description: get all post of user
   *     parameters:
   *      - name: uid
   *        in: query
   *      - name: limit
   *        in: query
   *      - name: offset
   *        in: query
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.post("/user/product", product.getAllPostOfUser);
};
