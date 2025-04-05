const { Employee } = require("../../models/index.model");
const retrieveMedia = require("../cloudinary/retrieveMedia.service");

module.exports = async (employee_id, owner_id) => {
  const employee = await Employee.findOne({
    where: {
      employee_id,
      owner_id,
      delete_flag: false,
    },
  });

  if (!employee) {
    return -1;
  }

  return employee;
};
