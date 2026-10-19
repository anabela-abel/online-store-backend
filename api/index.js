
const app = require("../server");
const connectDB = require("../config/db");

module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("API initialization failed:", error);

    return res.status(500).json({
      message: "Database connection failed"
    });
  }
};
