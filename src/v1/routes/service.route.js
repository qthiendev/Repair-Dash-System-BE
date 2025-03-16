const express = require("express");
const router = express.Router();

const {
  createService,
  readService,
  updateService,
  deleteService,
  readServiceStore
} = require("../controllers/service.controller");

const {
  createServiceValidation,
  readServiceValidation,
  updateServiceValidation,
  deleteServiceValidation,
  readServiceStoreValidation
} = require("../validators/service.validator");

const { authenticate, ensureStore } = require("../middlewares/auth.middleware");

/**
 * @description RESTful API for managing services.
 *
 * @route POST   /v1/service          - Create a new service
 * @route GET    /v1/service/:service_id? - Retrieve all service or a specific service
 * @route GET    /v1/service/store/:owner_id - Retrieve all store services
 * @route PUT    /v1/service/:service_id  - Update a service
 * @route DELETE /v1/service/:service_id  - Soft delete a service
 */
router.post("/", authenticate, ensureStore, createServiceValidation, createService);
router.get("/:service_id?", readServiceValidation, readService);
router.get("/store/:owner_id", readServiceStoreValidation, readServiceStore)
router.put("/:service_id", authenticate, ensureStore, updateServiceValidation, updateService);
router.delete("/:service_id", authenticate, ensureStore, deleteServiceValidation, deleteService);

module.exports = router;
