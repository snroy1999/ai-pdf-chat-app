const fs = require("fs");
const pdfParse = require("pdf-parse");

const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);

    const pdfData = await pdfParse(dataBuffer);

    return pdfData.text;
  } catch (error) {
    console.log(error);

throw error;
  }
};

module.exports = {
  extractTextFromPDF,
};