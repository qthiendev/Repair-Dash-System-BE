const { Employee, User } = require("../../models/index.model");
const uploadMedia = require("../cloudinary/uploadMedia.service");
const terminal = require("../../../utils/terminal");

module.exports = async (owner_id, employee_full_name, avatar_image) => {
  const owner = await User.findByPk(owner_id);

  if (!owner) {
    terminal.warning(`service.employee.js | Owner ${owner_id} not found.`);
    return -1;
  }

  const newEmployee = await Employee.create({
    owner_id,
    employee_full_name,
  });

  let fileUrl = null;
  if (avatar_image) {
    fileUrl = await uploadMedia.uploadImage(
      `employee_${newEmployee.employee_id}`,
      avatar_image
    );
    await newEmployee.update({ employee_avatar_url: fileUrl });
  }

  return newEmployee.employee_id;
};
