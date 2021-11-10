const dbs = require("./dbs");

const Category = {
  List: async (req, res, next) => {
    let conn,
      { limit = 10, offset = 0 } = req.body;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      sql = `select * from category limit ? offset ?`;
      result = await conn.query(sql, [
        Number(limit),
        Number(offset > 0 ? offset : 0) * Number(limit),
      ]);
      sqlCount = `select count(*) as total from category`;
      const total = await conn.query(sqlCount);
      await conn.commit();

      const response = {
        total: total[0][0].total,
        page: Number(offset) + 1,
        result: result[0],
      };
      res.json(response);
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  Get: async (req, res, next) => {
    let conn;
    let { idCategory  } = req.body;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      sql = `select * from category where id = ?`;
      result = await conn.query(sql, [idCategory]);
      await conn.commit();
      if(result[0].length < 1) {
        res.json({error:"Category Not Existed"});
      } else {
        const response = {
            status: 1,
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
  createCategory: async (req, res, next) => {
    let conn;
    let {
        name,
        description = null,
        icon = null,
        image = null
    } = req.body;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;

      //validate data
      let hasCategory = await conn.query(`Select * from category where name = ?`,[name]);
      await conn.commit();
      if(hasCategory[0].length > 0) {
        res.json({error: "Category Existed"});
      } else {
      //create category
      sql = `INSERT INTO category (name, description, icon, image) 

      VALUES (?, ?, ?, ?)`;
      result = await conn.query(sql, [
        name,
        description,
        icon,
        image
      ]);
      await conn.commit();

      //Get category
      let resultCategory = await conn.query("select * from category where name = ?", [
        name
      ]);
      await conn.commit();

      const response = {
        status: 1,
        category: resultCategory[0][0],
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
  updateCategory: async (req, res, next) => {
    let conn;
    let {
        idCategory,
        name,
        description = null,
        icon = null,
        image = null
    } = req.body;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;

      //validate data
      let idValidate = await conn.query(`Select * from category where id = ?`,[idCategory]);
      await conn.commit();
      if(idValidate[0].length < 1) {
        res.json({error: "Category Not Existed"});
      } else {
        let checkName = await conn.query(`Select * from category where id != ? AND name = ?`,[idCategory, name]);
        await conn.commit();
        if(checkName[0].length > 0) {
          res.json({error: "Name of category Existed"});
        } else {
//Update category
sql = `update category
set name = ?, description = ?, icon = ?, image =?
 where id = ?`;
result = await conn.query(sql, [
name,
description,
icon,
image,
idCategory
]);
await conn.commit();
//Get category
let resultCategory = await conn.query("select * from category where id = ?", [idCategory]);
await conn.commit();

const response = {
status: 1,
result: resultCategory[0][0],
};
res.json(response);
        }
      }

      
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  deleteCategory: async (req, res, next) => {
    let { idCategory } = req.body;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;

      //validate data
      let idValidate = await conn.query(`Select * from category where id = ?`,[idCategory]);
      await conn.commit();
      if(idValidate[0].length < 1) {
        res.json({error: "Category Not Existed"});
      } else {

      //delete
      sql = `delete from category 
             where id = ?`;
      result = await conn.query(sql, [idCategory]);
      await conn.commit();

      const response = {
        result: "success",
        status: 1,
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
};

module.exports = Category;