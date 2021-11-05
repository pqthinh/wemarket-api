module.exports = (app) => {
  const tutorials = require("../controllers/tutorial.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  /**
   * @swagger
   * /api/tutorials:
   *   post:
   *     description: create a new tutorial
   *     parameters:
   *      - name: title
   *        description: title of the book
   *        in: formData
   *        required: true
   *        type: string
   *     responses:
   *       201:
   *         description: Created
   */
  router.post("/", tutorials.create);

  // Retrieve all Tutorials
  /**
   * @swagger
   * /api/tutorials:
   *   get:
   *     description: Get all tutorial
   *     parameters:
   *     responses:
   *       200:
   *         description: success
   */
  router.get("/", tutorials.findAll);

  // Retrieve all published Tutorials
  /**
   * @swagger
   * /api/tutorials/published:
   *   get:
   *     description:  Retrieve all published Tutorials
   *     parameters:
   *     responses:
   *       200:
   *         description: success
   */
  router.get("/published", tutorials.findAllPublished);

  // Retrieve a single Tutorial with id
  /**
   * @swagger
   * /api/tutorials/:id:
   *   get:
   *     description:  Retrieve a single Tutorial with id
   *     parameters:
   *     responses:
   *       200:
   *         description: success
   */
  router.get("/:id", tutorials.findOne);

  // Update a Tutorial with id
  /**
   * @swagger
   * /api/tutorials/:id:
   *   put:
   *     description:  Update a Tutorial with id
   *     parameters:
   *     responses:
   *       200:
   *         description: success
   */
  router.put("/:id", tutorials.update);

  // Delete a Tutorial with id
  /**
   * @swagger
   * /api/tutorials/:id:
   *   delete:
   *     description:  Delete a Tutorial with id
   *     parameters:
   *     responses:
   *       200:
   *         description: success
   */
  router.delete("/:id", tutorials.delete);

  // Delete all Tutorials
  /**
   * @swagger
   * /api/tutorials/:
   *   delete:
   *     description:  Delete all Tutorials
   *     parameters:
   *     responses:
   *       200:
   *         description: success
   */
  router.delete("/", tutorials.deleteAll);

  app.use("/api/tutorials", router);
};
