const AppError = require("../utils/AppError");
const Jobs = require("./../model/jobs");
const { dataUri } = require("./../utils/multer");
const { uploader } = require("./../utils/cloudinary");
const { validateJobs } = require("./../validations/jobValidations");

const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Jobs.find()
    res.status(200).json({
      status: "success",
      message: "Successfully fetched all jobs",
      result: jobs.length,
      data: {
        jobs,
      },
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

const createJobs = async (req, res, next) => {
  try {
    console.log("Request object:", req);
    console.log("File object:", req.file);

    if (!req.file) {
      throw new AppError("Please upload an image", 400);
    }

    const fileData = dataUri(req).content;
    const result = await uploader.upload(fileData, {
      folder: "JobQuest/Jobs",
    });

    console.log("Upload result:", result);
    console.log("User object:", req.user);

    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const userId = req.user._id;
    console.log("User ID:", userId);

    const validation = validateJobs(req.body);
    console.log("Validation result:", validation);

    if (validation.error) {
      throw new AppError(validation.error.details[0].message, 400);
    }

    const {
      JobTitle,
      ApplicationEmail,
      JobLocation,
      JobType,
      JobCategories,
      ExpectedSalary,
      PreviousExperience,
      JobDescriptions,
      PostedBy = userId,
    } = req.body;

    const newJob = await Jobs.create({
      JobTitle,
      ApplicationEmail,
      JobLocation,
      JobType,
      JobCategories,
      ExpectedSalary,
      PreviousExperience,
      JobDescriptions,
      PostedBy,
      image: result.secure_url,
    });

    if (!newJob) {
      throw new AppError(
        "Something went wrong! An error occurred while creating a new job",
        500
      );
    }

    res.status(201).json({
      status: "success",
      message: "Successfully created a new job",
      data: {
        newJob,
      },
    });
    console.log("New job created:", newJob);
  } catch (error) {
    console.log("Error:", error);

    next(new AppError(error.message, 500));
  }
};

  

const getJobDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await Jobs.findById(id);
    if (!job) {
      throw new AppError("Job not found", 404);
    }
    res.status(200).json({
      status: "success",
      message: "Successfully fetched job details",
      data: {
        job,
      },
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

const updateJobDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new Error("Please provide a job id", 400);
    }
    // const userId = req.user._id;
    const validation = validateUpdateJobs(req.body);
    if (validation.error) {
      throw new AppError(validation.error.details[0].message, 400);
    }
    const updatedDetails = req.body;
    const updatedJob = await Jobs.findByIdAndUpdate(id, updatedDetails, {
      new: true,
    });

    if (!updatedJob) {
      throw new AppError(
        "Something went wrong! An error occured while updating the job",
        500
      );
    }
    res.status(200).json({
      status: "success",
      message: "Successfully updated job details",
      data: {
        updatedJob,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occured with message:" + error.message,
    });
  }
};

const getAllJobsbyAdmin = async (req, res, next) => {
 try {
     const jobs = await Jobs.find();
    res.status(200).json({
      status: "success",
      message: "Successfully fetched all jobs",
      data: {
        jobs,
      },
    });
 } catch (error) {
    res.status(404).json({
        status: "error",
        message: "An error occurred with message: " + error.message,
      });
 }
};

module.exports = { getAllJobs, createJobs, getJobDetails, updateJobDetails, getAllJobsbyAdmin };