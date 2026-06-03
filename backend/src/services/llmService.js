const axios = require("axios");

const generateAnswer = async (question, context) => {
  try {
    console.log("QUESTION:", question);
    console.log("CONTEXT LENGTH:", context.length);

    if (!context || context.trim().length === 0) {
      return "I could not find the answer in the document.";
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-oss-20b:free",
        messages: [
          {
            role: "system",
            content: `
You are a PDF assistant.

Answer questions ONLY using the provided context.

Rules:
1. If the answer exists in the context, explain it clearly.
2. Do not make up information.
3. If the answer is not present in the context, reply exactly:
"I could not find the answer in the document."
            `,
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
        temperature: 0.2,
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://ai-pdf-chat-app-mry7.onrender.com",
          "X-Title": "AI PDF Chat App",
        },
        timeout: 30000,
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("OPENROUTER ERROR:");
    console.error(error.response?.data || error.message);

    throw new Error("LLM answer generation failed");
  }
};

module.exports = {
  generateAnswer,
};