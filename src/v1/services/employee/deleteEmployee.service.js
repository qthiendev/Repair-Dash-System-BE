const { Employee } = require("../../models/index.model");

module.exports = async (owner_id, employee_id) => {
  const employee = await Employee.findOne({
    where: {
      owner_id,
      employee_id,
      delete_flag: false,
    },
  });

  if (!employee) {
    return -1;
  }

  const [updatedRows] = await Employee.update(
    {
      delete_flag: true,
      updated_at: new Date(),
    },
    {
      where: { owner_id, employee_id },
    }
  );

  return updatedRows > 0;
};
