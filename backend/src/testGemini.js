require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
  try {
    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY
    );

    const models = await genAI.listModels();

    console.log(models);
  } catch (error) {
    console.error(error);
  }
}

test();










// require("dotenv").config();

// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// async function test() {
//   try {
//     const model = genAI.getGenerativeModel({
//       model: "gemini-1.5-flash",
//     });

//     const result = await model.generateContent("Say hello");

//     console.log(result.response.text());
//   } catch (error) {
//     console.error(error);
//   }
// }

// test();