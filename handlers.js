const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = {
  // reading images and files from code interpreter
  // https://platform.openai.com/docs/assistants/tools/code-interpreter
  readFile: async (file) => {
    const file_id = file.file_path.file_id;
    onsole.log(file_id);

    try {
      const response = await openai.files.content(file_id);

      // Extract the binary data from the Response object
      const image_data = await response.arrayBuffer();

      // Convert the binary data to a Buffer
      const image_data_buffer = Buffer.from(image_data);

      console.log(image_data_buffer);

      // Save the image to a specific location
      fs.writeFileSync("./image.png", image_data_buffer);
    } catch (error) {
      console.error(error);
    }
  },
};
