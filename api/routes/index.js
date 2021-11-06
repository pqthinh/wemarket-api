const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Home api of app" });
});

require("./product")(router);
require("./auth")(router);

module.exports = router;
