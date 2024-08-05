const bcrypt = require("bcryptjs");
const Companies = require("./../model/company");
const AppError = require("./../utils/AppError");
const { dataUri } = require("../utils/multer");
const { uploader } = require("../utils/cloudinary");

const getAllCompanies = async (req, res, next) => {
  try {
    const companies = await Companies.find();

  if (!companies){
    throw new AppError("No companies found", 404);
  }

  res.status(200).json({
    status: "success",
    message: "All companies fetched successfully",
    result: companies.length,
    data: {
      companies
    },
  });
  } catch (error) {
    next (error)
  }
}

const getCompanyProfile = async (req, res, next) => {
  const companyId = req.user.id;
  try {
    const company = await Companies.findById(companyId);

    if (!company) {
      throw new AppError("Company not found", 404);
    }

    res.status(200).json({
      status: "success",
      message: "Company profile fetched successfully",
      data: {
        company,
      },
    });
  } catch (error) {
    next(error);
  }
}

const updateCompanyProfilePicture = async (req, res, next) => {
  const companyId = req.user.id;
  try {
    const company = await Companies.findById(companyId);
    if (!company) {
      throw new AppError(`Company with ID ${companyId}not found`, 404);
    }

    const file = req.file;
    const imageData = dataUri(req).content;
    const result = await uploader.upload(imageData, {
      folder: "JobQuest/CompanyProfilePictures",
    });

    company.logo = result.secure_url;
    await company.save();
    res.status(200).json({
      status: "success",
      message: "Company profile picture updated successfully",
      data: {
        company,
      },
    })
  } catch (error) {
    next(error);
  }
}

const updateCompanyProfile = async (req, res, next) => {
  const companyId = req.user.id;
  if (!req.body) {
    throw new AppError("Please provide the company details to update", 400);
  }
  try {

    
    const company = await Companies.findByIdAndUpdate(companyId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!company) {
      throw new AppError(`Company with ID ${companyId} not found`, 404);
    }

    const allowedFields =["name", "address", "website", "industry", "description", "company_owner", "established"]

    const fieldsToUpdate = Object.keys(req.body)
    fieldsToUpdate.forEach(field => {
      if (allowedFields.includes(field)) {
        company[field] = req.body[field]
      } else {
         throw new AppError(`Field: ${field} can not be updated via this route.`, 400)
      }

    })

    await company.save();

    res.status(200).json({
      status: "success",
      message: "Company profile updated successfully",
      data: {
        company,
      },
    });
  } catch (error) {
    next(error);
  }
}

const updateCompanyPassword = async (req, res, next) => {
  try {
    const companyId = req.user._id

    const company = await Companies.findById(companyId).select("+password");
    if (!company) {
      throw new AppError(`Company not found with id of ${companyId}`, 404);
    }
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      throw new AppError(
        "Please provide both old and new and confirm password",
        400
      );
    }
    const isPasswordValid = await company.comparePassword(
      oldPassword,
      company.password
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

    company.password = hashedPassword;
    console.log();
    await company.save();
    res.status(200).json({
      status: "success",
      message: "Password updated successfully",
      data: {
        company,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllCompanies,
  getCompanyProfile,
  updateCompanyProfilePicture,
  updateCompanyProfile,
  updateCompanyPassword,
};
