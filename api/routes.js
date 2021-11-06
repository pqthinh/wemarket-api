const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Home api of app" });
});

// common

/* product */
const product = require("./mysql/product");
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
router.get("/common/product", product.getAllPostActive);

module.exports = router;
