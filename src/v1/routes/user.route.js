const express = require("express");
const router = express.Router();
const multerMiddleware = require("../../middlewares/multer.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

const {
	createUser,
	readUser,
	updateUser,
	deleteUser,
	lockUser,
} = require("../controllers/user.controller");

const {
	readUserValidation,
	createUserValidation,
	updateUserValidation,
	deleteUserValidation,
} = require("../validators/user.validator");

/**
 * @description RESTful API for managing users.
 *
 * @route POST   /          - Create a new user
 * @route GET    /:user_id? - Retrieve all users or a specific user
 * @route PUT    /:user_id  - Update a user
 * @route DELETE /:user_id  - Soft delete a user
 */
router.post("/", authMiddleware.ensureAdmin, createUserValidation, createUser);
router.get("/", authMiddleware.ensureAdmin, readUser);
router.get("/:user_id", readUserValidation, readUser);
router.put(
	"/:user_id",
	authMiddleware.ensureAdmin,
	updateUserValidation,
	updateUser,
);
router.delete(
	"/:user_id",
	authMiddleware.ensureAdmin,
	deleteUserValidation,
	deleteUser,
);
router.put("/:user_id/lock", authMiddleware.ensureAdmin, lockUser);

module.exports = router;
