const loginService = require("../services/auth/login.service");
const refreshService = require("../services/auth/refreshToken.service");
const authStatusService = require("../services/auth/authStatus.service");
const getRoleService = require("../services/auth/getRole.service");
const createUser = require("../services/user/createUser.service");
const sendLinkService = require("../services/auth/sendLink.service");
const resetPassService = require("../services/auth/resetPass.service");
const terminal = require("../../utils/terminal");
const client = require("../../configs/redis.config");

require("dotenv").config();

/**
 * Check authentication status.
 * @route GET /api/v1/auth/status
 */
exports.status = async (req, res) => {
  try {
    const token = req.cookies?.accessToken;
    const { status, user_id } = await authStatusService(token);
    const role = await getRoleService.byID(user_id);

    if (status && user_id && role) {
      terminal.info(
        `status.service.js | User ${user_id} currently active with role ${role}.`
      );
    }

    return res
      .status(200)
      .json({ auth_status: status, user_id: user_id, role: role });
  } catch (err) {
    terminal.error(`Login Error: ${err.message}`);
    return res.status(500).json({ message: "Unexpected error occurred" });
  }
};

/**
 * Authenticate user and generate JWT tokens.
 * @route POST /api/v1/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { identifier_email, password } = req.body;
    terminal.info(
      `auth.controller.js | Login attempt for: ${identifier_email} | ${password}`
    );

    const tokens = await loginService(identifier_email, password);

    if (!tokens.accessToken) {
      terminal.error("auth.controller.js | Missing Access Token");
      return res.status(400).json({ message: "Login failed." });
    }

    if (!tokens.refreshToken) {
      terminal.error("auth.controller.js | Missing Refresh Token");
      return res.status(400).json({ message: "Login failed." });
    }

    if (tokens === -1) {
      terminal.error("auth.controller.js | Error from service");
      return res.status(400).json({ message: "Login failed." });
    }

    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: process.env.CORS_HTTP_ONLY,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.CORS_SAME_SITE,
      path: "/",
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: process.env.CORS_HTTP_ONLY,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.CORS_SAME_SITE,
      path: "/",
    });

    terminal.success(
      `auth.controller.js | Login successful: ${identifier_email} | ${password}`
    );
    return res.status(200).json({ message: "Login successful." });
  } catch (err) {
    terminal.error(`Login Error: ${err.message}`);
    return res.status(500).json({ message: "Unexpected error occurred" });
  }
};

/**
 * Log out user by invalidating their tokens.
 * @route POST /api/v1/auth/logout
 */
exports.logout = async (req, res) => {
  try {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      terminal.error("Logout attempt with no access token.");
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.clearCookie("accessToken", {
      httpOnly: process.env.CORS_HTTP_ONLY,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.CORS_SAME_SITE,
      path: "/",
    });

    res.clearCookie("refreshToken", {
      httpOnly: process.env.CORS_HTTP_ONLY,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.CORS_SAME_SITE,
      path: "/",
    });

    terminal.success("User logged out successfully.");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    terminal.error(`Logout Error: ${err.message}`);
    return res.status(500).json({ message: "Unexpected error occurred" });
  }
};

/**
 * Refresh access token using refresh token.
 * @route POST /api/v1/auth/refresh
 */
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      terminal.warning("Refresh token missing in request.");
      return res.status(403).json({ message: "No refresh token provided" });
    }

    const newAccessToken = await refreshService(refreshToken);
    if (newAccessToken === -1) {
      terminal.error("Invalid or expired refresh token.");
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }

    res.cookie("accessToken", newAccessToken, {
      httpOnly: process.env.CORS_HTTP_ONLY,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.CORS_SAME_SITE,
      path: "/",
    });

    terminal.info("Access token refreshed and set in cookies successfully.");
    return res.status(200).json({ message: "Refresh successful." });
  } catch (err) {
    terminal.error(`Refresh Token Error: ${err.message}`);
    return res.status(500).json({ message: "Unexpected error occurred" });
  }
};

/**
 * Register a new user.
 * @route POST /api/v1/auth/register
 */
exports.register = async (req, res) => {
  try {
    const {
      identifier_email,
      password,
      role,
      user_full_name,
      user_phone_number,
      user_street,
      user_ward,
      user_district,
      user_city,
    } = req.body;

    const authData = { identifier_email, password, role };
    const userData = {
      user_full_name,
      user_phone_number,
      user_street,
      user_ward,
      user_district,
      user_city,
    };

    terminal.info(
      `auth.controller.js | Register attempt for: ${identifier_email}`
    );

    const userId = await createUser(authData, userData);

    if (userId === -1) {
      terminal.warning(
        `auth.controller.js | Email already registered: ${identifier_email}`
      );
      return res
        .status(400)
        .json({ message: "Email already registered", code: -1 });
    }

    if (userId === -2) {
      terminal.warning(
        `auth.controller.js | Alias already taken: ${user_alias}`
      );
      return res.status(400).json({ message: "Alias already taken", code: -2 });
    }

    terminal.success(
      `auth.controller.js | User registered successfully: ${identifier_email}`
    );
    return res
      .status(201)
      .json({ message: "User registered successfully", user_id: userId });
  } catch (err) {
    terminal.error(`Register Error: ${err.message}`);
    return res.status(500).json({ message: "Unexpected error occurred" });
  }
};

/**
 * Send link rest password for user.
 * @route POST /api/v1/auth/send_link
 */
exports.sendLink = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await sendLinkService(email);

    if (result === 1) {
      return res.status(201).json({ message: "Link send success", code : 1 });
    }

    if (result === -1) {
      return res.status(404).json({ message: "Email not found",code : -1 });
    }

    return res.status(400).json({ message: "Link send fail" });
  } catch (err) {
    terminal.error(`Register Error: ${err.message}`);
    return res.status(500).json({ message: "Unexpected error occurred" });
  }
};

/**
 * Verify OTP rest password for user.
 * @route POST /api/v1/auth/otp
 */
exports.otp = async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.query.email;

    if (!otp) {
      return res.status(400).json({ message: "OTP là bắt buộc." });
    }

    const storedOtp = await client.get(`otp:${email}`);
    if (!storedOtp) {
      return res
        .status(410)
        .json({ message: "OTP đã hết hạn hoặc không tồn tại." });
    }

    if (storedOtp !== otp) {
      return res.status(401).json({ message: "OTP không đúng." });
    }

    await client.del(`otp:${email}`);

    return res.status(200).json({ message: "Xác thực OTP thành công." });
  } catch (error) {
    console.error("Lỗi khi xác thực OTP:", error);
    return res.status(500).json({ message: "Lỗi server." });
  }
};

/**
 * Rest password.
 * @route POST /api/v1/auth/rest_password
 */
exports.resetPass = async (req, res) => {
  try {
    const { password } = req.body;
    const email = req.query.email;

    const result = await resetPassService(email, password);

    if (result) {
      return res.status(201).json("Rest password success");
    }

    return res.status(400).json({ message: "Rest password fail" });
  } catch (err) {
    terminal.error(`Register Error: ${err.message}`);
    return res.status(500).json({ message: "Unexpected error occurred" });
  }
};
