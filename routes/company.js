const express = require("express");
const companyController = require("./../controllers/company");
const authMiddleware = require("./../middleware/auth");
const { imageUploads } = require("./../utils/multer");

const router = express.Router();

router.route("/").get( companyController.getAllCompanies)

router.route("/profile").get(authMiddleware.CompanyProtectRoute, companyController.getCompanyProfile)
.patch( authMiddleware.CompanyProtectRoute, companyController.updateCompanyProfile);

router.route("/update-company-logo").patch(authMiddleware.CompanyProtectRoute, imageUploads, companyController.updateCompanyProfilePicture);

router.route("/company-password").patch(authMiddleware.CompanyProtectRoute, companyController.updateCompanyPassword);

module.exports = router;
