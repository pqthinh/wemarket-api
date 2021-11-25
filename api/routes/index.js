const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Home api of app" });
});

require("./product")(router);
require("./category")(router);
require("./auth")(router);
require("./admin")(router);
require("./notify")(router);
require("./order")(router);

module.exports = router;
