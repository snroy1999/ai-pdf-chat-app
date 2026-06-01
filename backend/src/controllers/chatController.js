const index = require("../services/pineconeService");
const { generateEmbedding } = require("../services/embeddingService");
const { generateAnswer } = require("../services/llmService");
const askQuestion = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const queryVector = await generateEmbedding(question);

    const searchResults = await index.query({
      vector: queryVector,
      topK: 8,
      includeMetadata: true,
    });

    const context = searchResults.matches
      .map((match) => match.metadata.text)
      .join("\n\n");

    const answer = await generateAnswer(
      question,
      context
    );

    return res.status(200).json({
       success: true,
       question,
       answer,
       sourceChunks: searchResults.matches.map(
         (match) => match.metadata.text
       ),
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