const dbs = require("./dbs");

const Product = {
  getAllPostActive: async (req, res, next) => {
    let conn,
      { limit = 10, offset = 0 } = req.query;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      sql = `select product.*,user.uid, user.username, user.address, user.email, user.phone, user.avatar from user, product where product.status ="active" and user.uid=product.uid and product.deletedAt is null limit ? offset ?`;
      result = await conn.query(sql, [
        Number(limit),
        Number(offset > 0 ? offset : 0) * Number(limit),
      ]);
      sqlCount = `select count(*) as total from product where status ="active" and product.deletedAt is null`;
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
  getProductDetail: async (req, res, next) => {
    let conn;
    let { idProduct } = req.params;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      sql = `select product.*, user.* from user, product where product.id = ? and user.uid = product.uid and product.status ="active" and product.deletedAt is null`;

      result = await conn.query(sql, [idProduct.toString()]);

      if (result[0].length < 1) {
        res.json({ error: "Product Not Existed" });
        return;
      }
      images = await conn.query(
        "select url from image where productId=? AND deletedAt is null",
        [idProduct]
      );

      await conn.commit();

      const data = {
        ...result[0][0],
        images: images[0].map((img) => img.url),
      };
      const response = {
        message: "success",
        status: 1,
        result: data,
      };
      res.json(response);
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },

  adminGetAllPost: async (req, res, next) => {
    let conn,
      { limit = 10, offset = 0 } = req.query;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      sql = `select product.*,user.uid, user.username, user.address, user.email, user.phone, user.avatar from user, product where user.uid = product.uid and product.deletedAt is null limit ? offset ?`;
      result = await conn.query(sql, [
        Number(limit),
        Number(offset > 0 ? offset : 0) * Number(limit),
      ]);
      const total = await conn.query("select count(*) as total from product");
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
  listActiveProductByCategory: async (req, res, next) => {
    let conn,
      { limit = 10, offset = 0 } = req.query;
    let { idCategory } = req.body;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result, count, total;
      sql = `select product.*,user.uid, user.username, user.address, user.email, user.phone, user.avatar, category.name AS categoryName from category, product, user where product.status ="active" and product.deletedAt is null AND user.uid = product.uid AND product.categoryId = category.id AND category.id = ? limit ? offset ?`;
      result = await conn.query(sql, [
        idCategory.toString(),
        Number(limit),
        Number(offset > 0 ? offset : 0) * Number(limit),
      ]);
      count = `select count(*) as total from product where categoryId = ?`;
      total = await conn.query(count, [idCategory.toString()]);
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
  createProduct: async (req, res, next) => {
    let conn;
    let {
      name,
      description,
      categoryId,
      price,
      uid,
      quantity,
      location = {},
      image = "https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc-sau.jpg",
      images = [],
      tag = [],
    } = req.body;
    let createdAt = new Date();
    let { address, lat, lng } = location;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      const validate = {};

      if (images.length > 8) validate.images = "Max length images is 8";
      if (!name.trim()) validate.name = "name is require field ";
      if (!description) validate.description = "description is require field ";
      if (!categoryId) validate.categoryId = "categoryId is require field ";
      if (!price || price < 0) validate.price = "price is invalid ";
      if (!price || price < 0) validate.price = "price is invalid ";
      if (!location || !lat || !lng || !address.trim())
        validate.location = "location is invalid ";
      if (!image) validate.image = "spotlight image is invalid ";
      if (tag && tag.length > 5) validate.tag = "Tag limit 5";

      if (Object.keys(validate).length !== 0) {
        res.json({ status: false, error: validate });
        return;
      }

      let sqlUser, result;
      let tagStr = JSON.stringify(tag);
      let code = new Date().getTime();

      sqlUser = `Select * from user where uid = ?`;
      let hasUser = await conn.query(sqlUser, [uid]);
      await conn.commit();

      if (hasUser[0].length < 1) {
        res.json({ error: "User Not Existed" });
        return;
      }

      //create product
      sql = `INSERT INTO product (code, name, description, categoryId, price, status, uid, createdAt, updatedAt, address, quantity, lat, lng, image, tag) VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      result = await conn.query(sql, [
        code.toString(),
        name,
        description,
        Number(categoryId),
        Number(price),
        uid,
        createdAt,
        createdAt,
        address,
        Number(quantity),
        lat,
        lng,
        image,
        tagStr,
      ]);
      await conn.commit();

      let idProductAfterCreate = result[0].insertId;
      let valuesImg = [];
      images.map((img) => {
        valuesImg = [...valuesImg, [idProductAfterCreate, img]];
      });

      //create images
      sql = `INSERT INTO image ( productId, url) VALUES ?`;
      result = await conn.query(sql, [valuesImg]);
      await conn.commit();

      const response = {
        status: 1,
        message: `Create success product id = ${idProductAfterCreate}`,
      };
      res.json(response);
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  updateProduct: async (req, res, next) => {
    let conn;
    let {
      idProduct,
      name,
      description,
      categoryId,
      price,
      address,
      quantity,
      lat,
      lng,
      image,
      images = [],
      tag = [],
    } = req.body;
    let updatedAt = new Date();
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      let tagStr = tag.toString();

      //validate data
      if (images.length > 10) {
        res.json({ error: "More than 10 images" });
      } else {
        sqlUser = `Select * from user where uid = ?`;
        let hasUser = await conn.query(sqlUser, [uid]);
        await conn.commit();
        if (hasUser[0].length < 1) {
          res.json({ error: "User Not Existed" });
        } else {
          //Update product
          sql = `update product
                 set name = ?, description = ?, categoryId = ?, price =?, address = ?, quantity = ?, lat = ?, lng = ?, image = ?, updatedAt = ?, tag = ?, status = "pending"
                 where id = ?`;
          result = await conn.query(sql, [
            name,
            description,
            Number(categoryId),
            Number(price),
            address,
            Number(quantity),
            lat,
            lng,
            image,
            updatedAt,
            tagStr,
            idProduct,
          ]);

          //update image
          await conn.query(
            "update image set deletedAt = ?, updatedAt = ? where productId = ?",
            [updatedAt, updatedAt, idProduct]
          );
          for (let img of images) {
            let imgQuery = await conn.query(
              "Select * from image where url = ? AND productId = ?",
              [img, idProduct]
            );
            await conn.commit();
            if (imgQuery[0].length > 0) {
              await conn.query(
                'update image set deletedAt = Null, status = "pending" where url = ? AND productId = ?',
                [img, idProduct]
              );
              await conn.commit();
            } else {
              sql = `INSERT INTO image ( productId, url, status, createdAt, updatedAt) 

                     VALUES (?, ?, 'pending', ?, ?)`;
              let resultImg = await conn.query(sql, [
                idProduct,
                img,
                updatedAt,
                updatedAt,
              ]);
              await conn.commit();
            }
          }

          const response = {
            status: 1,
            result: "success",
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
  deleteProduct: async (req, res, next) => {
    let { idProduct } = req.body;
    let deletedAt = new Date();
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      sql = `update product 
             set deletedAt = ?, updatedAt = ?
             where product.id = ?`;
      result = await conn.query(sql, [deletedAt, deletedAt, idProduct]);
      await conn.commit();

      //delete image
      await conn.query(
        "update image set deletedAt = ?, updatedAt = ? where productId = ?",
        [deletedAt, deletedAt, idProduct]
      );
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
  adminActivePost: async (req, res, next) => {
    let { idProduct, idAdmin } = req.body;
    let updatedAt = new Date();
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result, count, total;
      sql = `update product 
             set status = "active",admin_id= ?, updatedAt = ?
             where product.id = ?`;
      result = await conn.query(sql, [idAdmin, updatedAt, idProduct]);

      //Active image
      await conn.query(
        'update image set status = "active", updatedAt = ? where productId = ?',
        [updatedAt, idProduct]
      );
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
  getAllPostOfUser: async (req, res, next) => {
    let conn,
      { limit = 10, offset = 0, uid } = req.query;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      sql = `select product.*, user.username, user.address, user.email, user.phone, user.avatar from user, product where product.uid=? AND product.deletedAt is null limit ? offset ?`;
      result = await conn.query(sql, [
        uid,
        Number(limit),
        Number(offset > 0 ? offset : 0) * Number(limit),
      ]);
      sqlCount = `select count(*) as total from product`;
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
};

module.exports = Product;
