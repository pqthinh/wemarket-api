const dbs = require("./dbs");

const Product = {
  getAllPostActive: async (req, res, next) => {
    let conn;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      sql = `select * from admin`;
      result = await conn.query(sql);
      await conn.commit();
      res.json(result[0]);
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
};

module.exports = Product;