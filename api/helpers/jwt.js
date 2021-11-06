var jwt = require("jsonwebtoken");

function generateToken(user) {
  if (!user) return null;

  var u = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
  };

  return jwt.sign(u, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24, // expires in 24 hours
  });
}

function getCleanUser(user) {
  if (!user) return null;
  console.log(user);
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
  };
}

function decodeToken() {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
  generateToken,
  getCleanUser,
  decodeToken,
};
