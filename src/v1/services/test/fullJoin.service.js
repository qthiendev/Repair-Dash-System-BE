const { User, Authentication, SystemReport, Service, Employee, Order } = require("../../models/index");

exports.fullJoin = async (user_id) => {
    try {
        if (!user_id) {
            return await User.findAll({
                include: [
                    { model: Authentication, as: "authentication" },
                    { model: SystemReport, as: "reports" },
                    { model: Service, as: "services" },
                    { model: Employee, as: "employees" },
                    { model: Order, as: "orders" },
                ],
            });
        }

        return await User.findOne({
            where: { user_id },
            include: [
                { model: Authentication, as: "authentication" },
                { model: SystemReport, as: "reports" },
                { model: Service, as: "services" },
                { model: Employee, as: "employees" },
                { model: Order, as: "orders" },
            ],
        });
    } catch (error) {
        console.error("Error fetching user details:", error);
        throw error;
    }
};
