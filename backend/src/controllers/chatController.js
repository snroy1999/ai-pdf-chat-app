const index = require("../services/pineconeService");

const askQuestion = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const { generateEmbedding } = require("../services/embeddingService");

    const queryVector =
       await generateEmbedding(question);

    const searchResults = await index.query({
      vector: queryVector,
      topK: 5,
      includeMetadata: true,
    }); 

    return res.status(200).json({
      success: true,
      question,
      matches: searchResults.matches,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Search failed",
      error: error.message,
    });
  }
};

module.exports = {
  askQuestion,
};