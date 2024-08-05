const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a company name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: [true, "Email must be unique"],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [8, "Password must be at least 8 characters long"],
    select: false,
  },
  address: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ["JobSeeker", "Employer"],
    default: "Employer",
  },
  website: {
    type: String,
    trim: true,
  },
  industry: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  logo: {
    type: String,
  },
  verification_token: {
    type: String,
  },
  reset_password_token: {
    type: String,
  },
  company_owner:{
    type:String
  },
  established:{
    type:String
  }
});


companySchema.methods.comparePassword = async function (password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
};

const Companies = mongoose.model("Companies", companySchema);

module.exports = Companies;
