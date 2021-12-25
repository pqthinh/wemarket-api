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
   * /admin/product/get:
   *   get:
   *     description: admin get product detail
   *     parameters:
   *      - name: idProduct
   *        in: query
   *      - name: idAdmin
   *        in: query
   *
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.post("/admin/product/get", product.adminGetProductDetail);
  /**
   * @swagger
   * /seller/product/get:
   *   get:
   *     description: seller get product detail
   *     parameters:
   *      - name: idProduct
   *        in: query
   *      - name: uid
   *        in: query
   *
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.post("/seller/product/get", product.sellerGetProductDetail);
  /**
   * @swagger
   * /admin/product/filter:
   *   get:
   *     description: filter all product for admin
   *     parameters:
   *      - name: search
   *        in: body
   *      - name: categoryId
   *        in: body
   *      - name: sort
   *        in: body
   *        value: [price, quantity, view, ...]
   *      - name: type
   *        in: body
   *      - name: limit
   *        in: body
   *      - name: offset
   *        in: body
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.post("/admin/product/filter", authAdmin, product.adminFilterAllProduct);

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
   *        - name: categoryName
   *        - name: username
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
   *        - name: categoryName
   *        - name: username
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.post("/product/update", product.sellerUpdateProduct);

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

  /**
   * @swagger
   * /common/product/filter:
   *   post:
   *     description: get all post by filter
   *     parameters:
   *      - name: search
   *        in: body
   *      - name: categoryId
   *        in: body
   *      - name: minPrice
   *        in: body
   *      - name: maxPrice
   *        in: body
   *      - name: minQuantity
   *        in: body
   *      - name: maxQuantity
   *        in: body
   *      - name: minLike
   *        in: body
   *      - name: maxLike
   *        in: body
   *      - name: minView
   *        in: body
   *      - name: maxView
   *        in: body
   *      - name: lat
   *        in: body
   *      - name: lng
   *        in: body
   *      - name: distance
   *        in: body
   *      - name: orderByDistance
   *        in: body
   *      - name: orderByDate
   *        in: body
   *      - name: orderByLike
   *        in: body
   *      - name: orderByQuantity
   *        in: body
   *      - name: orderByPrice
   *        in: body
   *      - name: orderByView
   *        in: body
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.post("/common/product/filter", product.filterActiveProduct);

  /**
   * @swagger
   * /bookmark/:uid/:idCategory:
   *   get:
   *     description: get list bookmark for user
   *     parameters:
   *      - name: uid
   *        in: query
   *      - name: idCategory
   *        in: query
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.get("/bookmark/:uid/:idCategory", product.getListBookmark);

  /**
   * @swagger
   * /bookmark/create:
   *   post:
   *     description: create bookmark
   *     parameters:
   *      - name: uid
   *        in: body
   *      - name: productId
   *        in: body
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.post("/bookmark/create", product.createBookmark);
  /**
   * @swagger
   * /bookmark/delete:
   *   post:
   *     description: create bookmark
   *     parameters:
   *      - name: uid
   *        in: body
   *      - name: productId
   *        in: body
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.post("/bookmark/delete", product.deleteBookmark);
  /**
   * @swagger
   * /admin/comment/list:
   *   get:
   *     description: admin get product detail
   *     parameters:
   *      - name: limit
   *        in: query
   *      - name: offset
   *        in: query
   *      - name: idAdmin
   *        in: query
   *
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.get("/admin/comment/list", product.adminGetAllComment);

  /**
   * @swagger
   * /admin/comment-status:
   *   post:
   *     description: change status comment by admin
   *     parameters:
   *       - name : idComment
   *         in : body
   *       - name : status
   *         in : body
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.post("/admin/comment-status", product.changeStatusComment);

  /**
   * @swagger
   * /admin/comment/list:
   *   get:
   *     description: admin get product detail
   *     parameters:
   *      - name: idProduct
   *        in: query
   *      - name: idAdmin
   *        in: query
   *
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.get("/admin/comment/get", product.adminGetCommentDetail);

  /**
   * @swagger
   * /admin/active-post:
   *   post:
   *     description: admin active post
   *     parameters:
   *      - name: idProduct
   *        in: query
   *      - name: idAdmin
   *        in: query
   *
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.post("/admin/active-post", product.adminActivePost);
  /**
   * @swagger
   * /admin/ban-post:
   *   post:
   *     description: admin ban post
   *     parameters:
   *      - name: idProduct
   *        in: query
   *      - name: idAdmin
   *        in: query
   *
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.post("/admin/ban-post", product.adminBanPost);
  /**
   * @swagger
   * /product/new-post:
   *   get:
   *     parameters:
   *     responses:
   */
  app.get("/product/new-post", product.getTopProductNew);
  /**
   * @swagger
   * /product/top-view:
   *   get:
   *     parameters:
   *     responses:
   */
  app.get("/product/top-view", product.getTopSearch);
  /**
   * @swagger
   * /product/top-similar:
   *   post:
   *     parameters:
   *      - name: idProduct
   *        in: body
   *     responses:
   */
  app.post("/product/top-similar", product.listSimilarProduct);
  /**
   * @swagger
   * /product/comment:
   *   post:
   *     description: get all active comment of product
   *     parameters:
   *      - name: idProduct
   *        in: body
   *
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.post("/product/comment", product.ListActiveCommentOfProduct);
};
