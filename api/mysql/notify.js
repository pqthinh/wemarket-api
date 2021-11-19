const dbs = require("./dbs");

const Notify = {
  getListNotify: async (req, res, next) => {
    let conn,
      { limit = 20, offset = 0 } = req.body;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;

      result = await conn.query(`select * from notify limit ? offset ?`, [
        Number(limit),
        Number(offset > 0 ? offset : 0) * Number(limit),
      ]);

      const total = await conn.query(`select count(*) as total from notify`);
      await conn.commit();

      //   đếm số lượng thông báo chưa được đọc

      const response = {
        total: total[0][0].total,
        page: Number(offset) + 1,
        result: result[0],
        unRead: result[0].filter((notify) => !notify.isRead).length,
      };
      res.json(response);
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  // api update trang thai isRead 0=>1 , updateAt= new Date()
};

module.exports = Notify;
