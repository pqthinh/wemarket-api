module.exports = (app) => {
    const { authUser, authAdmin } = require("../helpers/middleware");
    /* notify */
    const notify = require("../mysql/notify");

    /**
     * @swagger
     * /common/notify:
     *   get:
     *     description: get notify
     *     parameters:
     *      - name: limit
     *        in: query
     *      - name: offset
     *        in: query
     *     responses:
     *       200:
     *         description: Success
     *
     */
    app.get("/common/notify" ,notify.getListNotify );
    
};
  