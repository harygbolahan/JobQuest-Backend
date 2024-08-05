const Users = require("./../model/user");
const Companies = require("./../model/company");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const signJWt = require("./../utils/signJwt");
const sendEmail = require("./../utils/email");
const crypto = require("crypto");
const AppError = require("../utils/AppError");
const { validateUserSignup } = require("./../validations/userValidation");
const {validateCompanySignup} = require("./../validations/companyValidations");

const signup = async (req, res, next) => {
  try {
    console.log(req.body);
    const validation = validateUserSignup(req.body);
    if (validation?.error) {
      throw new AppError(validation?.error.message, 400);
    }
    const role = "JobSeeker";
    const { firstname, lastname, email, password  } = req.body;

    // Check if the user with the email already exists
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      throw new Error("User with the email address already exists");
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);

    // Create User account
    const user = await Users.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role,
    });

    if (!user) {
      throw new Error("Failed to create user account");
    }

    // Send welcome mail
    const options = {
      email: email,
      subject: "Job Quest",
      message:
        "Welcome Onboard. We are pleased to have you. Please keep your eyes peeled for the verification link which you will recieve soon.\n Shop and spend your money.",
    };
    await sendEmail(options);

    //------- Send email verification link--------
    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    console.log(verificationToken);
    // Hash the verification token
    const hashedVerificationToken = await bcrypt.hash(verificationToken, salt);

    // Create verification url
    const verificationUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/verify/${user.email}/${verificationToken}`;

    // Create verification message
    const verificationMessage = `Please click on the link below to verify your email address. \n ${verificationUrl} `;

    // Verification mail options
    const verificationMailOptions = {
      email: email,
      subject: "Verify your email address",
      message: verificationMessage,
    };

    // Send verification mail
    await sendEmail(verificationMailOptions);

    // Update user record with hashed verification token
    user.verification_token = hashedVerificationToken;
    await user.save();

    // Create auth token
    const token = signJWt(user._id);

    res.status(201).json({
      status: "success",
      data: {
        user,
        token,
      },
    });

    // Create User account
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Please provide email and password");
    }

    // Check if the user account exists
    const user = await Users.findOne({ email }).select("+password");
    console.log(user);

    // Check if the password is correct

    if (!user || !(await user.comparePassword(password, user.password))) {
      throw new Error("Invalid email or password");
    }

    // Create auth token
    const token = signJWt(user._id);
    // send response
    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

const companySignup = async (req, res, next) => {
  try {
    console.log(req.body);
    const validation = validateCompanySignup(req.body);
    if (validation?.error) {
      throw new AppError(validation?.error.message, 400);
    }
    const role = "Employer";
    const { name, email, password,  } = req.body;

    // Check if the company with the email already exists
    const existingUser = await Companies.findOne({ email });
    if (existingUser) {
      throw new Error("Company with the email address already exists");
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);

    // Create Company account
    const company = await Companies.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    if (!company) {
      throw new Error("Failed to create company account");
    }

    // Send welcome mail
    const options = {
      email: email,
      subject: "Job Quest",
      message:
        "Welcome Onboard. We are pleased to have you. Please keep your eyes peeled for the verification link which you will recieve soon.\n Shop and spend your money.",
    };
    await sendEmail(options);

    //------- Send email verification link--------
    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    console.log(verificationToken);
    // Hash the verification token
    const hashedVerificationToken = await bcrypt.hash(verificationToken, salt);

    // Create verification url
    const verificationUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/verifyCompany/${company.email}/${verificationToken}`;

    // Create verification message
    const verificationMessage = `Please click on the link below to verify your email address. \n ${verificationUrl} `;

    // Verification mail options
    const verificationMailOptions = {
      email: email,
      subject: "Verify your email address",
      message: verificationMessage,
    };

    // Send verification mail
    await sendEmail(verificationMailOptions);

    // Update company record with hashed verification token
    company.verification_token = hashedVerificationToken;
    await company.save();

    // Create auth token
    const token = signJWt(company._id);

    res.status(201).json({
      status: "success",
      data: {
        company,
        token,
      },
    });

    // Create Company account
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

const companyLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Please provide email and password");
    }

    // Check if the company account exists
    const company = await Companies.findOne({ email }).select("+password");
    console.log(company);

    // Check if the password is correct

    if (!company || !(await company.comparePassword(password, company.password))) {
      throw new Error("Invalid email or password");
    }

    // Create auth token
    const token = signJWt(company._id);
    // send response
    res.status(200).json({
      status: "success",
      message: "company logged in successfully",
      data: {
        company,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};
const verifyEmailAddress = async (req, res, next) => {
  try {
    const { email, verificationToken } = req.params;

    if (!email || !verificationToken) {
      throw new Error("Please provide email and token");
    }

    // check if user with the email exist
    const user = await Users.findOne({ email });
    if (!user) {
      throw new Error("User with the email not found");
    }

    const tokenValid = await bcrypt.compare(
      verificationToken,
      user.verification_token
    );

    if (!tokenValid) {
      throw new Error("failed to verify user - Invalid tokne");
    }

    user.email_verified = true;
    await user.save();
    res.status(200).json({
      status: "success",
      message: "User verified successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

const companyVerifyEmailAddress = async (req, res, next) => {
  try {
    const { email, verificationToken } = req.params;

    if (!email || !verificationToken) {
      throw new Error("Please provide email and token");
    }

    // check if user with the email exist
    const user = await Companies.findOne({ email });
    if (!user) {
      throw new Error("User with the email not found");
    }

    const tokenValid = await bcrypt.compare(
      verificationToken,
      user.verification_token
    );

    if (!tokenValid) {
      throw new Error("failed to verify company - Invalid token");
    }

    user.email_verified = true;
    await user.save();
    res.status(200).json({
      status: "success",
      message: "Company verified successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

//
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new AppError("Please provide email address", 404);
    }

    // check if user with the email exist
    const user = await Users.findOne({ email });
    if (!user) {
      throw new AppError("User with the email not found", 404);
    }

    // Create reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedResetToken = await bcrypt.hash(resetToken, 10);

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/resetpassword/${email}/${resetToken}`;

    // Create reset message
    const resetMessage = `Please click on the link below to reset your password. \n ${resetUrl} `;

    // Reset mail options
    const resetMailOptions = {
      email: email,
      subject: "Reset your password",
      message: resetMessage,
    };

    // Send reset mail
    await sendEmail(resetMailOptions);

    // Update user record with hashed reset token
    user.reset_password_token = hashedResetToken;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Reset link sent to email",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const companyForgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new AppError("Please provide email address", 404);
    }

    // check if user with the email exist
    const user = await Companies.findOne({ email });
    if (!user) {
      throw new AppError("Company with the email not found", 404);
    }

    // Create reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedResetToken = await bcrypt.hash(resetToken, 10);

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/company/resetpassword/${email}/${resetToken}`;

    // Create reset message
    const resetMessage = `Please click on the link below to reset your password. \n ${resetUrl} `;

    // Reset mail options
    const resetMailOptions = {
      email: email,
      subject: "Reset your password",
      message: resetMessage,
    };

    // Send reset mail
    await sendEmail(resetMailOptions);

    // Update user record with hashed reset token
    user.reset_password_token = hashedResetToken;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Reset link sent to email",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, resetToken } = req.params;
    const { password, confirmPassword } = req.body;

    if (!email || !resetToken || !password || !confirmPassword) {
      throw new AppError("Please provide all required fields", 404);
    }

    if (password !== confirmPassword) {
      throw new AppError("Passwords do not match", 404);
    }

    // check if user with the email exist
    const user = await Users.findOne({ email });
    if (!user) {
      throw new AppError("User with the email not found", 404);
    }

    // Check if the reset token is valid
    const tokenValid = await bcrypt.compare(
      resetToken,
      user.reset_password_token
    );

    if (!tokenValid) {
      throw new AppError("Invalid password reset token", 404);
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user record with new password
    user.password = hashedPassword;
    user.reset_password_token = undefined;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const companyResetPassword = async (req, res, next) => {
  try {
    const { email, resetToken } = req.params;
    const { password, confirmPassword } = req.body;

    if (!email || !resetToken || !password || !confirmPassword) {
      throw new AppError("Please provide all required fields", 404);
    }

    if (password !== confirmPassword) {
      throw new AppError("Passwords do not match", 404);
    }

    // check if user with the email exist
    const user = await Companies.findOne({ email });
    if (!user) {
      throw new AppError("Company with the email not found", 404);
    }

    // Check if the reset token is valid
    const tokenValid = await bcrypt.compare(
      resetToken,
      user.reset_password_token
    );

    if (!tokenValid) {
      throw new AppError("Invalid password reset token", 404);
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user record with new password
    user.password = hashedPassword;
    user.reset_password_token = undefined;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  signup,
  login,
  companyLogin,
  companySignup,
  verifyEmailAddress,
  forgotPassword,
  resetPassword,
  companyForgotPassword,
  companyResetPassword,
 companyVerifyEmailAddress,
};

