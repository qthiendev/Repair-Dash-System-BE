const { fullJoin } = require("../services/test/fullJoin.service");

exports.getUserInfo = async (req, res) => {
    const { user_id } = req.params;

    try {
        const userData = await fullJoin(user_id);
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({ data: userData });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
