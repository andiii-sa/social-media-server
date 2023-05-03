const Validator = require("fastest-validator");
const { schemaLogin, schemaRegister } = require("./schema");
const v = new Validator();

const resultValidate = (validate, res) => {
  if (validate.length) {
    return res.status(400).json({
      message: "Error validasi",
      error: validate,
    });
  }
};

const loginValidation = (req, res) => {
  const validate = v.validate(req.body, schemaLogin);
  resultValidate(validate, res);
};
const registerValidation = (req, res) => {
  const validate = v.validate(req.body, schemaRegister);
  resultValidate(validate, res);
};

module.exports = {
  loginValidation,
  registerValidation,
};
