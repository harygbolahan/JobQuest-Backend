const { number } = require("joi");
const mongoose = require("mongoose");

const profileUpdateSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Please provide a first name"],
    trim: true,
  },
  lastname: {
    type: String,
    required: [true, "Please provide a last name"],
    trim: true,
  },
  title: {
    type: String,
    required: [true, "Please provide a title"],
    trim: true,
  },
  phonenumber: {
    type: Number,
    required: [true, "Please provide a phone number"],
    trim: true,
  },
  website: {
    type: String,
    required: [true, "Please provide a website"],
    trim: true,
  },
  experience: {
    type: String,
    required: [true, "Please provide a experience"],
    trim: true,
  },
  currentSalary: {
    type: Number,
    required: [true, "Please provide a current salary"],
    trim: true,
  },
  desiredSalary: {
    type: Number,
    required: [true, "Please provide a desired salary"],
    trim: true,
  },
  age: {
    type: Number,
    required: [true, "Please provide a age"],
    trim: true,
  },
  educationLevel: {
    type: String,
    required: [true, "Please provide a education level"],
    trim: true,
  },
  languages: {
    type: String,
    required: [true, "Please provide a languages"],
  },
  categories: {
    type: String,
    required: [true, "Please provide a categories"],
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
  },
  workingExperience: {
    type: String,
    required: [true, "Please provide a working experience"],
  },
});
