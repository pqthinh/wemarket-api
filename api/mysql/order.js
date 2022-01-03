const dbs = require("./dbs");

const Order = {
  getListOrderOfSeller: async (req, res, next) => {
    let conn;
    let { orderByDate, orderByQuantity, orderByStatus, uid } = req.body;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      //validate
      if (!uid) {
        const response = {
          status: false,
          message: "uid is required",
        };
        res.json(response);
        return;
      }
      sql = `select op.*, ub.username as buyerUsername, ub.avatar buyerAvatar, ub.address buyerAddress, ub.email buyerEmail,
            p.name, p.quantity productQuantity, p.image, p.price, p.uid sellerUid, 
            us.username sellerUsername, us.avatar sellerAvatar, us.address sellerAddress, us.email sellerEmail
            from order_product op, user ub, user us, product p
            where ub.uid = op.uid and p.id = op.product_id and us.uid = p.uid and p.uid = ? and op.deletedAt is null`;
      result = await conn.query(sql, [uid]);
      await conn.commit();
      let order = result[0];

      if (orderByDate) {
        if (orderByDate == "desc") {
          order = order.sort(function (a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
        } else {
          order = order.sort(function (a, b) {
            return new Date(a.createdAt) - new Date(b.createdAt);
          });
        }
      }
      if (orderByQuantity) {
        if (orderByQuantity == "desc") {
          order = order.sort(function (a, b) {
            return b.quantity - a.quantity;
          });
        } else {
          order = order.sort(function (a, b) {
            return a.quantity - b.quantity;
          });
        }
      }
      //sort by status
      if (orderByStatus) {
        if (orderByStatus == "desc") {
          order = order.sort(function (a, b) {
            return b.status.localeCompare(a.status);
          });
        } else {
          order = order.sort(function (a, b) {
            return a.status.localeCompare(b.status);
          });
        }
      }

      const response = {
        status: 1,
        total: order.length,
        result: order,
      };
      res.json(response);
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  getListOrderOfBuyer: async (req, res, next) => {
    let conn;
    let { orderByDate, orderByQuantity, orderByStatus, uid } = req.body;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      //validate
      if (!uid) {
        const response = {
          status: false,
          message: "uid is required",
        };
        res.json(response);
        return;
      }
      sql = `select op.*, ub.username as buyerUsername, ub.avatar buyerAvatar, ub.address buyerAddress, ub.email buyerEmail,
            p.name, p.quantity productQuantity, p.image, p.price, p.uid sellerUid, 
            us.username sellerUsername, us.avatar sellerAvatar, us.address sellerAddress, us.email sellerEmail
            from order_product op, user ub, user us, product p
            where ub.uid = op.uid and p.id = op.product_id and us.uid = p.uid and op.uid = ? and op.deletedAt is null`;
      result = await conn.query(sql, [uid]);
      await conn.commit();
      let order = result[0];

      if (orderByDate) {
        if (orderByDate == "desc") {
          order = order.sort(function (a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
        } else {
          order = order.sort(function (a, b) {
            return new Date(a.createdAt) - new Date(b.createdAt);
          });
        }
      }
      if (orderByQuantity) {
        if (orderByQuantity == "desc") {
          order = order.sort(function (a, b) {
            return b.quantity - a.quantity;
          });
        } else {
          order = order.sort(function (a, b) {
            return a.quantity - b.quantity;
          });
        }
      }
      //sort by status
      if (orderByStatus) {
        if (orderByStatus == "desc") {
          order = order.sort(function (a, b) {
            return b.status.localeCompare(a.status);
          });
        } else {
          order = order.sort(function (a, b) {
            return a.status.localeCompare(b.status);
          });
        }
      }

      const response = {
        status: 1,
        total: order.length,
        result: order,
      };
      res.json(response);
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  getListPendingOrderOfBuyer: async (req, res, next) => {
    let conn;
    let { orderByDate, orderByQuantity, orderByStatus, uid } = req.body;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      //validate
      if (!uid) {
        const response = {
          status: false,
          message: "uid is required",
        };
        res.json(response);
        return;
      }
      sql = `select op.*, ub.username as buyerUsername, ub.avatar buyerAvatar, ub.address buyerAddress, ub.email buyerEmail,
            p.name, p.quantity productQuantity, p.image, p.price, p.uid sellerUid, 
            us.username sellerUsername, us.avatar sellerAvatar, us.address sellerAddress, us.email sellerEmail
            from order_product op, user ub, user us, product p
            where ub.uid = op.uid and p.id = op.product_id and us.uid = p.uid and op.uid = ? and op.deletedAt is null and op.status = 'pending'`;
      result = await conn.query(sql, [uid]);
      await conn.commit();
      let order = result[0];

      if (orderByDate) {
        if (orderByDate == "desc") {
          order = order.sort(function (a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
        } else {
          order = order.sort(function (a, b) {
            return new Date(a.createdAt) - new Date(b.createdAt);
          });
        }
      }
      if (orderByQuantity) {
        if (orderByQuantity == "desc") {
          order = order.sort(function (a, b) {
            return b.quantity - a.quantity;
          });
        } else {
          order = order.sort(function (a, b) {
            return a.quantity - b.quantity;
          });
        }
      }
      //sort by status
      if (orderByStatus) {
        if (orderByStatus == "desc") {
          order = order.sort(function (a, b) {
            return b.status.localeCompare(a.status);
          });
        } else {
          order = order.sort(function (a, b) {
            return a.status.localeCompare(b.status);
          });
        }
      }

      const response = {
        status: 1,
        total: order.length,
        result: order,
      };
      res.json(response);
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  BuyerGetOrderDetail: async (req, res, next) => {
    let conn,
      { idOrder, uid } = req.query;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      //validate
      if (!uid || !idOrder) {
        const response = {
          status: false,
          message: "uid and idOrder is required",
        };
        res.json(response);
        return;
      }
      sql = `select op.*, ub.username as buyerUsername, ub.avatar buyerAvatar, ub.address buyerAddress, ub.email buyerEmail,
            p.name, p.quantity productQuantity, p.image, p.price, p.uid sellerUid, 
            us.username sellerUsername, us.avatar sellerAvatar, us.address sellerAddress, us.email sellerEmail
            from order_product op, user ub, user us, product p
            where ub.uid = op.uid and p.id = op.product_id and us.uid = p.uid and op.uid = ? and op.id = ? and op.deletedAt is null`;
      result = await conn.query(sql, [uid, idOrder]);
      await conn.commit();
      //check if existed
      if (result[0].length < 1) {
        const response = {
          status: false,
          message: "Order is not existed or is deleted",
        };
        res.json(response);
        return;
      }
      let order = result[0][0];

      const response = {
        status: true,
        result: order,
      };
      res.json(response);
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  SellerGetOrderDetail: async (req, res, next) => {
    let conn,
      { idOrder, uid } = req.query;
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      //validate
      if (!uid || !idOrder) {
        const response = {
          status: false,
          message: "uid and idOrder is required",
        };
        res.json(response);
        return;
      }
      sql = `select op.*, ub.username as buyerUsername, ub.avatar buyerAvatar, ub.address buyerAddress, ub.email buyerEmail,
            p.name, p.quantity productQuantity, p.image, p.price, p.uid sellerUid, 
            us.username sellerUsername, us.avatar sellerAvatar, us.address sellerAddress, us.email sellerEmail
            from order_product op, user ub, user us, product p
            where ub.uid = op.uid and p.id = op.product_id and us.uid = p.uid and p.uid = ? and op.id = ? and op.deletedAt is null`;
      result = await conn.query(sql, [uid, idOrder]);
      await conn.commit();
      //check if existed
      if (result[0].length < 1) {
        const response = {
          status: false,
          message: "Order is not existed or is deleted",
        };
        res.json(response);
        return;
      }
      let order = result[0][0];

      const response = {
        status: true,
        result: order,
      };
      res.json(response);
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      await conn.release();
    }
  },
  BuyerCreateOrder: async (req, res, next) => {
    let conn;
    let { productId, uid } = req.body;
    let createdAt = new Date();
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql;
      //validate
      if (!uid || !productId) {
        const response = {
          status: false,
          message: "uid and productId is required",
        };
        res.json(response);
        return;
      }
      //validate product
      let productSql = `select product.*,user.username,user.address AS userAddress,user.email,user.phone,user.avatar 
            from user, product
            where product.status ="active" and user.uid=product.uid and product.deletedAt is null and product.id = ?`;
      let query = await conn.query(productSql, [productId]);
      await conn.commit();
      let products = query[0];
      if (products.length == 0) {
        const response = {
          status: false,
          message: "Product is not existed",
        };
        res.json(response);
        return;
      }
      let product = products[0];

      //validate user
      let sqlUser = `Select * from user where uid = ?`;
      let hasUser = await conn.query(sqlUser, [uid]);
      await conn.commit();

      if (hasUser[0].length < 1) {
        res.json({ error: "User Not Existed" });
        return;
      }
      let user = hasUser[0][0];

      // check order exits
      let hasOrder = await conn.query(
        "select * from order_product where uid=?, product_id=?",
        [uid, productId]
      );
      await conn.commit();
      if (hasOrder[0].length < 1) {
        res.json({ error: "Order exited", status: 0 });
        return;
      }

      //create order
      sql = `INSERT INTO order_product (uid, product_id, createdAt, updatedAt, status) VALUES (?, ?, ?, ?, "pending")`;
      result = await conn.query(sql, [uid, productId, createdAt, createdAt]);
      await conn.commit();

      //create notify
      let h = createdAt.getHours();
      let m = createdAt.getMinutes();
      let s = createdAt.getSeconds();
      let date = createdAt.getDate();
      let month = createdAt.getMonth() + 1;
      let year = createdAt.getFullYear();
      let title = `Yêu cầu đặt hàng ${product.id}`;
      let content = `Người dùng ${user.username} đã yêu cầu mua sản phẩm ${product.id} vào lúc ${h}:${m}:${s} ngày ${date}/${month}/${year}. Yêu cầu này đang chờ được chấp nhận`;
      let sqlNoti = `INSERT INTO notify ( uid,productId, title, content) VALUES (?,?, ?, ?)`;
      await conn.query(sqlNoti, [product.uid, productId, title, content]);
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
  SellerAcceptOrder: async (req, res, next) => {
    let conn;
    let { idOrder, uid, quantity } = req.body;
    let updatedAt = new Date();
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      //validate
      if (!uid || !idOrder || !quantity) {
        const response = {
          status: false,
          message: "uid, idOrder, quantity is required",
        };
        res.json(response);
        return;
      }
      //get order
      sql = `select op.*, ub.username as buyerUsername, ub.avatar buyerAvatar, ub.address buyerAddress, ub.email buyerEmail,
            p.code, p.name, p.quantity productQuantity, p.image, p.price, p.uid sellerUid, p.status productStatus,
            us.username sellerUsername, us.avatar sellerAvatar, us.address sellerAddress, us.email sellerEmail
            from order_product op, user ub, user us, product p
            where ub.uid = op.uid and p.id = op.product_id and us.uid = p.uid and p.uid = ? and op.id = ? and op.deletedAt is null`;
      result = await conn.query(sql, [uid, idOrder]);
      await conn.commit();
      //check if order existed
      if (result[0].length < 1) {
        const response = {
          status: false,
          message: "Order is not existed or is deleted",
        };
        res.json(response);
        return;
      }
      let order = result[0][0];
      //validate quantity
      if (quantity > order.productQuantity) {
        const response = {
          status: false,
          message: "Quantity is invalid",
        };
        res.json(response);
        return;
      }
      //accept order
      let sqlUpdate = `update order_product 
            set updatedAt = ?, quantity = ?, status = "accepted"
            where id = ?`;
      result = await conn.query(sqlUpdate, [updatedAt, quantity, idOrder]);
      await conn.commit();

      //update product
      let newQuantity = order.productQuantity - quantity;
      let newStatus = newQuantity == 0 ? "sold out" : order.productStatus;
      let sqlUpdateProduct = `update product 
            set quantity = ?, status = ?, updatedAt = ?
            where id = ?`;
      result = await conn.query(sqlUpdateProduct, [
        newQuantity,
        newStatus,
        updatedAt,
        order.product_id,
      ]);
      await conn.commit();
      //create notify
      let h = updatedAt.getHours();
      let m = updatedAt.getMinutes();
      let s = updatedAt.getSeconds();
      let date = updatedAt.getDate();
      let month = updatedAt.getMonth() + 1;
      let year = updatedAt.getFullYear();
      let title = `Xác nhận đặt hàng ${order.code}`;
      let content = `Người dùng ${order.sellerUsername} đã chấp nhận yêu cầu mua sản phẩm ${order.code} của bạn vào lúc ${h}:${m}:${s} ngày ${date}/${month}/${year}.`;
      let sqlNoti = `INSERT INTO notify ( uid, title, content) VALUES (?, ?, ?)`;
      await conn.query(sqlNoti, [order.uid, title, content]);
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
  SellerUpdateOrder: async (req, res, next) => {
    let conn;
    let { idOrder, uid, quantity } = req.body;
    let updatedAt = new Date();
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      //validate
      if (!uid || !idOrder || !quantity) {
        const response = {
          status: false,
          message: "uid, idOrder, quantity is required",
        };
        res.json(response);
        return;
      }
      //get order
      sql = `select op.*, ub.username as buyerUsername, ub.avatar buyerAvatar, ub.address buyerAddress, ub.email buyerEmail,
            p.code, p.name, p.quantity productQuantity, p.image, p.price, p.uid sellerUid, p.status productStatus,
            us.username sellerUsername, us.avatar sellerAvatar, us.address sellerAddress, us.email sellerEmail
            from order_product op, user ub, user us, product p
            where ub.uid = op.uid and p.id = op.product_id and us.uid = p.uid and p.uid = ? and op.id = ? and op.deletedAt is null and op.status = "accepted"`;
      result = await conn.query(sql, [uid, idOrder]);
      await conn.commit();
      //check if order existed
      if (result[0].length < 1) {
        const response = {
          status: false,
          message: "Order is not existed or is deleted",
        };
        res.json(response);
        return;
      }
      let order = result[0][0];
      //validate quantity
      let totalQuantity = order.productQuantity + order.quantity;
      if (quantity > totalQuantity) {
        const response = {
          status: false,
          message: "Quantity is invalid",
        };
        res.json(response);
        return;
      }
      //update order
      let sqlUpdate = `update order_product 
            set updatedAt = ?, quantity = ?
            where id = ?`;
      result = await conn.query(sqlUpdate, [updatedAt, quantity, idOrder]);
      await conn.commit();

      //update product
      let newQuantity = order.productQuantity - quantity;
      let newStatus = newQuantity == 0 ? "sold out" : order.productStatus;
      let sqlUpdateProduct = `update product 
            set quantity = ?, status = ?, updatedAt = ?
            where id = ?`;
      result = await conn.query(sqlUpdateProduct, [
        newQuantity,
        newStatus,
        updatedAt,
        order.product_id,
      ]);
      await conn.commit();
      //create notify
      let h = updatedAt.getHours();
      let m = updatedAt.getMinutes();
      let s = updatedAt.getSeconds();
      let date = updatedAt.getDate();
      let month = updatedAt.getMonth() + 1;
      let year = updatedAt.getFullYear();
      let title = `Cập nhật đơn hàng ${order.code}`;
      let content = `Người dùng ${order.sellerUsername} đã sửa yêu cầu mua sản phẩm ${order.code} của bạn vào lúc ${h}:${m}:${s} ngày ${date}/${month}/${year}.`;
      let sqlNoti = `INSERT INTO notify ( uid, title, content) VALUES (?, ?, ?)`;
      await conn.query(sqlNoti, [order.uid, title, content]);
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
  SellerDeclineOrder: async (req, res, next) => {
    let conn;
    let { idOrder, uid } = req.body;
    let updatedAt = new Date();
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;
      //validate
      if (!uid || !idOrder) {
        const response = {
          status: false,
          message: "uid, idOrder is required",
        };
        res.json(response);
        return;
      }
      //get order
      sql = `select op.*, ub.username as buyerUsername, ub.avatar buyerAvatar, ub.address buyerAddress, ub.email buyerEmail,
            p.code, p.name, p.quantity productQuantity, p.image, p.price, p.uid sellerUid, 
            us.username sellerUsername, us.avatar sellerAvatar, us.address sellerAddress, us.email sellerEmail
            from order_product op, user ub, user us, product p
            where ub.uid = op.uid and p.id = op.product_id and us.uid = p.uid and p.uid = ? and op.id = ? and op.deletedAt is null`;
      result = await conn.query(sql, [uid, idOrder]);
      await conn.commit();
      //check if order existed
      if (result[0].length < 1) {
        const response = {
          status: false,
          message: "Order is not existed or is deleted",
        };
        res.json(response);
        return;
      }
      let order = result[0][0];
      //accept order
      let sqlUpdate = `update order_product 
            set updatedAt = ?, status = "declined"
            where id = ?`;
      result = await conn.query(sqlUpdate, [updatedAt, idOrder]);
      await conn.commit();

      //create notify
      let h = updatedAt.getHours();
      let m = updatedAt.getMinutes();
      let s = updatedAt.getSeconds();
      let date = updatedAt.getDate();
      let month = updatedAt.getMonth() + 1;
      let year = updatedAt.getFullYear();
      let title = `Từ chối đặt hàng ${order.code}`;
      let content = `Người dùng ${order.sellerUsername} đã từ chối yêu cầu mua sản phẩm ${order.code} của bạn vào lúc ${h}:${m}:${s} ngày ${date}/${month}/${year}.`;
      let sqlNoti = `INSERT INTO notify ( uid, title, content) VALUES (?, ?, ?)`;
      await conn.query(sqlNoti, [order.uid, title, content]);
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
  BuyerDeleteOrder: async (req, res, next) => {
    let conn,
      { idOrder, uid } = req.query;
    let deletedAt = new Date();
    try {
      conn = await dbs.getConnection();
      await conn.beginTransaction();
      let sql, result;

      //delete
      sql = `update order_product 
            set deletedAt = ?, updatedAt = ?
            where id = ? AND uid = ?`;
      result = await conn.query(sql, [deletedAt, deletedAt, idOrder, uid]);
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
};

module.exports = Order;
