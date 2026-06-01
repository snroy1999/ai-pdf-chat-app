require("dotenv").config();

const express = require("express");
const cors = require("cors");
const uploadRoutes = require("./routes/uploadRoutes");
const chatRoutes = require("./routes/chatRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/chat", chatRoutes);

// const PORT = 5000;
const PORT = process.env.PORT || 5000;

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