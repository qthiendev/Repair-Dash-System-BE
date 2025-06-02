const cloudinary = require("../../../configs/cloudinary.config");
const terminal = require("../../../utils/terminal");

/**
 * Lists all image URLs in a specified Cloudinary folder.
 *
 * @param {string} folderURL - The full Cloudinary folder URL.
 * @returns {Promise<string[]>} - An array of secure URLs for images in the folder.
 * @throws {Error} - If the request to Cloudinary fails.
 */
exports.getImages = async (folderURL) => {
	try {
		if (!folderURL || folderURL.length === 0) {
			terminal.warning(`getImages | No folder URL provided.`);
			return [];
		}

		const folderName = folderURL.split("/").pop();

		terminal.debug(`Retrieving images from folder '${folderName}'...`);

		const { resources } = await cloudinary.search
			.expression(`folder:${folderName}`)
			.sort_by("public_id", "asc")
			.max_results(100)
			.execute();

		if (!resources || resources.length === 0) {
			terminal.warning(`No images found in folder '${folderURL}'.`);
			return [];
		}

		return resources.map((img) => img.secure_url);
	} catch (error) {
		console.error(
			`Error fetching images from folder '${folderURL}':`,
			error,
		);
		throw error;
	}
};
