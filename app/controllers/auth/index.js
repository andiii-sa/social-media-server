const register = require("./register");
const login = require("./login");
const updateAuth = require("./updateAuth");
const {
  authExportFormatDataExcel,
  authUploadMultipleUser,
} = require("./multipleUploadUser");

module.exports = {
  register,
  login,
  updateAuth,
  authExportFormatDataExcel,
  authUploadMultipleUser,
};
