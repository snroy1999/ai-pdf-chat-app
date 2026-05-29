const { extractTextFromPDF } = require("../services/pdfService");

const chunkText = require("../utils/chunkText");

const {
  generateEmbedding,
} = require("../services/embeddingService");

const uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const filePath = req.file.path;

    const extractedText = await extractTextFromPDF(filePath);

    const chunks = chunkText(extractedText);

    const embeddings = [];

    for (const chunk of chunks) {
      const embedding = await generateEmbedding(chunk);

      embeddings.push({
        text: chunk,
        embedding,
      });
    }

    res.status(200).json({
      success: true,
      message: "PDF processed successfully",
      totalChunks: chunks.length,
      sampleChunk: chunks[0],
      embeddingDimensions: embeddings[0].embedding.length,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "PDF processing failed",
      error: error.message,
    });
  }
};

module.exports = {
  uploadPdf,
};