const express = require("express");
const router = express.Router();
const onSendNotification = require("../helpers/pushNotify");

router.get("/", (req, res) => {
  res.json({ message: "Home api of app" });
});

router.post("/fcm/chat", (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) res.sendStatus(401);
  console.log(token);
  onSendNotification({ ...req.body, token: token });
  res.sendStatus(200);
});

require("./product")(router);
require("./category")(router);
require("./auth")(router);
require("./admin")(router);
require("./notify")(router);
require("./order")(router);
require("./banner")(router);
require("./history")(router);

module.exports = router;
