const axios = require('axios');

const key = "AIzaSyBcovZCnM7iNUXg4E6OD9gfcCkxUJIU8aQ";

async function testModel(modelName) {
  try {
    const res = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`, {
      contents: [{ parts: [{ text: "Hello" }] }]
    });
    console.log(`[SUCCESS] ${modelName} -> Status: ${res.status}`);
  } catch (e) {
    const status = e.response ? e.response.status : e.message;
    const data = e.response && e.response.data ? JSON.stringify(e.response.data) : 'No detail';
    console.error(`[ERROR] ${modelName} -> Status: ${status} | Detail: ${data}`);
  }
}

async function run() {
  await testModel('gemini-1.5-flash');
  await testModel('gemini-1.5-flash-latest');
  await testModel('gemini-1.5-pro');
  await testModel('gemini-1.5-pro-latest');
}

run();
