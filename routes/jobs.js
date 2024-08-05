const express = require("express");
const {
  getAllJobs,
  createJobs,
  getJobDetails,
  updateJobDetails,
  getAllJobsbyAdmin,
} = require("./../controllers/jobs");
const authMiddleware = require("./../middleware/auth");
const { imageUploads } = require("./../utils/multer");

const router = express.Router();

router
  .route("/")
  .get(getAllJobs)
  .post(authMiddleware.CompanyProtectRoute, imageUploads, createJobs);

router
  .route("/:id")
  .get(getJobDetails)
  .put(authMiddleware.protectRoute, updateJobDetails)
  .delete(authMiddleware.verifyIsAdmin, getAllJobsbyAdmin); 


  module.exports = router