const dbs = require("./dbs");

const Category = {
  getListCategory: async (req, res, next) => {
    let conn,
      { limit = 20, offset = 0 } = req.query;
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
  getCategory: async (req, res, next) => {
    let conn;
    let { idCategory } = req.params;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      sql = `select * from category where id = ?`;
      result = await conn.query(sql, [idCategory]);
      await conn.commit();
      if (result[0].length < 1) {
        res.json({ error: "Category Not Existed" });
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
    let { name, description = null, icon = null, image = null } = req.body;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;

      //validate data
      let hasCategory = await conn.query(`select * from category`);
      await conn.commit();
      let listCategory = hasCategory[0].filter(
        (x) => x.name.toLowerCase() == name.toLowerCase()
      );
      if (listCategory.length > 0) {
        res.json({ error: "Category Existed" });
      } else {
        //create category
        sql = `INSERT INTO category (name, description, icon, image) VALUES (?, ?, ?, ?)`;
        result = await conn.query(sql, [name, description, icon, image]);
        await conn.commit();

        const response = {
          status: 1,
          message: "success",
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
      image = null,
    } = req.body;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;

      let checkName = await conn.query(
        `Select * from category where id != ? AND name = ?`,
        [idCategory, name]
      );
      await conn.commit();
      if (checkName[0].length > 0) {
        res.json({ error: "Name of category Existed" });
      } else {
        //Update category
        sql = `update category set name = ?, description = ?, icon = ?, image =? where id = ?`;
        result = await conn.query(sql, [
          name,
          description,
          icon,
          image,
          idCategory,
        ]);
        await conn.commit();

        const response = {
          status: 1,
          message: "success",
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
  deleteCategory: async (req, res, next) => {
    let { idCategory } = req.body;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;

      //delete
      sql = `delete from category where id = ?`;
      result = await conn.query(sql, [idCategory]);
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
  getListSubCategory: async (req, res, next) => {
    let conn,
      { idCategory } = req.query;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      sql = `SELECT subcategory.*, category.id as categoryId, category.name AS categoryName, category.image AS categoryImage,subcategory.icon AS categoryIcon FROM subcategory LEFT JOIN category ON subcategory.categoryId = category.id order by subcategory.categoryId`;
      result = await conn.query(sql);
      let subcategory = result[0];
      if (idCategory) {
        subcategory = subcategory.filter((x) => x.categoryId == idCategory);
      }

      const groupBy = (items, key) =>
        items.reduce(
          (result, item) => ({
            ...result,
            [item[key]]: [...(result[item[key]] || []), item],
          }),
          {}
        );

      let temp = Object.values(groupBy(subcategory, "categoryId")).map(
        (category) => {
          return {
            id: category[0].categoryId,
            name: category[0].categoryName,
            image: category[0].categoryImage,
            icon: category[0].categoryIcon,
            children: category,
          };
        }
      );

      const response = {
        total: subcategory.length,
        listCategory: temp,
      };
      res.json(response);
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  getSubCategory: async (req, res, next) => {
    let conn;
    let { idSubCategory } = req.params;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      sql = `select * from subcategory where id = ?`;
      result = await conn.query(sql, [idSubCategory]);
      await conn.commit();
      if (result[0].length < 1) {
        res.json({ error: "SubCategory Not Existed" });
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
  createSubCategory: async (req, res, next) => {
    let conn;
    let {
      idCategory,
      name,
      description = null,
      icon = null,
      image = null,
    } = req.body;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      if (!idCategory) {
        res.json({ status: false, error: "idCategory is required" });
        return;
      }
      if (!name) {
        res.json({ status: false, error: "name is required" });
        return;
      }

      //validate data
      let hasCategory = await conn.query(`Select * from subcategory`);
      await conn.commit();
      let list = hasCategory[0].filter(
        (x) => x.name.toLowerCase() == name.toLowerCase()
      );
      if (list.length > 0) {
        res.json({ error: "SubCategory Existed" });
      } else {
        //create category
        sql = `INSERT INTO subcategory (name, description, icon, image, categoryId) VALUES (?, ?, ?, ?, ?)`;
        result = await conn.query(sql, [
          name,
          description,
          icon,
          image,
          idCategory,
        ]);
        await conn.commit();

        const response = {
          status: 1,
          result: "success",
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
  updateSubCategory: async (req, res, next) => {
    let conn;
    let {
      idSubCategory,
      name,
      description = null,
      icon = null,
      image = null,
      idCategory,
    } = req.body;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;

      if (!idCategory) {
        res.json({ status: false, error: "idCategory is required" });
        return;
      }
      if (!name) {
        res.json({ status: false, error: "name is required" });
        return;
      }

      let checkName = await conn.query(
        `Select * from category where id != ? AND name = ?`,
        [idSubCategory, name]
      );
      await conn.commit();
      if (checkName[0].length > 0) {
        res.json({ error: "Name of subcategory Existed" });
      } else {
        //Update category
        sql = `update subcategory set name = ?, description = ?, icon = ?, image =?, categoryId=? where id = ?`;
        result = await conn.query(sql, [
          name,
          description,
          icon,
          image,
          idCategory,
          idSubCategory,
        ]);
        await conn.commit();

        const response = {
          status: 1,
          result: "success",
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
  deleteSubCategory: async (req, res, next) => {
    let { idSubCategory } = req.body;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;

      //validate data
      let idValidate = await conn.query(
        `Select * from subcategory where id = ?`,
        [idSubCategory]
      );
      await conn.commit();
      if (idValidate[0].length < 1) {
        res.json({ error: "SubCategory Not Existed" });
      } else {
        //delete
        sql = `delete from subcategory where id = ?`;
        result = await conn.query(sql, [idSubCategory]);
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
