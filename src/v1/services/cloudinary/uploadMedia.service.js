const cloudinary = require("../../../configs/cloudinary.config");
const terminal = require("../../../utils/terminal");
const deleteMedia = require("./deleteMedia.service");

/**
 * Uploads a single image (Base64 or file buffer) to Cloudinary with a specific filename.
 *
 * @param {string} fileName - The desired name of the uploaded file (public_id).
 * @param {string|Buffer} file - Base64-encoded image string or file buffer.
 * @returns {Promise<string>} - The URL of the uploaded image.
 * @throws {Error} - If the upload fails.
 */
exports.uploadImage = async (fileName, file) => {
	try {
		const result = await cloudinary.uploader.upload(file, {
			public_id: fileName,
			overwrite: true,
			invalidate: true,
		});
		terminal.success(
			`uploadMedia.service.js -> uploadImage | Image uploaded: ${result.secure_url}`,
		);
		return result.secure_url;
	} catch (error) {
		console.error(`Error uploading image "${fileName}":`, error);
		return null;
	}
};

/**
 * Uploads multiple images (Base64 or file buffer) to a specified Cloudinary folder with a structured public_id.
 *
 * @param {string} folderName - The folder where images will be uploaded.
 * @param {Array<string|Buffer>} files - Array of Base64-encoded image strings or file buffers.
 * @returns {Promise<Array<string>>} - An array of uploaded image URLs.
 * @throws {Error} - If any upload fails.
 */
exports.uploadImages = async (folderName, files) => {
	try {
		if (!Array.isArray(files) || files.length === 0) {
			throw new Error(`Invalid files array: ${JSON.stringify(files)}`);
		}

		await deleteMedia.deleteImages(folderName);

		const uploadPromises = files.map(async (file, index) => {
			const fileName = `image_${index + 1}`;
			const result = await cloudinary.uploader.upload(file, {
				public_id: fileName,
				invalidate: true,
				folder: folderName,
			});
			return result.secure_url;
		});

		const results = await Promise.all(uploadPromises);

		const folderUrl =
			results.length > 0
				? results[0].replace(/\/image_1\..+$/, "")
				: null;
		terminal.success(
			`uploadMedia.service.js -> uploadImages | Folder uploaded: ${folderUrl}`,
		);

		return folderUrl;
	} catch (error) {
		terminal.error(
			`Error uploading images to folder "${folderName}":`,
			error.message,
		);
		return null;
	}
};
