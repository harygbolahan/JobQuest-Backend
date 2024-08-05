const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const workingExperienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, "Company name is required"]
  },
  position: {
    type: String,
    required: [true, "Position is required"]
  },
  duration: {
    type: String,
    required: [true, "Duration is required"]
  },
  description: {
    type: String,
    required: [true, "Description is required"]
  }
});

const educationLevelSchema = new mongoose.Schema({
  school: {
    type: String,
    required: [true, "School name is required"]
  },
  year: {
    type: String,
    required: [true, "Year is required"]
  },
  qualification: {
    type: String,
    required: [true, "Qualification is required"]
  },
  description: {
    type: String,
    required: [true, "Description is required"]
  }
});

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Please provide a first name"],
    trim: true
  },
  lastname: {
    type: String,
    required: [true, "Please provide a last name"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: [true, "Email must be unique"],
    trim: true
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [8, "Password must be at least 8 characters long"],
    select: false
  },
  bio: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ["JobSeeker", "Employer"],
    default: "JobSeeker"
  },
  verification_token: {
    type: String
  },
  email_verified: {
    type: Boolean,
    default: false
  },
  profile_image: {
    type: String
  },
  reset_password_token: {
    type: String
  },
  title: {
    type: String,
    trim: true
  },
  phonenumber: {
    type: Number,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  experience: {
    type: String,
    trim: true
  },
  currentSalary: {
    type: Number,
    trim: true
  },
  desiredSalary: {
    type: Number,
    trim: true
  },
  age: {
    type: Number,
    trim: true
  },
  educationLevels: {
    type: [educationLevelSchema],
    validate: {
      validator: function (v) {
        return v.length <= 3;
      },
      message: props => `You can have a maximum of 3 education levels`
    }
  },
  languages: {
    type: String
  },
  categories: {
    type: String
  },
  description: {
    type: String
  },
  workingExperience: {
    type: [workingExperienceSchema],
    validate: {
      validator: function (v) {
        return v.length <= 3;
      },
      message: props => `You can have a maximum of 3 working experiences`
    }
  }
});

userSchema.methods.getFullName = function () {
  return `${this.firstname} ${this.lastname}`;
};

userSchema.methods.comparePassword = async function (password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
};

const Users = mongoose.model("Users", userSchema);

module.exports = Users;
