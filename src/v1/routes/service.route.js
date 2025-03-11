const express = require("express");
const router = express.Router();

const {
  createService,
  readService,
  deleteService,
  updateService,
} = require("../controllers/service.controller");

const {
  createServiceValidation,
  readServiceValidation,
  deleteServiceValidation,
  updateServiceValidation,
} = require("../validators/service.validator");

const { authenticate, ensureStore } = require("../middlewares/auth.middleware");

/**
 * @description Service API endpoints.
 *
 * @route POST /api/v1/service/create   - Create service
 * @route GET /api/v1/service/:service_id? - Get service
 * @route DELETE /api/v1/service/delete/:service_id  - Delete service
 * @route PUT /api/v1/service/edit/:service_id  - Put service
 */
router.post("/create", authenticate, createServiceValidation, createService);

router.get("/:service_id?", readServiceValidation, readService);

router.delete("/delete/:service_id", authenticate, deleteServiceValidation, deleteService);

router.put("/edit/:service_id", authenticate,updateServiceValidation, updateService);

module.exports = router;
