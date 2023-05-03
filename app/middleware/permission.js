module.exports = (...roles) => {
  return (req, res, next) => {
    const role = req.user.role;
    console.log("role", role);
    console.log("roles", roles);
    if (!roles.includes(role)) {
      return res.status(403).json({
        message: "Akses dilarang",
      });
    }

    return next();
  };
};
