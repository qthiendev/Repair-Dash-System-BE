const { Employee } = require("../../models/index.model");
const retrieveMedia = require("../cloudinary/retrieveMedia.service");

module.exports = async (
  owner_id,
  employee_id,
  current_page = 1,
  limit = 10
) => {
  const totalItems = await Employee.count({ where: { delete_flag: false } });
  const total_pages = Math.ceil(totalItems / limit);
  const offset = (current_page - 1) * limit;
  if (employee_id) {
    const employee = await Employee.findOne({
      where: {
        employee_id,
        owner_id,
        delete_flag: false,
      },
      limit,
      offset,
      order: [["employee_id", "DESC"]],
    });

    if (!employee) {
      return -1;
    }

    return employee;
  }

  const employees = await Employee.findAll({
    where: {
      owner_id,
      delete_flag: false,
    },
    limit,
    offset,
    order: [["employee_id", "DESC"]],
  });

  return {
    listEmployee: employees,
    limit,
    current_page,
    total_pages,
  };
};
