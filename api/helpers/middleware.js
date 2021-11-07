const jwt = require("jsonwebtoken");
const utils = require("./jwt");
const admin = require("./authFirebase");

module.exports = {
  authUser: async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const decodeValue = await admin.auth().verifyIdToken(token);
      console.log(decodeValue);
      if (decodeValue) {
        req.user = decodeValue;
        return next();
      }
      return res.status(401).send({ message: "Authorization token missing" });
    } catch (e) {
      console.log(e.code, "error");
      return res.status(403).send({ message: "Authentication failed!" });
    }
  },
  checkToken: (req, res) => {
    var token =
      (req.header.authorization && req.headers.authorization.split(" ")[1]) ||
      req.body.token ||
      req.query.token;
    if (!token) {
      return res.status(400).json({
        error: true,
        message: "Token is required.",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
      if (err)
        return res.status(401).json({
          error: true,
          message: "Invalid token.",
        });

      var userObj = utils.getCleanUser(user);
      return res.json({ user: userObj, token });
    });
  },
  authAdmin: async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      console.log(token, "token");
      if (!token) {
        res.status(401).send({ message: "Authorization token missing" });
        return;
      }
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.userData = { uid: decodedToken.id, role: decodedToken.role };

      next();
    } catch (err) {
      console.log(err, "error");
      res.status(403).send({ message: "Authentication failed!" });
      return;
    }
  },
};
