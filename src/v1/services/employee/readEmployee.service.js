const { Employee, Order } = require("../../models/index.model");
const { Sequelize } = require("sequelize");

module.exports = async (
  owner_id,
  employee_id,
  current_page = 1,
  limit = 10
) => {
  const totalItems = await Employee.count({
    where: { delete_flag: false, owner_id },
  });
  const total_pages = Math.ceil(totalItems / limit);
  const offset = (current_page - 1) * limit;

  if (employee_id) {
    const employee = await Employee.findOne({
      where: {
        employee_id,
        owner_id,
        delete_flag: false,
      },
      attributes: {
        include: [
          [
            Sequelize.literal(
              `(SELECT COUNT(*) FROM orders WHERE orders.employee_id = Employee.employee_id)`
            ),
            "total_orders",
          ],
          [
            Sequelize.literal(
              `(SELECT SUM(CASE WHEN orders.order_status = 'PROCESSING' THEN 1 ELSE 0 END) FROM orders WHERE orders.employee_id = Employee.employee_id)`
            ),
            "status",
          ],
        ],
      },
    });

    if (!employee) {
      return { listEmployee: [], total_pages: 0, current_page, limit };
    }

    const formattedEmployee = {
      ...employee.get({ plain: true }),
      total_orders: Number(employee.dataValues.total_orders) || 0,
      status: (Number(employee.dataValues.status) || 0) > 0,
    };

    return {
      ...formattedEmployee,
      limit,
      current_page,
      total_pages: 1,
    };
  }

  const employees = await Employee.findAll({
    where: {
      owner_id,
      delete_flag: false,
    },
    limit,
    offset,
    order: [["employee_id", "DESC"]],
    attributes: {
      include: [
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM orders WHERE orders.employee_id = Employee.employee_id)`
          ),
          "total_orders",
        ],
        [
          Sequelize.literal(
            `(SELECT SUM(CASE WHEN orders.order_status = 'PROCESSING' THEN 1 ELSE 0 END) FROM orders WHERE orders.employee_id = Employee.employee_id)`
          ),
          "status",
        ],
      ],
    },
  });

  const formattedEmployees = employees.map((employee) => ({
    ...employee.get({ plain: true }),
    total_orders: Number(employee.dataValues.total_orders) || 0,
    status: (Number(employee.dataValues.status) || 0) > 0,
  }));

  return {
    employees: formattedEmployees,
    limit,
    current_page,
    total_pages,
  };
};
