const express = require("express");

const router = express.Router();

const upload = require("../utils/multerConfig");

const { uploadPdf } = require("../controllers/uploadController");

router.post("/", upload.single("pdf"), uploadPdf);

module.exports = router;