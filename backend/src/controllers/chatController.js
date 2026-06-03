const index = require("../services/pineconeService");
const { generateEmbedding } = require("../services/embeddingService");
const { generateAnswer } = require("../services/llmService");

const askQuestion = async (req, res) => {
  try {
    const { question, documentId } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    console.log("QUESTION:", question);
    console.log("DOCUMENT ID:", documentId);

    const queryVector = await generateEmbedding(question);

    const queryOptions = {
      vector: queryVector,
      topK: 8,
      includeMetadata: true,
    };

    // Day 11 preparation for document filtering
    if (documentId) {
      queryOptions.filter = {
        documentId: { $eq: documentId },
      };
    }

    const searchResults = await index.query(queryOptions);

    console.log(
      "MATCHES FOUND:",
      searchResults.matches.length
    );

    const context = searchResults.matches
      .map((match) => match.metadata.text)
      .join("\n\n");

    console.log(
       "CONTEXT LENGTH:",
        context.length
    );

    // console.log("CONTEXT LENGTH:", context.length);

    const answer = await generateAnswer(
      question,
      context
    );

    return res.status(200).json({
      success: true,
      question,
      answer,
      documentId,
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