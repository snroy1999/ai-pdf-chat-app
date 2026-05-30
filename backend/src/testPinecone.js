require("dotenv").config();

const { Pinecone } = require("@pinecone-database/pinecone");

async function test() {
  try {
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    const index = pc.index(process.env.PINECONE_INDEX);

    const result = await index.upsert([
      {
        id: "test-1",
        values: Array(384).fill(0.5),
        metadata: {
          text: "hello",
        },
      },
    ]);

    // console.log("UPSERT SUCCESS");
    // console.log(result);
  } catch (error) {
    console.error(error);
  }
}

test();