const dbs = require("./dbs");
const client = require("./elastic");

const Product = {
  getAllPostActive: async (req, res, next) => {
    let conn = await dbs.getConnection();
    try {
      await conn.beginTransaction();
      let sql, result;
      let { limit = 10, offset = 0, lat, lng, range } = req.query;
      sql = `select product.*,user.username,user.address AS userAddress,user.email,user.phone,user.avatar, category.name as categoryName, category.icon as categoryIcon 
      from user, product, category 
      where product.status ="active" and user.uid=product.uid and product.categoryId=category.id and product.deletedAt is null order by product.id desc`;

      result = await conn.query(sql);
      await conn.commit();
      let product = result[0];

      let topViewProduct = product
        .sort(function (a, b) {
          return b.view - a.view;
        })
        .slice(0, 10);
      let topLikeProduct = product
        .sort(function (a, b) {
          return b.like_num - a.like_num;
        })
        .slice(0, 10);
      let skip = Number(offset > 0 ? offset : 0) * Number(limit);
      let productResult = product.slice(skip, skip + Number(limit));
      if (lat && lng) {
        let R = 6371; //km
        productResult.forEach((x) => {
          let dLat = (lat - x.lat) * (Math.PI / 180);
          let dLon = (lng - x.lng) * (Math.PI / 180);
          let lat1 = x.lat * (Math.PI / 180);
          let lat2 = lat * (Math.PI / 180);
          let a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) *
              Math.sin(dLon / 2) *
              Math.cos(lat1) *
              Math.cos(lat2);
          let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          x.distance = Math.round(R * c * 100) / 100;
        });
      }
      productResult.forEach((x) => {
        x.isTop = false;
        x.isFav = false;
        if (topViewProduct.filter((tv) => tv.id == x.id).length > 0) {
          x.isTop = true;
        }
        if (topLikeProduct.filter((tl) => tl.id == x.id).length > 0) {
          x.isFav = true;
        }
      });

      if (range) {
        productResult = productResult.filter((p) => p.distance < range);
      }

      const response = {
        total: product.length,
        page: Number(offset) + 1,
        result: productResult,
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
    let { idProduct, uid, lat, lng } = req.body;

    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      sql = `select product.*, user.*, category.name as categoryName, category.icon as categoryIcon from user, product, category where product.id = ? and user.uid = product.uid and product.categoryId = category.id and product.status ="active" and product.deletedAt is null`;

      result = await conn.query(sql, [idProduct.toString()]);

      if (result[0].length < 1) {
        res.json({ error: "Product Not Existed" });
        return;
      }
      images = await conn.query(
        "select url from image where productId=? AND deletedAt is null",
        [idProduct]
      );
      await conn.query(
        `update product set view= view+1 where id=? AND status='active'`,
        [idProduct]
      );

      await conn.query(
        `INSERT INTO product_seen_recent (uid, productId) VALUES (?, ?) `,
        [uid, idProduct]
      );

      await conn.commit();
      let product = result[0][0];
      //distance of product
      if (lat && lng) {
        let R = 6371; //km
        let dLat = (lat - product.lat) * (Math.PI / 180);
        let dLon = (lng - product.lng) * (Math.PI / 180);
        let lat1 = product.lat * (Math.PI / 180);
        let lat2 = lat * (Math.PI / 180);
        let a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.sin(dLon / 2) *
            Math.sin(dLon / 2) *
            Math.cos(lat1) *
            Math.cos(lat2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        product.distance = Math.round(R * c * 100) / 100;
      }
      const data = {
        ...product,
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
  adminGetProductDetail: async (req, res, next) => {
    let conn;
    let { idProduct, idAdmin } = req.query;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      //validate
      if (!idProduct || !idAdmin) {
        res.json({ error: "idProduct and idAdmin are required" });
        return;
      }
      let sql, result;
      sql = `select product.*,user.username,user.address AS userAddress,user.email,user.phone,user.avatar, category.name as categoryName, category.icon as categoryIcon 
      from user, product, category 
      where user.uid=product.uid and product.categoryId=category.id and product.deletedAt is null and product.id = ?`;

      result = await conn.query(sql, [idProduct]);

      if (result[0].length < 1) {
        res.json({ error: "Product Not Existed" });
        return;
      }
      images = await conn.query(
        "select url from image where productId=? AND deletedAt is null",
        [idProduct]
      );
      await conn.query(
        `update product set view= view+1 where id=? AND status='active'`,
        [idProduct]
      );

      await conn.commit();
      let product = result[0][0];
      const data = {
        ...product,
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
  sellerGetProductDetail: async (req, res, next) => {
    let conn;
    let { idProduct, uid } = req.query;
    try {
      //validate
      if (!idProduct || !uid) {
        res.json({ error: "idProduct and uid are required" });
        return;
      }
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      sql = `select product.*,user.username,user.address AS userAddress,user.email,user.phone,user.avatar, category.name as categoryName, category.icon as categoryIcon 
      from user, product, category 
      where user.uid=product.uid and product.categoryId=category.id and product.deletedAt is null and product.id = ?`;

      result = await conn.query(sql, [idProduct]);

      if (result[0].length < 1 || result[0][0].uid != uid) {
        res.json({ error: "Product Not Existed" });
        return;
      }
      images = await conn.query(
        "select url from image where productId=? AND deletedAt is null",
        [idProduct]
      );

      await conn.commit();
      let product = result[0][0];
      const data = {
        ...product,
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
      sql = `select product.*,user.* from user, product where user.uid = product.uid and product.deletedAt is null limit ? offset ?`;
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
      sql = `select product.*,user*, category.name as categoryName, category.icon as categoryIcon 
      from category, product, user where product.status ="active" and product.deletedAt is null AND user.uid = product.uid AND product.categoryId = category.id AND category.id = ? limit ? offset ?`;
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
    console.log(req.body);
    try {
      let {
        title,
        description,
        categoryId,
        price,
        uid,
        quantity,
        location = {},
        image = "https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc-sau.jpg",
        images = [],
        tag = [],
        categoryName,
      } = req.body;
      let createdAt = new Date();
      let { address, lat, lng } = location;

      conn = await dbs.getConnection();
      await conn.beginTransaction();
      const validate = {};
      if (images.length > 10) validate.images = "Max length images is 10";
      if (!title) validate.title = "title is require field ";
      if (!description) validate.description = "description is require field ";
      if (!categoryId) validate.categoryId = "categoryId is require field ";
      if (!price || price < 0) validate.price = "price is invalid ";
      if (!uid) validate.uid = "uid is required";
      if (!location || !lat || !lng || !address)
        validate.location = "location is invalid ";

      if (Object.keys(validate).length !== 0) {
        res.json({ status: false, error: validate });
        return;
      }

      let sqlUser, result;
      let tagStr = JSON.stringify(tag);
      let time = createdAt.getTime();
      let code = `PRODUCT${time}`;
      image = images[0];
      sqlUser = `Select * from user where uid = ?`;
      let hasUser = await conn.query(sqlUser, [uid]);
      await conn.commit();

      if (hasUser[0].length < 1) {
        res.json({ error: "User Not Existed" });
        return;
      }
      let user = hasUser[0][0];
      let h = createdAt.getHours();
      let m = createdAt.getMinutes();
      let s = createdAt.getSeconds();
      let date = createdAt.getDate();
      let month = createdAt.getMonth() + 1;
      let year = createdAt.getFullYear();
      let createdAtString = `"${year}/${month}/${date}"`
      //create product
      sql = `INSERT INTO product (code, name, description, categoryId, price, status, uid, createdAt, updatedAt, address, quantity, lat, lng, image, tag) VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      result = await conn.query(sql, [
        code.toString(),
        title,
        description,
        Number(categoryId),
        Number(price),
        uid,
        createdAtString,
        createdAtString,
        address,
        Number(quantity),
        lat,
        lng,
        image,
        tagStr,
      ]);
      await conn.commit();

      let idProductAfterCreate = result[0].insertId;
      if (images.length > 0) {
        let valuesImg = [];
        images.map((img) => {
          valuesImg = [...valuesImg, [idProductAfterCreate, img]];
        });

        //create images
        sql = `INSERT INTO image ( productId, url) VALUES ?`;
        result = await conn.query(sql, [valuesImg]);
        await conn.commit();
      }

      //create notify to admin
      //get user
      let adminQuery = await conn.query(
        `select * from admin where deletedAt is null `
      );
      await conn.commit();
      let admins = adminQuery[0];
      let adminNotis = [];
      let titleMessage = `Sản phẩm mới`;
      let content = `Người dùng ${user.username} đã tạo sản phẩm ${code} vào lúc ${h}:${m}:${s} ngày ${date}/${month}/${year}. Sản phẩm này đang chờ được duyệt`;
      for (let admin of admins) {
        adminNotis.push([admin.id, titleMessage, content]);
      }
      let sqlNoti = `INSERT INTO admin_notify ( admin_id, title, content) VALUES ?`;
      await conn.query(sqlNoti, [adminNotis]);
      await conn.commit();

      //create document in elasticsearch
      await client.index({
        index: "products",
        id: idProductAfterCreate,
        type: "product",
        body: {
          name: title,
          id: idProductAfterCreate,
          description: description,
          address: address,
          category: categoryName,
          tag: tagStr,
          username: user.username,
        },
      });

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
  sellerUpdateProduct: async (req, res, next) => {
    let conn;
    let {
      idProduct,
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
      categoryName,
      username,
    } = req.body;
    let { address, lat, lng } = location;
    let updatedAt = new Date();
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      //validate request
      const validate = {};

      if (images.length > 8) validate.images = "Max length images is 8";
      if (!name.trim()) validate.name = "name is require field ";
      if (!description) validate.description = "description is require field ";
      if (!categoryId) validate.categoryId = "categoryId is require field ";
      if (!price || price < 0) validate.price = "price is invalid ";
      if (!categoryName) validate.categoryName = "categoryName is required";
      if (!username) validate.username = "username is required";
      if (!uid) validate.uid = "uid is required";
      if (!location || !lat || !lng || !address.trim())
        validate.location = "location is invalid ";
      if (!image) validate.image = "spotlight image is invalid ";
      if (tag && tag.length > 5) validate.tag = "Tag limit 5";

      if (Object.keys(validate).length !== 0) {
        res.json({ status: false, error: validate });
        return;
      }
      let sql, result;
      let tagStr = tag.toString();
      //validate user
      sqlUser = `Select * from user where uid = ?`;
      let hasUser = await conn.query(sqlUser, [uid]);
      await conn.commit();
      if (hasUser[0].length < 1) {
        res.json({ status: false, error: "User Not Existed" });
        return;
      }
      //validate
      let sqlProduct = `select product.*,user.username,user.address AS userAddress,user.email,user.phone,user.avatar, category.name as categoryName, category.icon as categoryIcon 
      from user, product, category 
      where user.uid=product.uid and product.categoryId=category.id and product.deletedAt is null and product.id = ?`;

      result = await conn.query(sqlProduct, [idProduct]);
      let products = result[0];
      if (products.length < 1 || products[0].uid != uid) {
        const response = {
          status: false,
          message: "Product is not existed",
        };
        res.json(response);
        return;
      }
      let product = products[0];

      
      let h = updatedAt.getHours();
      let m = updatedAt.getMinutes();
      let s = updatedAt.getSeconds();
      let date = updatedAt.getDate();
      let month = updatedAt.getMonth() + 1 ;
      let year = updatedAt.getFullYear();
      let updatedAtString = `"${year}/${month}/${date}"`
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
        updatedAtString,
        tagStr,
        idProduct,
      ]);

      //update image
      await conn.query(
        "update image set deletedAt = ?, updatedAt = ? where productId = ?",
        [updatedAtString, updatedAtString, idProduct]
      );

      let imgQuery = await conn.query(
        "Select * from image where productId = ?",
        [idProduct]
      );
      await conn.commit();
      let imgs = imgQuery[0];
      for (let img of images) {
        if (imgs.filter((x) => x.url == img).length > 0) {
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
            updatedAtString,
            updatedAtString,
          ]);
          await conn.commit();
        }
      }

      //create notify to admin
      //get user
      let user = hasUser[0][0];
      let adminQuery = await conn.query(
        `select * from admin where deletedAt is null `
      );
      await conn.commit();
      let admins = adminQuery[0];
      let adminNotis = [];
      let title = `Người dùng ${user.username} đã sửa thông tin sản phẩm ${product.code}`;
      let content = `Người dùng ${user.username} đã sửa thông tin sản phẩm ${product.code} vào lúc ${h}:${m}:${s} ngày ${date}/${month}/${year}. Sản phẩm này đang chờ được duyệt`;
      for (let admin of admins) {
        adminNotis.push([admin.id, title, content]);
      }
      let sqlNoti = `INSERT INTO admin_notify ( admin_id, title, content) VALUES ?`;
      await conn.query(sqlNoti, [adminNotis]);
      await conn.commit();
      //update document in elasticsearch
      client.update({
        index: "products",
        type: "product",
        id: idProduct,
        body: {
          // put the partial document under the `doc` key
          doc: {
            name: name,
            id: idProduct,
            description: description,
            address: address,
            category: categoryName,
            tag: tagStr,
            username: username,
          },
        },
      });

      const response = {
        status: true,
        message: "success",
      };
      res.json(response);
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
      //validate idProduct
      if (!idProduct) {
        const response = {
          status: false,
          result: "idProduct is required",
        };
        res.json(response);
        return;
      }

      let date = deletedAt.getDate();
      let month = deletedAt.getMonth() + 1;
      let year = deletedAt.getFullYear();
      let deletedAtString = `"${year}/${month}/${date}"`;
      //delete
      sql = `update product 
             set deletedAt = ?, updatedAt = ?
             where product.id = ?`;
      result = await conn.query(sql, [deletedAt, deletedAt, idProduct]);
      await conn.commit();

      //delete image
      await conn.query(
        "update image set deletedAt = ?, updatedAt = ? where productId = ?",
        [deletedAtString, deletedAtString, idProduct]
      );
      await conn.commit();

      //delete in elasticsearch
      await client.delete({
        index: "products",
        type: "product",
        id: idProduct,
      });

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
      let sql, result;
      //validate
      let sqlProduct = `select product.*,user.username,user.address AS userAddress,user.email,user.phone,user.avatar, category.name as categoryName, category.icon as categoryIcon 
      from user, product, category 
      where user.uid=product.uid and product.categoryId=category.id and product.deletedAt is null and product.id = ?`;

      result = await conn.query(sqlProduct, [idProduct]);
      let products = result[0];
      if (products.length < 1) {
        const response = {
          status: false,
          message: "Product is not existed",
        };
        res.json(response);
        return;
      }
      let product = products[0];
      
      let h = updatedAt.getHours();
      let m = updatedAt.getMinutes();
      let s = updatedAt.getSeconds();
      let date = updatedAt.getDate();
      let month = updatedAt.getMonth() + 1;
      let year = updatedAt.getFullYear();
      let updatedAtString = `"${year}/${month}/${date}"`;
      //Active product
      sql = `update product 
             set status = "active",admin_id= ?, updatedAt = ?
             where product.id = ?`;
      result = await conn.query(sql, [idAdmin, updatedAtString, idProduct]);

      //Active image
      try {
        await conn.query(
          'update image set status = "active", updatedAt = ? where productId = ?',
          [updatedAtString, idProduct]
        );
      } catch (err) {
        console.log(err);
      }

      await conn.commit();

      //create user notify
      let title = `Kích hoạt sp ${product.id}`;
      let content = `Sản phẩm ${product.id} của bạn đã được kích hoạt vào lúc ${h}:${m}:${s} ngày ${date}/${month}/${year}.`;
      let sqlNoti = `INSERT INTO notify ( uid, title, content, productId) VALUES (?, ?, ?, ?)`;
      await conn.query(sqlNoti, [product.uid, title, content, idProduct]);
      await conn.commit();

      //create admin_notify
      let adminQuery = await conn.query(
        `select * from admin where deletedAt is null `
      );
      await conn.commit();
      let admins = adminQuery[0];
      let adminNotis = [];
      let titleAdmin = `Sản phẩm ${product.code}`;
      let contentAdmin = `Sản phẩm ${product.code} đã được kích hoạt vào lúc ${h}:${m}:${s} ngày ${date}/${month}/${year}.`;
      for (let admin of admins) {
        adminNotis.push([admin.id, titleAdmin, contentAdmin]);
      }
      let sqlAdminNoti = `INSERT INTO admin_notify ( admin_id, title, content) VALUES ?`;
      await conn.query(sqlAdminNoti, [adminNotis]);
      await conn.commit();

      const response = {
        status: true,
        message: "success",
      };
      res.json(response);
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  adminBanPost: async (req, res, next) => {
    let { idProduct, idAdmin } = req.body;
    console.log(idProduct, idAdmin);
    let updatedAt = new Date();
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      //validate
      let sqlProduct = `select product.*,user.username,user.address AS userAddress,user.email,user.phone,user.avatar, category.name as categoryName, category.icon as categoryIcon 
      from user, product, category 
      where user.uid=product.uid and product.categoryId=category.id and product.deletedAt is null and product.id = ?`;

      result = await conn.query(sqlProduct, [idProduct]);
      let products = result[0];
      if (products.length < 1) {
        const response = {
          status: false,
          message: "Product is not existed",
        };
        res.json(response);
        return;
      }
      let product = products[0];
      let h = updatedAt.getHours();
      let m = updatedAt.getMinutes();
      let s = updatedAt.getSeconds();
      let date = updatedAt.getDate();
      let month = updatedAt.getMonth() + 1;
      let year = updatedAt.getFullYear();
      let updatedAtString = `"${year}/${month}/${date}"`;
      //Active product
      sql = `update product 
             set status = "ban",admin_id= ?, updatedAt = ?
             where product.id = ?`;
      result = await conn.query(sql, [idAdmin, updatedAtString, idProduct]);

      //Active image
      try {
        await conn.query(
          'update image set status = "ban", updatedAt = ? where productId = ?',
          [updatedAtString, idProduct]
        );
      } catch (err) {
        console.log(err);
      }

      await conn.commit();

      //create user notify
      let title = `Gỡ sản phẩm ${product.id}`;
      let content = `Sản phẩm ${product.id} của bạn đã bị cấm đăng lên vào lúc ${h}:${m}:${s} ngày ${date}/${month}/${year}.`;
      let sqlNoti = `INSERT INTO notify ( uid, title, content, productId) VALUES (?, ?, ?, ?)`;
      await conn.query(sqlNoti, [product.uid, title, content, idProduct]);
      await conn.commit();

      //create admin_notify
      let adminQuery = await conn.query(
        `select * from admin where deletedAt is null `
      );
      await conn.commit();
      let admins = adminQuery[0];
      let adminNotis = [];
      let titleAdmin = `Sản phẩm ${product.code}`;
      let contentAdmin = `Sản phẩm ${product.code} đã bị cấm đăng lên vào lúc ${h}:${m}:${s} ngày ${date}/${month}/${year}.`;
      for (let admin of admins) {
        adminNotis.push([admin.id, titleAdmin, contentAdmin]);
      }
      let sqlAdminNoti = `INSERT INTO admin_notify ( admin_id, title, content) VALUES ?`;
      await conn.query(sqlAdminNoti, [adminNotis]);
      await conn.commit();

      const response = {
        status: true,
        message: "success",
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
      { limit = 50, offset = 0, uid } = req.body;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      sql = `select product.*,user.username,user.address AS userAddress,user.email,user.phone,user.avatar, category.name as categoryName, category.icon as categoryIcon 
      from user, product, category 
      where product.deletedAt is null and user.uid=product.uid and product.categoryId=category.id and product.uid = ?`;
      result = await conn.query(sql, [uid]);
      await conn.commit();
      let products = result[0];
      // let skip = Number(offset > 0 ? offset : 0) * Number(limit);
      // let productResult = products.slice(skip, skip + Number(limit));

      const response = {
        total: products.length,
        //page: Number(offset) + 1,
        result: products,
      };
      res.json(response);
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  filterActiveProduct: async (req, res, next) => {
    let conn;
    let {
      search,
      categoryId = [],
      minPrice,
      maxPrice,
      minQuantity,
      maxQuantity,
      maxLike,
      maxView,
      minLike,
      minView,
      orderByDate,
      orderByLike,
      orderByView,
      orderByQuantity,
      orderByPrice,
      orderByDistance,
      distance,
      lat,
      lng,
    } = req.body;
    try {
      //Get all product
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql,
        result,
        error = [];
      sql = `select product.*,user.uid, user.username, user.address AS userAddress, user.email, user.phone, user.avatar, category.name AS categoryName, category.icon as iconCategory
      from category, product, user
      where product.status ="active" and product.deletedAt is null AND user.uid = product.uid AND category.id=product.categoryId`;
      result = await conn.query(sql);
      await conn.commit();
      let product = result[0];
      //search
      if (search) {
        let bodyQuery = {
          size: 10000,
          from: 0,
          query: {
            bool: {
              should: [
                {
                  match: {
                    name: search.trim(),
                  },
                },
                {
                  match: {
                    description: search.trim(),
                  },
                },
                {
                  match: {
                    address: search.trim(),
                  },
                },
                {
                  match: {
                    username: search.trim(),
                  },
                },
                {
                  match: {
                    category: search.trim(),
                  },
                },
                {
                  match: {
                    tag: search.trim(),
                  },
                },
              ],
            },
          },
        };
        let responseQuery = await client.search({
          index: "products",
          body: bodyQuery,
          type: "product",
        });
        productElastic = responseQuery.hits.hits;
        var num = [];
        for (let p of productElastic) {
          num.push(p._source.id);
        }
        product = product.filter((p) => num.includes(p.id));
      }
      //search by category
      if (categoryId.length > 0) {
        product = product.filter((x) => categoryId.includes(x.categoryId));
      }
      if (minPrice) {
        product = product.filter((x) => x.price >= minPrice);
      }
      if (maxPrice) {
        product = product.filter((x) => x.price <= maxPrice);
      }
      // if (minQuantity) {
      //   product = product.filter((x) => x.quantity >= minQuantity);
      // }
      // if (maxQuantity) {
      //   product = product.filter((x) => x.quantity <= maxQuantity);
      // }
      // if (minView) {
      //   product = product.filter((x) => x.view >= minView);
      // }
      // if (maxView) {
      //   product = product.filter((x) => x.view <= maxPrice);
      // }
      // if (minLike) {
      //   product = product.filter((x) => x.like_num >= minLike);
      // }
      // if (maxLike) {
      //   product = product.filter((x) => x.like_num <= maxLike);
      // }
      //search by distance
      if (lat && lng) {
        let R = 6371; //km
        product.forEach((x) => {
          let dLat = (lat - x.lat) * (Math.PI / 180);
          let dLon = (lng - x.lng) * (Math.PI / 180);
          let lat1 = x.lat * (Math.PI / 180);
          let lat2 = lat * (Math.PI / 180);
          let a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) *
              Math.sin(dLon / 2) *
              Math.cos(lat1) *
              Math.cos(lat2);
          let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          x.distance = Math.round(R * c * 100) / 100;
        });
        if (distance) {
          product = product.filter((p) => p.distance < distance);
        }
        product = product.sort(function (a, b) {
          return a.distance - b.distance;
        });
        // if (orderByDistance) {
        //   if (orderByDistance == "desc") {
        //     product = product.sort(function (a, b) {
        //       return b.distance - a.distance;
        //     });
        //   } else {
        //     product = product.sort(function (a, b) {
        //       return a.distance - b.distance;
        //     });
        //   }
        // }
      }
      //sort
      if (orderByDate) {
        if (orderByDate == "desc") {
          product = product.sort(function (a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
        } else {
          product = product.sort(function (a, b) {
            return new Date(a.createdAt) - new Date(b.createdAt);
          });
        }
      }
      if (orderByLike) {
        if (orderByLike == "desc") {
          product = product.sort(function (a, b) {
            return b.like_num - a.like_num;
          });
        } else {
          product = product.sort(function (a, b) {
            return a.like_num - b.like_num;
          });
        }
      }
      if (orderByQuantity) {
        if (orderByQuantity == "desc") {
          product = product.sort(function (a, b) {
            return b.quantity - a.quantity;
          });
        } else {
          product = product.sort(function (a, b) {
            return a.quantity - b.quantity;
          });
        }
      }
      if (orderByView) {
        if (orderByView == "desc") {
          product = product.sort(function (a, b) {
            return b.view - a.view;
          });
        } else {
          product = product.sort(function (a, b) {
            return a.view - b.view;
          });
        }
      }
      if (orderByPrice) {
        if (orderByPrice == "desc") {
          product = product.sort(function (a, b) {
            return b.price - a.price;
          });
        } else {
          product = product.sort(function (a, b) {
            return a.price - b.price;
          });
        }
      }
      const response = {
        status: 1,
        length: product.length,
        result: product,
      };
      res.json(response);
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  adminFilterAllProduct: async (req, res, next) => {
    let conn;
    let {
      search,
      categoryId = [],
      sort = "createdAt",
      type = "desc",
      limit = 10,
      offset = 0,
    } = req.body;
    try {
      console.log(sort, type);
      //Get all product
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;

      sql = `select product.*,user.uid, user.username, user.address AS userAddress, user.email, user.phone, user.avatar, category.name AS categoryName, category.icon as iconCategory
      from category, product, user 
      where product.deletedAt is null AND user.uid = product.uid AND category.id=product.categoryId`;
      result = await conn.query(sql);
      await conn.commit();
      let product = result[0];

      //search
      if (search) {
        let bodyQuery = {
          size: 10000,
          from: 0,
          query: {
            bool: {
              should: [
                {
                  match: {
                    name: search.trim(),
                  },
                },
                {
                  match: {
                    description: search.trim(),
                  },
                },
                {
                  match: {
                    address: search.trim(),
                  },
                },
                {
                  match: {
                    username: search.trim(),
                  },
                },
                {
                  match: {
                    category: search.trim(),
                  },
                },
                {
                  match: {
                    tag: search.trim(),
                  },
                },
              ],
            },
          },
        };
        let responseQuery = await client.search({
          index: "products",
          body: bodyQuery,
          type: "product",
        });
        productElastic = responseQuery.hits.hits;
        var num = [];
        for (let p of productElastic) {
          num.push(p._source.id);
        }
        product = product.filter((p) => num.includes(p.id));
      }
      //search by category
      if (categoryId.length > 0) {
        product = product.filter((x) => categoryId.includes(x.categoryId));
      }

      // sort
      if (sort == "price") {
        product = product.sort((a, b) => {
          if (type == "asc") return a.price < b.price;
          return a.price > b.price;
        });
      }
      if (sort == "quantity") {
        product = product.sort((a, b) => {
          if (type == "asc") return a.quantity < b.quantity;
          return a.quantity > b.quantity;
        });
      }
      if (sort == "view") {
        product = product.sort((a, b) => {
          if (type == "asc") return a.view < b.view;
          return a.view > b.view;
        });
      }
      if (sort == "like_num") {
        product = product.sort((a, b) => {
          if (type == "asc") return a.like_num < b.like_num;
          return a.like_num > b.like_num;
        });
      }
      if (sort == "category") {
        product = product.sort((a, b) => {
          if (type == "asc") return a.category.localeCompare(b.category);
          return !a.category.localeCompare(b.category);
        });
      }
      if (sort == "status") {
        product = product.sort((a, b) => {
          if (type == "asc") return a.status.localeCompare(b.status);
          return !a.status.localeCompare(b.status);
        });
      }
      if (sort == "createdAt") {
        product = product.sort((a, b) => {
          if (type == "asc")
            return new Date(a.createdAt) - new Date(b.createdAt);
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
      }

      let skip = Number(offset > 0 ? offset : 0) * Number(limit);
      let productResult = product.slice(skip, skip + Number(limit));
      const response = {
        status: true,
        total: product.length,
        page: Number(offset) + 1,
        result: productResult,
      };
      res.json(response);
    } catch (err) {
      res.json({
        status: false,
        message: "Get product failed",
        result: {},
      });
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  getListBookmark: async (req, res, next) => {
    let conn;
    let { uid, idCategory } = req.params;
    try {
      conn = await dbs.getConnection();
      if (!uid) {
        const response = {
          status: false,
          message: "Bad request",
        };
        res.json(response);
        return;
      }
      await conn.beginTransaction();
      let r = await conn.query(
        `select * from product, user, bookmark  where bookmark.uid = ? and product.id= bookmark.productId and bookmark.uid=user.uid order by bookmark.id desc`,
        [uid]
      );
      await conn.commit;
      let result = r[0];
      if (idCategory != "all") {
        result = result.filter((res) => res.categoryId == idCategory);
      }

      const response = {
        status: true,
        message: "Get list bookmark success",
        data: result,
      };
      res.json(response);
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  createBookmark: async (req, res, next) => {
    let conn;
    let { uid, productId } = req.body;
    try {
      //validate
      if (!uid || !productId) {
        const response = {
          status: false,
          message: "uid or productId is required",
        };
        res.json(response);
        return;
      }
      conn = await dbs.getConnection();
      await conn.beginTransaction();

      //check if bookmark is existed
      let r = await conn.query(
        `select * from bookmark where uid = ? AND productId = ?`,
        [uid, productId]
      );
      await conn.commit;
      let bookmark = r[0];
      if (bookmark.length > 0) {
        const response = {
          status: false,
          message: "Bookmark is existed",
        };
        res.json(response);
        return;
      }

      //create bookmark and update like_num in product
      let sql;
      sql = `INSERT INTO bookmark ( uid, productId) VALUES (?, ?)`;
      await conn.query(sql, [uid, productId]);
      await conn.query(
        `update product set like_num = like_num+1 where id=? AND status='active'`,
        [productId]
      );
      await conn.commit();

      const response = {
        status: true,
        message: "success",
      };
      res.json(response);
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  deleteBookmark: async (req, res, next) => {
    let conn;
    let { uid, productId } = req.body;
    try {
      //validate
      if (!uid || !productId) {
        const response = {
          status: false,
          message: "uid or productId is required",
        };
        res.json(response);
        return;
      }
      conn = await dbs.getConnection();
      await conn.beginTransaction();

      //check if bookmark is existed
      let r = await conn.query(
        `select * from bookmark where uid = ? AND productId = ?`,
        [uid, productId]
      );
      await conn.commit;
      let bookmark = r[0];
      if (bookmark.length < 1) {
        const response = {
          status: false,
          message: "Bookmark is not existed",
        };
        res.json(response);
        return;
      }

      //delete bookmark and update like_num in product
      let sql;
      sql = `delete from bookmark where uid = ? AND productId = ?`;
      await conn.query(sql, [uid, productId]);
      await conn.query(
        `update product set like_num = like_num - 1 where id=? AND status='active'`,
        [productId]
      );
      await conn.commit();

      const response = {
        status: true,
        message: "success",
      };
      res.json(response);
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  adminGetAllComment: async (req, res, next) => {
    let conn,
      { limit = 10, offset = 0 } = req.query;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      sql = `select c.*, 
      op.id AS order_id, op.quantity,
      ub.username as buyerUsername, ub.avatar buyerAvatar, ub.address buyerAddress, ub.email buyerEmail, 
      p.name, p.image, p.price, p.uid sellerUid, 
      us.username sellerUsername, us.avatar sellerAvatar, us.address sellerAddress, us.email sellerEmail
      from comment c, order_product op, user ub, user us, product p
      where c.orderId = op.id and ub.uid = op.uid and p.id = op.product_id and us.uid = p.uid and op.status = 'accepted'`;
      result = await conn.query(sql);
      await conn.commit();
      let comments = result[0];
      let skip = Number(offset > 0 ? offset : 0) * Number(limit);
      let commentResult = comments.slice(skip, skip + Number(limit));

      const response = {
        total: comments.length,
        page: Number(offset) + 1,
        result: commentResult,
      };

      res.json(response);
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  adminGetCommentDetail: async (req, res, next) => {
    let conn,
      { idComment, idAdmin } = req.query;
    try {
      //validate
      if (!idComment || !idAdmin) {
        const response = {
          status: false,
          message: "idComment or idAdmin is required",
        };

        res.json(response);
        return;
      }
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      sql = `select c.*, 
      op.id AS order_id, op.quantity,
      ub.username as buyerUsername, ub.avatar buyerAvatar, ub.address buyerAddress, ub.email buyerEmail, 
      p.name, p.image, p.price, p.uid sellerUid, 
      us.username sellerUsername, us.avatar sellerAvatar, us.address sellerAddress, us.email sellerEmail
      from comment c, order_product op, user ub, user us, product p
      where c.orderId = op.id and ub.uid = op.uid and p.id = op.product_id and us.uid = p.uid and op.status = 'accepted' and c.id = ?`;
      result = await conn.query(sql, [idComment]);
      await conn.commit();
      let comment = result[0];
      if (comment.length < 1) {
        const response = {
          status: false,
          message: "Comment is not existed",
        };

        res.json(response);
        return;
      }

      const response = {
        status: true,
        result: comment[0],
      };

      res.json(response);
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  changeStatusComment: async (req, res, next) => {
    let conn;
    let { idComment, status } = req.body;
    try {
      if (!idComment) {
        const response = {
          status: false,
          message: "Bad request",
        };
        res.json(response);
        return;
      }
      let updatedAt = new Date()
      let date = updatedAt.getDate();
      let month = updatedAt.getMonth() + 1;
      let year = updatedAt.getFullYear();
      let updatedAtString = `"${year}/${month}/${date}"`;
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql;
      sql = `update comment set status=?, updatedAt=? where id = ?`;
      await conn.query(sql, [status, updatedAtString, idComment]);
      await conn.commit();

      const response = {
        status: true,
        result: `Update Comment ${idComment} success`,
      };
      res.json(response);
    } catch (err) {
      await conn.rollback();
      next(err);
      res.json({
        status: false,
        message: "Can't update comment",
      });
    } finally {
      await conn.release();
    }
  },
  getTopProductNew: async (req, res, next) => {
    let conn = await dbs.getConnection();
    try {
      await conn.beginTransaction();
      let sql, result;
      let { lat, lng, range } = req.query;
      sql = `select product.*,user.username,user.address AS userAddress,user.email,user.phone,user.avatar, category.name as categoryName, category.icon as categoryIcon 
      from user, product, category 
      where product.status ="active" and user.uid=product.uid and product.categoryId=category.id and product.deletedAt is null order by product.id desc`;

      result = await conn.query(sql);
      await conn.commit();
      let product = result[0];
      let productResult = product
        .filter(
          (p) =>
            (new Date() - new Date(p?.createdAt)) / (24 * 60 * 60 * 1000) > 21
        )
        .slice(0, product.length > 20 ? 20 : product.length);

      if (lat && lng) {
        let R = 6371; //km
        productResult.forEach((x) => {
          let dLat = (lat - x.lat) * (Math.PI / 180);
          let dLon = (lng - x.lng) * (Math.PI / 180);
          let lat1 = x.lat * (Math.PI / 180);
          let lat2 = lat * (Math.PI / 180);
          let a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) *
              Math.sin(dLon / 2) *
              Math.cos(lat1) *
              Math.cos(lat2);
          let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          x.distance = Math.round(R * c * 100) / 100;
        });
      }

      if (range) {
        productResult = productResult.filter((p) => p.distance < range);
      }

      const response = {
        status: true,
        result: productResult,
      };
      res.json(response);
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  getTopSearch: async (req, res, next) => {
    let conn = await dbs.getConnection();
    try {
      await conn.beginTransaction();
      let sql, result;
      let { lat, lng, range } = req.query;
      sql = `select product.*,user.username,user.address AS userAddress,user.email,user.phone,user.avatar, category.name as categoryName, category.icon as categoryIcon 
      from user, product, category 
      where product.status ="active" and user.uid=product.uid and product.categoryId=category.id and product.deletedAt is null order by product.view desc`;

      result = await conn.query(sql);
      await conn.commit();
      let productResult = result[0];

      if (lat && lng) {
        let R = 6371; //km
        productResult.forEach((x) => {
          let dLat = (lat - x.lat) * (Math.PI / 180);
          let dLon = (lng - x.lng) * (Math.PI / 180);
          let lat1 = x.lat * (Math.PI / 180);
          let lat2 = lat * (Math.PI / 180);
          let a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) *
              Math.sin(dLon / 2) *
              Math.cos(lat1) *
              Math.cos(lat2);
          let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          x.distance = Math.round(R * c * 100) / 100;
        });
      }

      if (range) {
        productResult = productResult.filter((p) => p.distance < range);
      }

      const response = {
        status: true,
        result: productResult.slice(0, 30),
      };
      res.json(response);
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  listSimilarProduct: async (req, res, next) => {
    let conn,
      { limit = 10, offset = 0 } = req.query;
    let { idProduct } = req.body;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result, count, total;
      //get subcategory id
      sql = `select * from product where id = ?`;
      result = await conn.query(sql, [idProduct]);
      await conn.commit();
      let product = result[0][0];
      let idSubcategory = [product.subcategoryId];
      let idCategory = [product.categoryId];

      let sqlProducts = `select product.*,user.uid, user.username, user.address AS userAddress, user.email, user.phone, user.avatar, category.name AS categoryName, category.icon as iconCategory
      from category, product, user
      where product.status ="active" and product.deletedAt is null AND user.uid = product.uid AND category.id=product.categoryId`;
      let resultProducts = await conn.query(sqlProducts);
      await conn.commit();
      let AllProducts = resultProducts[0];
      let SimilarProducts =
        idSubcategory[0] != null
          ? AllProducts.filter((x) => idSubcategory.includes(x.subcategoryId))
          : AllProducts.filter((x) => idCategory.includes(x.categoryId));
      let skip = Number(offset > 0 ? offset : 0) * Number(limit);
      let productResult = SimilarProducts.slice(skip, skip + Number(limit));

      const response = {
        total: SimilarProducts.length,
        page: Number(offset) + 1,
        result: productResult,
      };
      res.json(response);
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  ListActiveCommentOfProduct: async (req, res, next) => {
    let conn,
      { limit = 10, offset = 0 } = req.query,
      { idProduct } = req.body;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      sql = `select c.*, 
      ub.username as buyerUsername, ub.avatar buyerAvatar, ub.address buyerAddress, ub.email buyerEmail
      from comment c, order_product op, user ub
      where c.orderId = op.id and ub.uid = op.uid and c.status = 'active' and op.product_id = ?`;
      result = await conn.query(sql, [idProduct]);
      await conn.commit();
      let comments = result[0];
      let skip = Number(offset > 0 ? offset : 0) * Number(limit);
      let commentResult = comments.slice(skip, skip + Number(limit));

      const response = {
        total: comments.length,
        page: Number(offset) + 1,
        result: commentResult,
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
