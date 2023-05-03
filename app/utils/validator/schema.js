const fieldSchema = require("./fieldSchema");

const schemaLogin = {
  email: fieldSchema.email,
};
const schemaRegister = {
  email: fieldSchema.email,
  username: fieldSchema.username,
  password: fieldSchema.password,
  name: fieldSchema.name,
  role: fieldSchema.role,
};

module.exports = {
  schemaLogin,
  schemaRegister,
};
