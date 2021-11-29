const dbs = require("./dbs");

const Banner = {
  getListBanner: async (req, res, next) => {
    let conn,
      { limit = 10, offset = 0, idAdmin } = req.query;
    try {
      if(!idAdmin) {
        const response = {
          status: false,
          message:"idAdmin is required",
        };
        res.json(response);
        return;
      }
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      sql = `select * from banner`;
      result = await conn.query(sql);
      await conn.commit();
      let banners = result[0];
      let skip = Number(offset > 0 ? offset : 0) * Number(limit);
      let bannerResult = banners.slice(skip, skip + Number(limit));

      const response = {
        total: banners.length,
        page: Number(offset) + 1,
        result: bannerResult,
      };
      res.json(response);
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  getBannerDetail: async (req, res, next) => {
    let conn;
    let { idBanner, idAdmin } = req.query;
    try {
      if(!idBanner || !idAdmin) {
        const response = {
          status: false,
          message:"idBanner or idAdmin is required",
        };
        res.json(response);
        return;
      }
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      sql = `select * from banner where id = ?`;
      result = await conn.query(sql, [idBanner]);
      await conn.commit();
      if (result[0].length < 1) {
        res.json({ error: "Banner Not Existed" });
      } else {
        const response = {
          status: true,
          result: result[0][0],
        };
        res.json(response);
      }
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  createBanner: async (req, res, next) => {
    let conn;
    let { url } = req.body;
    try {
      //validate
      if(!url) {
        const response = {
          status: false,
          message:"url is required",
        };
        res.json(response);
        return;
      }

      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      //create category
      sql = `INSERT INTO banner (url, status) VALUES (?, "pending")`;
      result = await conn.query(sql, [url]);
      await conn.commit();

      const response = {
        status: true,
        message:"success",
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

module.exports = Banner;