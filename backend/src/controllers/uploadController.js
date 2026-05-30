const { generateEmbedding } = require("../services/embeddingService");
const { extractTextFromPDF } = require("../services/pdfService");
const chunkText = require("../utils/chunkText");
const index = require("../services/pineconeService");

const uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const filePath = req.file.path;

    // Extract text from PDF
    const extractedText = await extractTextFromPDF(filePath);

    console.log("TEXT LENGTH:", extractedText.length);

    // Split into chunks
    const chunks = chunkText(extractedText);

    console.log("TOTAL CHUNKS:", chunks.length);

    if (chunks.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No text chunks generated from PDF",
      });
    }

    // Generate embeddings
    const vectors = [];

    for (let i = 0; i < chunks.length; i++) {
      console.log(`Generating embedding ${i + 1}/${chunks.length}`);

      const embedding = await generateEmbedding(chunks[i]);

      console.log(`Embedding generated for chunk ${i + 1}`);

      vectors.push({
        id: `chunk-${Date.now()}-${i}`,
        values: embedding,
        metadata: {
          text: chunks[i].substring(0, 1000),
        },
      });
    }

    console.log("VECTORS COUNT:", vectors.length);
    console.log("VECTOR LENGTH:", vectors[0].values.length);

    // Store in Pinecone
    await index.upsert(vectors);

    console.log("PINECONE UPSERT SUCCESS");

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