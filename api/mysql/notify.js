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
        isRead: result[0].filter((notify) => !notify.isRead).length,
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

  userReadNotify: async (req, res, next) => {
    let uid = req.body.uid;
    updateAt= new Date()
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      sql = `update notify
             set isRead = 1 , updatedAt = ?
             where notify.uid = ?`;
      result = await conn.query(sql, [updateAt, uid]);
      await conn.commit();

      const response = {
        result: "success",
        status: 1,
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

module.exports = Notify;
