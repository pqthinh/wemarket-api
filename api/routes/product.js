module.exports = (app) => {
  /* product */
  const product = require("../mysql/product");
  /**
   * @swagger
   * /common/product:
   *   get:
   *     description: get all product active product
   *     parameters:
   *      - name: title
   *        description: title of the book
   *        in: formData
   *        required: true
   *        type: string
   *     responses:
   *       200:
   *         description: Success
   */
  app.get("/common/product", product.getAllPostActive);
};
