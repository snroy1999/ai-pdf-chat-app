const { generateEmbedding } = require("../services/embeddingService");
const { extractTextFromPDF } = require("../services/pdfService");
const chunkText = require("../utils/chunkText");

const index = require("../services/pineconeService");
// const generateDummyVector = require("../utils/dummyEmbedding");

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
    const vectors = [];

    for (let i = 0; i < chunks.length; i++) {
      console.log(
        `Generating embedding ${i + 1}/${chunks.length}`
    );

    const embedding = await generateEmbedding(
      chunks[i]
   );

   vectors.push({
    id: `chunk-${Date.now()}-${i}`,
    values: embedding,
    metadata: {
      text: chunks[i].substring(0, 1000),
    },
  });
}

await index.upsert(vectors);
    console.log("VECTORS COUNT:", vectors.length);
    console.log("VECTOR LENGTH:", vectors[0].values.length);

    // TEST WITH A SINGLE VECTOR FIRST
    await index.upsert(vectors);

    return res.status(200).json({
      success: true,
      message: "Chunks stored in Pinecone",
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