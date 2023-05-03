const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

module.exports = async (req, res, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.replace("Bearer ", "")
    : null;
  if (token) {
    jwt.verify(token, JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({
          message: "Sesi telah habis.",
        });
      }
      req.user = decoded;
      return next();
    });
  } else {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};
