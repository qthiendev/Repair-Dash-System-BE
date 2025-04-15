const createService = require("../services/service/createService.service");
const readService = require("../services/service/readService.service");
const deleteService = require("../services/service/deleteService.service");
const updateService = require("../services/service/updateService.service");
const readServiceStore = require("../services/service/readServiceStore.service");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Create a new service.
 * @route POST /api/v1/create
 * @body {string} service_name -(required)
 * @body {string} service_description (required)
 * @body {file} service_image (optional)
 * @returns {Object} 201 - { service_id: number } if created successfully
 * @returns {Object} 400 - { message: 'Service already exists' } if the service is already registered
 * @returns {Object} 500 - { message: 'Unexpected error occurred' } if an internal error happens
 */
exports.createService = async (req, res) => {
  try {
    const owner_id = jwt.verify(
      req.cookies?.accessToken,
      process.env.JWT_SECRET_KEY
    ).user_id;

    const { service_name, service_description, service_image, service_alias } =
      req.body;

    const serviceId = await createService(
      owner_id,
      service_name,
      service_description,
      service_image,
      service_alias
    );

    switch (serviceId) {
      case -1:
        return res.status(400).json({ message: "Owner not found.", code: -1 });
      case -2:
        return res
          .status(400)
          .json({ message: "Service already exists.", code: -2 });
      case -3:
        return res
          .status(400)
          .json({ message: "Service alias already exists.", code: -3 });
      default:
        return res
          .status(201)
          .json({ message: "Service created successfully", serviceId });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error occurred" });
  }
};

/**
 * Retrieve service(s).
 * @route GET /api/v1/service/:service_id?
 * @param {string} [service_id] - (Optional) The ID of the service to retrieve. If omitted, returns all services.
 * @returns {Object} 200 - { data: services } if services are found
 * @returns {Object} 404 - { message: 'Service not found' } if no service matches the given ID
 * @returns {Object} 500 - { message: 'Unexpected error occurred' } for internal server errors
 */
exports.readService = async (req, res) => {
  try {
    const { service_id } = req.params;
    let { index, limit } = req.query;

    index = Number(index);
    limit = Number(limit) || 10;

    if (isNaN(index) || index < 1) index = 1;

    let user_id = null;
    try {
      if (req.cookies?.accessToken) {
        user_id = jwt.verify(
          req.cookies.accessToken,
          process.env.JWT_SECRET_KEY
        ).user_id;
      }
    } catch (error) {
      console.error('Token verification failed:', error);
    }

    const result = await readService(service_id, user_id, index, limit);

    if (result === -1) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error occurred" });
  }
};

/**
 * Soft delete a service (marks the service as inactive instead of permanent deletion).
 * @route DELETE /api/v1/service/delete/:service_id
 * @param {string} service_id - The ID of the service to delete.
 * @returns {Object} 200 - { message: 'Service deleted successfully' } if the service was found and marked as deleted
 * @returns {Object} 404 - { message: 'Service not found' } if no service with the given ID exists
 * @returns {Object} 501 - { message: 'Cannot delete service' } if the service was not deleted
 * @returns {Object} 500 - { message: 'Unexpected error occurred' } for internal errors
 */
exports.deleteService = async (req, res) => {
  try {
    const owner_id = jwt.verify(
      req.cookies?.accessToken,
      process.env.JWT_SECRET_KEY
    ).user_id;

    const { service_id } = req.params;

    const result = await deleteService(service_id, owner_id);

    if (result === -1) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (!result) {
      return res.status(501).json({ message: "Cannot delete service" });
    }

    return res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error occurred" });
  }
};

/**
 * Update service details.
 * @route PUT /api/v1/service/edit/:service_id
 * @param {string} service_id - The ID of the user to update.
 * @body {string} [service_name] - Updated service name (optional)
 * @body {string} [service_description] - Updated service description (optional)
 * @body {file} [service_images] (optional)
 * @returns {Object} 200 - { message: 'Service updated successfully' } if the update was successful
 * @returns {Object} 404 - { message: 'Service not found' } if no service with the given ID exists
 * @returns {Object} 501 - { message: 'Cannot update service' } if the service was not updated
 * @returns {Object} 500 - { message: 'Unexpected error occurred' } for internal errors
 */
exports.updateService = async (req, res) => {
  try {
    const owner_id = jwt.verify(
      req.cookies?.accessToken,
      process.env.JWT_SECRET_KEY
    ).user_id;

    const { service_id } = req.params;

    const { service_name, service_description, service_image, service_alias } =
      req.body;

    const result = await updateService(
      owner_id,
      service_id,
      service_name,
      service_description,
      service_image,
      service_alias
    );

    switch (result) {
      case -1:
        return res
          .status(400)
          .json({ message: "Service not found.", code: -1 });
      case -2:
        return res
          .status(400)
          .json({ message: "Service alias already exists.", code: -2 });
      default:
        return res
          .status(201)
          .json({ message: "Service created successfully", result });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error occurred" });
  }
};

/**
 * Retrieve service(s).
 * @route GET /api/v1/service/:service_id?
 * @param {string} [owner_id] - (require) The ID of the store to retrieve.
 * @returns {Object} 200 - { data: services } if services are found
 * @returns {Object} 404 - { message: 'Service not found' } if no service matches the given ID
 * @returns {Object} 500 - { message: 'Unexpected error occurred' } for internal server errors
 */
exports.readServiceStore = async (req, res) => {
  try {
    const { owner_id } = req.params;

    let { index, limit } = req.query;

    index = Number(index);
    limit = Number(limit) || 10;

    if (isNaN(index) || index < 1) index = 1;

    const services = await readServiceStore(owner_id, index, limit);

    if (!services) {
      return res.status(404).json({ message: "Store not found" });
    }

    return res.status(200).json(services );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error occurred" });
  }
};
