const joi = require("joi");

const validateCompanySignup = (object) => {
  const schema = joi.object().keys({
    name: joi
      .string()
      .required()
      .error(new Error("Please provide the company name")),
    email: joi
      .string()
      .email({ tlds: { allow: false } })
      .required()
      .error(new Error("Please provide a valid company email address")),
      password: joi
      .string()
      .min(8)
      .required()
      .error(
        () => new Error("Please provide a password not less than 8 characters")
      ),
  });
  return schema.validate(object);
};
module.exports = {
  validateCompanySignup,
};
