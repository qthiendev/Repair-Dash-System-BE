const express = require("express");
const router = express.Router();

const {
    createUser,
    readUser,
    updateUser,
    deleteUser
} = require("../../modules/v1/controllers/user.controller");

const {
    readValidation,
    createValidation,
    updateValidation,
    deleteValidation
} = require("../../validators/user.validator");

/**
 * @description RESTful API for managing users.
 *
 * @route POST   /          - Create a new user
 * @route GET    /:user_id? - Retrieve all users or a specific user
 * @route PUT    /:user_id  - Update a user
 * @route DELETE /:user_id  - Soft delete a user
 */
router.post("/", createValidation, createUser);
router.get("/:user_id?", readValidation, readUser);
router.put("/:user_id", updateValidation, updateUser);
router.delete("/:user_id", deleteValidation, deleteUser);

module.exports = router;
