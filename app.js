const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swaggerConfig");
app.use(cors());
app.use(bodyParser.json());

connectDB();
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const authRoutes = require("./routes/authRoutes");
const carRoutes = require("./routes/carRoutes");

app.use("/api/users", authRoutes);
app.use("/api/cars", carRoutes);

module.exports = app;
