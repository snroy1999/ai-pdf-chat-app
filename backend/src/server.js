require("dotenv").config();

const express = require("express");
const cors = require("cors");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

app.get("/", (req, res) => {
  res.json({
    message: "AI PDF Chat Backend Running",
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "Server healthy",
  });
});

app.use("/api/upload", uploadRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});