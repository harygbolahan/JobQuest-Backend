const Joi = require("joi");

const validateJobs = (object) => {
  const schema = Joi.object({
    JobTitle: Joi.string()
      .trim()
      .required()
      .error(new Error("Job title is required")),
    ApplicationEmail: Joi.string()
      .trim()
      .email()
      .required()
      .error(new Error("Application email is required")),
    JobLocation: Joi.string()
      .trim()
      .required()
      .error(new Error("Job location is required")),
    JobType: Joi.string()
      .trim()
      .required()
      .error(new Error("Job type is required")),
    JobCategories: Joi.string()
      .trim()
      .required()
      .error(new Error("Job categories are required")),
    ExpectedSalary: Joi.string()
      .trim()
      .required()
      .error(new Error("Expected salary is required")),
    PreviousExperience: Joi.string()
      .trim()
      .required()
      .error(new Error("Previous experience is required")),
    JobDescriptions: Joi.string()
      .trim()
      .required()
      .error(new Error("Job descriptions are required")),
    PostedBy: Joi.string().trim().required().error(new Error("Unable to verify Company")),
  });

  return schema.validate(object, { abortEarly: false });
};

module.exports = { validateJobs };
