const readProfile = require("../services/profile/readProfile.service");
const updateProfile = require("../services/profile/updateProfile.service");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Get a user profile.
 * @route GET /api/v1/profile
 * @returns {Object} 200 - { data: profile } if profile are found
 * @returns {Object} 400 - { message: 'User not found' } if the user not found
 * @returns {Object} 500 - { message: 'Unexpected error occurred' } if an internal error happens
 */
exports.readProfile = async (req, res) => {
  try {
    const user_id = jwt.verify(
      req.cookies?.accessToken,
      process.env.JWT_SECRET_KEY
    ).user_id;

    const profile = await readProfile(user_id);

    switch (profile) {
      case -1:
        return res.status(400).json({ message: "User not found.", code: -1 });
      default:
        return res.status(200).json( profile );
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error occurred" });
  }
};

/**
 * Update profile details.
 * @route PUT /api/v1/profile
 * @body {string} [user_full_name] - Updated full name (optional)
 * @body {string} [user_phone_number] - Updated user phone (optional)
 * @body {file} [user_avatar] (optional)
 * @body {string} [user_description] - Updated user description (optional)
 * @body {string} [user_street] - Updated user street (optional)
 * @body {string} [user_ward] Updated user ward (optional)
 * @body {string} [user_district] - Updated user district (optional)
 * @body {string} [user_city] - Updated user city (optional)
 * @body {string} [user_priority] Updated user priority (optional)
 * @returns {Object} 200 - { message: 'User updated successfully' } if the update was successful
 * @returns {Object} 404 - { message: 'User not found' } if no user with the given token
 * @returns {Object} 501 - { message: 'Cannot update user' } if the service was not updated
 * @returns {Object} 500 - { message: 'Unexpected error occurred' } for internal errors
 */
exports.updateProfile = async (req, res) => {
  try {
    const user_id = jwt.verify(
      req.cookies?.accessToken,
      process.env.JWT_SECRET_KEY
    ).user_id;

    const {
      user_full_name,
      user_phone_number,
      user_avatar,
      user_description,
      user_street,
      user_ward,
      user_district,
      user_city,
    } = req.body;

    const result = await updateProfile(
      user_id,
      user_full_name,
      user_phone_number,
      user_avatar,
      user_description,
      user_street,
      user_ward,
      user_district,
      user_city,
    );

    if (result === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!result) {
      return res.status(501).json({ message: "Cannot update user" });
    }

    return res
      .status(200)
      .json({ message: "User updated successfully", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error occurred" });
  }
};
