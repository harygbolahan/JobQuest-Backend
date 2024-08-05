const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const productRoutes = require("./routes/product");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");
const companyRoutes = require("./routes/company");

const errorHandler = require("./middleware/error");
const { cloudinaryConfig } = require("./utils/cloudinary");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors("*"));
app.use("*", cloudinaryConfig);
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to JobQuest",
  });
});

app.get("/api/v1", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to JobQuest API",
  });
});

// app.use((req, res, next) => {
//   console.log("Davido is the GOAT (001)");
//   next();
// });

app.use("/api/v1/products", productRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/company", companyRoutes);

app.all("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} with method ${req.method} on this server. Route not defined`,
  });
});

// Calling our error handler
app.use(errorHandler);

module.exports = app;
