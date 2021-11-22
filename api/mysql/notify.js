const dbs = require("./dbs");

const Notify = {

  // api - read
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

  // api - update 

  userGetNotify: async (req, res, next) => {
    let uid = req.body.uid;
    let idNotify = req.body.id;
    updateAt = new Date();
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sqlNotify, resultNotify;
      let sql, result;

      //validate
      const validate = {};
      if (!uid) validate.uid = "uid is require field";
      if (!idNotify) validate.idNotify = "idNotify is require field";
      if (Object.keys(validate).length !== 0) {
        res.json({ status: false, error: validate });
        return;
      }


      sqlNotify = `update notify
             set isRead = 1 , updatedAt = ?
             where notify.uid = ? and notify.id = ? `;
      resultNotify = await conn.query(sqlNotify, [updateAt, uid, idNotify]);
      await conn.commit();
      sql = ` select * from notify where notify.uid = ? and notify.id =?`;
      result = await conn.query(sql,[uid, idNotify]);
      await conn.commit();

      const response = {
        result: "success",
        status: 1,
        data: result[0],
      };
      res.json(response);
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  adminGetNotify: async (req, res, next) => {
    let idAdmin = req.body.admin_id;
    let idNotify = req.body.id;
    updateAt = new Date();
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sqlNotify, resultNotify;
      let sql, result;
      
       //validate
       const validate = {};
       if (!idAdmin) validate.uid = "idAmin is require field";
       if (!idNotify) validate.idNotify = "idNotify is require field";
       if (Object.keys(validate).length !== 0) {
         res.json({ status: false, error: validate });
         return;
       }

      sqlNotify = `update admin_notify
             set isRead = 1 , updatedAt = ?
             where admin_id = ? and id = ? `;
      resultNotify = await conn.query(sqlNotify, [updateAt, idAdmin, idNotify]);
      await conn.commit();
      sql = ` select * from admin_notify where admin_notify.admin_id = ? and admin_notify.id =?`;
      result = await conn.query(sql,[idAdmin, idNotify]);
      await conn.commit();

      const response = {
        result: "success",
        status: 1,
        data: result[0],
      };
      res.json(response);
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  
  // api - delete
  userDeleteNotify: async (req, res, next) => {
    let idNotify  = req.body.id;
    let uid = req.body.uid;
    console.log(req.body);
    console.log("hello");
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;

      //delete
      sql = `delete from notify where notify.uid = ? and notify.id = ?`;
      result = await conn.query(sql, [uid, idNotify]);
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
  adminDeleteNotify: async (req, res, next) => {
    let idAdmin = req.body.admin_id;
    let id = req.body.id;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;

      //delete
      sql = `delete from admin_notify where admin_id = ? and id = ?`;
      result = await conn.query(sql, [idAdmin, id]);
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
