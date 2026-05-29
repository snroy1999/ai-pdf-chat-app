const { extractTextFromPDF } = require("../services/pdfService");
const chunkText = require("../utils/chunkText");

const index = require("../services/pineconeService");
const generateDummyVector = require("../utils/dummyEmbedding");

const uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const filePath = req.file.path;

    // Extract text
    const extractedText = await extractTextFromPDF(filePath);

    console.log("TEXT LENGTH:", extractedText.length);

    // Create chunks
    const chunks = chunkText(extractedText);

    console.log("TOTAL CHUNKS:", chunks.length);

    // Safety check
    if (chunks.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No text chunks generated from PDF",
      });
    }

    // Create vectors
    const vectors = chunks.map((chunk, indexNumber) => ({
      id: `chunk-${Date.now()}-${indexNumber}`,
      values: generateDummyVector(),
      metadata: {
        text: chunk.substring(0, 1000), // keep metadata small
      },
    }));

    console.log("VECTORS COUNT:", vectors.length);
    console.log("VECTOR LENGTH:", vectors[0].values.length);

    // TEST WITH A SINGLE VECTOR FIRST
    await index.upsert([
      {
        id: "test-vector",
        values: Array(384).fill(0.5),
        metadata: {
          text: "test",
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Pinecone test vector stored successfully",
      totalChunks: chunks.length,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "PDF processing failed",
      error: error.message,
    });
  }
};

module.exports = {
  uploadPdf,
};