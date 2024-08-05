const joi = require("joi");

const updateProfile = (object) => {
  const schema = joi.object().keys({
    firstname: joi
      .string()
      .required()
      .error(new Error("Please provide First Name")),
    lastname: joi
      .string()
      .required()
      .error(new Error("Please provide Last Name")),
    title: joi
      .string()
      .required()
      .error(new Error("Please provide Professional Title")),
    phonenumber: joi
      .number()
      .required()
      .error(new Error("Please provide Phone Number")),
    website: joi
    .string()
    .error(new Error("Please provide Your websure")),
    currentSalary: joi
      .number()
      .required()
      .error(new Error("Please provide a current salary ")),
    desiredSalary: joi
      .number()
      .required()
      .error(new Error("Please provide a desired salary ")),
    experience: joi
      .string()
      .required()
      .error(new Error("Please provide Experience")),
    age: joi
    .number()
    .required()
    .error(new Error("Please provide age")),
    educationLevel: joi
      .string()
      .required()
      .error(new Error("Please provide Education Level")),
    languages: joi
      .string()
      .required()
      .error(new Error("Please provide Languages")),
    categories: joi
      .string()
      .required()
      .error(new Error("Please provide Categories")),
    description: joi
      .string()
      .required()
      .error(new Error("Please provide a description")),
    workingExperience: joi
      .string()
      .required()
      .error(new Error("Please provide working experience")),
  });
  return schema.validate(object);
};
