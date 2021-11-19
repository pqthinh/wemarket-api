require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dbs = require("./api/mysql/dbs");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const http = require("http");

const options = {
  swaggerDefinition: {
    info: {
      title: "Library API",
      version: "1.0.0",
    },
  },
  apis: [
    "./api/routes/product.js",
    "./api/routes/auth.js",
    "./api/routes/category.js",
    "./api/routes/admin.js",
    "./api/routes/notify.js"
  ],
};
const specs = swaggerJsdoc(options);

let httpServer;
function initialize() {
  return new Promise((resolve, reject) => {
    const app = express();
    const corsOptions = {
      origin: "*",
    };
    app.use(cors(corsOptions));
    app.use(morgan("dev"));
    app.use(express.json({ limit: "64mb" }));
    app.use(express.urlencoded({ limit: "64mb", extended: true }));

    app.use("/api", require("./api/routes"));

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

    httpServer = http.createServer(app);

    httpServer.listen(process.env.PORT || 8080, (err) => {
      if (err) {
        reject(err);
        return;
      }
      console.log("Started server!");
      resolve();
    });
    httpServer.setTimeout(60000);
  });
}

function close() {
  return new Promise((resolve, reject) => {
    httpServer.close((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

async function startup() {
  try {
    if (dbs.initialize) {
      console.log("Initializing database");
      await dbs.initialize();
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
  try {
    console.log("Initializing application");
    await initialize();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

async function shutdown(err) {
  try {
    console.log("Closing application");
    await close();
  } catch (e) {
    console.error(e);
  }

  try {
    if (dbs.close) {
      console.log("Closing database");
      await dbs.close();
    }
  } catch (e) {
    console.error(e);
  }
  if (err) process.exit(1);
  else process.exit(0);
}

startup();

process
  .on("SIGTERM", () => {
    shutdown();
  })
  .on("SIGINT", () => {
    shutdown();
  })
  .on("unhandledRejection", (reason, promise) => {
    console.error("unhandledRejection at:", promise, "reason:", reason);
  })
  .on("uncaughtException", (err) => {
    console.error(err);
    shutdown(err);
  });
