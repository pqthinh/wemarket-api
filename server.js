require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

var corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

const options = {
  swaggerDefinition: {
    info: {
      title: "Library API",
      version: "1.0.0",
    },
  },
  apis: ["server.js", "app/routes/turorial.routes.js"],
};

const specs = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const db = require("./app/models");

db.sequelize.sync();

/**
 * @swagger
 * /:
 *   get:
 *     description: Get all info app
 *     responses:
 *       200:
 *         description: Success
 *
 */
app.get("/", (req, res) => {
  res.json({ message: "Welcome to wemaket application." });
});

require("./app/routes/turorial.routes")(app);

const PORT = process.env.NODE_DOCKER_PORT || 8080;
async function initialize() {
  app.listen(PORT);
}

initialize().finally(() => console.log(`app started on port:${PORT}`));
