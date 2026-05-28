const express = require("express");
const cors = require("cors");

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});