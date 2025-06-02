const User = require("./user.model");
const Authentication = require("./authentication.model");
const SystemReport = require("./systemReport.model");
const Service = require("./service.model");
const Employee = require("./employee.model");
const Order = require("./order.model");
const Favorite = require("./favorite.model");
const Payment = require("./payment.model");

User.hasOne(Authentication, {
	foreignKey: "authentication_id",
	as: "authentication",
});
Authentication.belongsTo(User, {
	foreignKey: "authentication_id",
	as: "authentication",
});

User.hasMany(SystemReport, { foreignKey: "user_id", as: "reports" });
SystemReport.belongsTo(User, { foreignKey: "user_id", as: "reporter" });

User.hasMany(Service, { foreignKey: "owner_id", as: "services" });
Service.belongsTo(User, { foreignKey: "owner_id", as: "owner" });

User.hasMany(Employee, { foreignKey: "owner_id", as: "employees" });
Employee.belongsTo(User, { foreignKey: "owner_id", as: "employer" });

User.hasMany(Order, { foreignKey: "customer_id", as: "orders" });
Order.belongsTo(User, { foreignKey: "customer_id", as: "customer" });

Order.belongsTo(Service, { foreignKey: "service_id", as: "service" });
Service.hasMany(Order, { foreignKey: "service_id", as: "orders" });

Order.belongsTo(Employee, { foreignKey: "employee_id", as: "employee" });
Employee.hasMany(Order, { foreignKey: "employee_id", as: "orders" });

User.hasMany(Favorite, { foreignKey: "customer_id", as: "favorites" });
Favorite.belongsTo(User, { foreignKey: "customer_id", as: "customer" });

User.hasMany(Favorite, { foreignKey: "store_id", as: "store_favorites" });
Favorite.belongsTo(User, { foreignKey: "store_id", as: "store" });

Service.hasMany(Favorite, { foreignKey: "service_id", as: "favorites" });
Favorite.belongsTo(Service, { foreignKey: "service_id", as: "service" });

User.hasMany(Payment, { foreignKey: "user_id", as: "payments" });
Payment.belongsTo(User, { foreignKey: "user_id", as: "user" });

module.exports = {
	User,
	Authentication,
	SystemReport,
	Service,
	Employee,
	Order,
	Favorite,
	Payment,
};
