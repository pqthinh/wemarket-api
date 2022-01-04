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
        `select p1.productId, product.*, user.* 
        from (SELECT  Max(psr.createAt), psr.uid, psr.productId
        FROM product_seen_recent psr
        where psr.uid = ?
        group by psr.productId
        order by Max(psr.createAt) DESC
             ) AS p1, product, user
        where p1.productId=product.id and p1.uid= user.uid`,
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
