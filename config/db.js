const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("DB connection started", process.env.MONGO_URI);
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB connection success");
  } catch (error) {
    console.log("DB connection failed", error);
    process.exit(1);
  }
};

module.exports = connectDB;
