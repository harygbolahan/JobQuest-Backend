const mongoose = require("mongoose");

const jobSchema = mongoose.Schema({
  JobTitle: {
    type: String,
    required: [true, "Please add a job title"],
    trim: true,
  },
  ApplicationEmail: {
    type: String,
    required: [true, "Please add a email"],
    trim: true,
  },
  JobLocation: {
    type: String,
    required: [true, "Please add a job location"],
    trim: true,
  },
  JobType: {
    type: String,
    required: [true, "Please add a job type"],
    trim: true,
  },
  JobCategories: {
    type: String,
    required: [true, "Please add a job category"],
    trim: true,
  },
  ExpectedSalary: {
    type: String,
    required: [true, "Please add a expected salary"],
    trim: true,
  },
  PreviousExperience: {
    type: String,
    required: [true, "Please add a previous experience"],
    trim: true,
  },
  JobDescriptions: {
    type: String,
    required: [true, "Please add a job description"],
    trim: true,
  },
  image: {
    type: String,
    required: [true, "Please add an image"],
    trim: true,
  },
  CreatedDate: {
    type: Date,
    default: Date.now,
  },
  PostedBy: {
    type: String,
    required: [true, "Unable to verify Company"],
    trim: true,
  },
  timestamp: { type: Date, default: Date.now },
});

const Jobs = mongoose.model("Jobs", jobSchema);

module.exports = Jobs;