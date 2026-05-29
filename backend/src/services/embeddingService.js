const axios = require("axios");

const generateEmbedding = async (text) => {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2",
      {
        inputs: text,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw new Error("Embedding generation failed");
  }
};

module.exports = {
  generateEmbedding,
};