const dbs = require("./dbs");

const History = {
  // api - read
  getListHistory: async (req, res, next) => {
    let conn,
      { uid } = req.params;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();

      const result = await conn.query(
        `select DISTINCT(product_seen_recent.productId), product.*, user.* from product, user, product_seen_recent where product_seen_recent.uid=? and product_seen_recent.productId=product.id and product_seen_recent.uid= user.uid`,
        [uid]
      );

      const response = {
        status: true,
        message: "Get list list product recent success",
        data: result[0],
        length: result[0].length
      };
      res.json(response);
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
};

module.exports = History;
