module.exports = (app) => {
  const { authUser, authAdmin } = require("../helpers/middleware");
  /* product */
  const order = require("../mysql/order");
  /**
   * @swagger
   * /order/list-of-seller:
   *   get:
   *     description: get all order of seller
   *     parameters:
   *      - name: limit
   *        in: query
   *      - name: offset
   *        in: query
   *      - name: uid
   *        in: query
   *      - name: idProduct
   *        in: query
   *      - name: orderByDate
   *        in: body
   *      - name: orderByQuantity
   *        in: body
   *      - name: orderByStatus
   *        in: body
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.get("/order/list-of-seller", order.getListOrderOfSeller);
  /**
   * @swagger
   * /order/list-of-buyer:
   *   get:
   *     description: get all order of buyer
   *     parameters:
   *      - name: limit
   *        in: query
   *      - name: offset
   *        in: query
   *      - name: uid
   *        in: query
   *      - name: idProduct
   *        in: query
   *      - name: orderByDate
   *        in: body
   *      - name: orderByQuantity
   *        in: body
   *      - name: orderByStatus
   *        in: body
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.get("/order/list-of-buyer", order.getListOrderOfBuyer);
   /**
   * @swagger
   * /order/list-pending:
   *   get:
   *     description: get all pending order of buyer
   *     parameters:
   *      - name: limit
   *        in: query
   *      - name: offset
   *        in: query
   *      - name: uid
   *        in: query
   *      - name: idProduct
   *        in: query
   *      - name: orderByDate
   *        in: body
   *      - name: orderByQuantity
   *        in: body
   *      - name: orderByStatus
   *        in: body
   *     responses:
   *       200:
   *         description: Success
   *
   */
    app.get("/order/list-pending", order.getListPendingOrderOfBuyer);

  /**
   * @swagger
   * /order/get-by-seller:
   *   post:
   *     description: get order detail by seller
   *     parameters:
   *      - name : idOrder
   *        in : query
   *      - name: uid
   *        in: query
   *     responses:
   *       200:
   *         description: Success
   */
  app.get("/order/get-by-seller", order.SellerGetOrderDetail);

  /**
   * @swagger
   * /order/get-by-buyer:
   *   post:
   *     description: get order detail by buyer
   *     parameters:
   *      - name : idOrder
   *        in : query
   *      - name: uid
   *        in: query
   *     responses:
   *       200:
   *         description: Success
   */
  app.get("/order/get-by-buyer", order.BuyerGetOrderDetail);

  /**
   * @swagger
   * /order/create:
   *   post:
   *     description: create category by admin
   *     parameters:
   *      - name : idProduct
   *        in : body
   *      - name: uid
   *        in : body
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.post("/order/create", order.BuyerCreateOrder);

  /**
   * @swagger
   * /order/delete:
   *   post:
   *     description: delete order
   *     parameters:
   *      - name: idOrder
   *        in : body
   *      - name: uid
   *        in : body
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.post("/order/delete", order.BuyerDeleteOrder);

  /**
   * @swagger
   * /order/update:
   *   post:
   *     description: update order by seller
   *     parameters:
   *      - name : idOrder
   *        in : body
   *      - name: uid
   *        in : body
   *      - name: quantity
   *        in : body
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.post("/order/update", order.SellerUpdateOrder);
  /**
   * @swagger
   * /order/accept:
   *   post:
   *     description: update order by seller
   *     parameters:
   *      - name : idOrder
   *        in : body
   *      - name: uid
   *        in : body
   *      - name: quantity
   *        in : body
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.post("/order/accept", order.SellerAcceptOrder);
  /**
   * @swagger
   * /order/update:
   *   post:
   *     description: update order by seller
   *     parameters:
   *      - name : idOrder
   *        in : body
   *      - name: uid
   *        in : body
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.post("/order/decline", order.SellerDeclineOrder);
};
