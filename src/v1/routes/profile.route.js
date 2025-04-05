const express = require("express");
const router = express.Router();

const {
  readProfile,
  updateProfile,
} = require("../controllers/profile.controller");

const { updateProfileValidation } = require("../validators/profile.validator");

const { authenticate } = require("../middlewares/auth.middleware");
/**
 * @description RESTful API for profile user.
 *
 * @route GET /v1/profile - Retrieve user profile
 * @route PUT /v1/profile - Update user profile
 */
router.get("/", authenticate, readProfile);
router.put("/", authenticate, updateProfileValidation, updateProfile);

module.exports = router;
