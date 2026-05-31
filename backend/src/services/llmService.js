const axios = require("axios");

const generateAnswer = async (question, context) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-oss-20b:free",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant. Answer ONLY using the provided context. If the answer is not present in the context, say 'I could not find the answer in the document.'",
          },
          {
            role: "user",
            content: `
Context:
${context}

Question:
${question}
            `,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw new Error("LLM answer generation failed");
  }
};

module.exports = {
  generateAnswer,
};