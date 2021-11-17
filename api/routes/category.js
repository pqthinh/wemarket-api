module.exports = (app) => {
  const { authUser, authAdmin } = require("../helpers/middleware");
  /* product */
  const category = require("../mysql/category");
  /**
   * @swagger
   * /common/category:
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
  app.post("/common/category", category.getListCategory);

  /**
   * @swagger
   * /common/category/get:
   *   post:
   *     description: get category by id
   *     parameters:
   *       - name : idCategory
   *         in : body
   *         type : integer
   *
   *     responses:
   *       200:
   *         description: Success
   */
  app.post("/common/category/get", category.getCategory);

  /**
   * @swagger
   * /category/create:
   *   post:
   *     description: create category by admin
   *     parameters:
   *        - name: name
   *        - name: description
   *        - name: icon
   *        - name: image
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.post("/category/create", category.createCategory);

  /**
   * @swagger
   * /product/delete:
   *   post:
   *     description: delete product
   *     parameters:
   *       - name: idCategory
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.post("/category/delete", category.deleteCategory);

  /**
   * @swagger
   * /category/update:
   *   post:
   *     description: update category by admin
   *     parameters:
   *        - name: idCategory
   *        - name: name
   *        - name: description
   *        - name: icon
   *        - name: image
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.post("/category/update", category.updateCategory);
  /**
   * @swagger
   * /common/subcategory:
   *   get:
   *     description: get all subcategory
   *     parameters:
   *      - name: limit
   *        in: body
   *      - name: offset
   *        in: body
   *      - name: idCategory
   *        in: body
   *     responses:
   *       200:
   *         description: Success
   *
   */
   app.post("/common/subcategory", category.getListSubCategory);

   /**
    * @swagger
    * /common/subcategory/get:
    *   post:
    *     description: get category by id
    *     parameters:
    *       - name : idCategory
    *         in : body
    *         type : integer
    *
    *     responses:
    *       200:
    *         description: Success
    */
   app.post("/common/subcategory/get", category.getSubCategory);
 
   /**
    * @swagger
    * /subcategory/create:
    *   post:
    *     description: create subcategory by admin
    *     parameters:
    *        - name: name
    *        - name: description
    *        - name: icon
    *        - name: image
    *        - name: idCategory
    *     responses:
    *       200:
    *         description: Success
    *
    */
   app.post("/subcategory/create", category.createSubCategory);
 
   /**
    * @swagger
    * /product/delete:
    *   post:
    *     description: delete subcategory
    *     parameters:
    *       - name: idSubCategory
    *     responses:
    *       200:
    *         description: Success
    *
    */
   app.post("/subcategory/delete", category.deleteSubCategory);
 
   /**
    * @swagger
    * /category/update:
    *   post:
    *     description: update category by admin
    *     parameters:
    *        - name: idCategory
    *        - name: name
    *        - name: description
    *        - name: icon
    *        - name: image
    *        - name: idCategory
    *     responses:
    *       200:
    *         description: Success
    *
    */
   app.post("/subcategory/update", category.updateSubCategory);
};
