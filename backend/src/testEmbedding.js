const { generateEmbedding } = require("./services/embeddingService");

async function test() {
  const vector = await generateEmbedding(
    "What is data science?"
  );

  // console.log("Dimensions:", vector.length);
}

test();