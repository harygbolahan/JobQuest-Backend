// const users = require("./../data/user");
const bcrypt = require("bcryptjs");
const Users = require("./../model/user");
const AppError = require("./../utils/AppError");
const { dataUri } = require("../utils/multer");
const { uploader } = require("../utils/cloudinary");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await Users.find();

    if (!users) {
      throw new AppError("No users found", 404);
    }

    res.status(200).json({
      status: "success",
      message: "All users fetched successfully",
      result: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};  

//
const getUserProfile = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const user = await Users.findById(userId);
    if (!user) {
      throw new AppError(`User not found with id of ${id}`, 404);
    }
    const fullname = user.getFullName();

    res.status(200).json({
      status: "success",
      message: "User fetched successfully",
      data: {
        user,
        fullname,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateProfilePicture = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await Users.findById(userId);
    if (!user) {
      throw new AppError(`User not found with id of ${id}`, 404);
    }
    const file = req.file;
    const imageData = dataUri(req).content;
    const result = await uploader.upload(imageData, {
      folder: "JobQuest/profile_images",
    });
    user.profile_image = result.secure_url;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Profile picture updated successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const user = await Users.findById(userId);
    if (!user) {
      throw new AppError(`User not found with id of ${userId}`, 404);
    }

    const allowedFields = [
      "firstname", "lastname", "bio", "title", "phonenumber", "website",
      "experience", "currentSalary", "desiredSalary", "age", "educationLevels",
      "languages", "categories", "description", "workingExperience"
    ];
    
    const fieldsToUpdate = Object.keys(req.body);
    fieldsToUpdate.forEach((field) => {
      if (allowedFields.includes(field)) {
        user[field] = req.body[field];
      } else {
        throw new AppError(
          `Field ${field} is not allowed to be updated using this route`,
          400
        );
      }
    });

    await user.save();

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};



const updatePassword = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await Users.findById(userId).select("+password");
    if (!user) {
      throw new AppError(`User not found with id of ${id}`, 404);
    }
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      throw new AppError(
        "Please provide both old and new and confirm password",
        400
      );
    }
    const isPasswordValid = await user.comparePassword(
      oldPassword,
      user.password
    );
    if (!isPasswordValid) {
      throw new AppError("Old password is incorrect", 400);
    }

    if (oldPassword === newPassword) {
      throw new AppError(
        "New password cannot be the same as old password",
        400
      );
    }

    if (newPassword !== confirmNewPassword) {
      throw new AppError(
        "New password and confirm new password do not match",
        400
      );
    }
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    console.log();
    await user.save();
    res.status(200).json({
      status: "success",
      message: "Password updated successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserProfile,
  updateProfilePicture,
  updateProfile,
  updatePassword,
};
