const fs = require("fs");
const path = require("path");

module.exports = {
  // Example: Save a text file
  saveTextFile: (content, filename) => {
    print("content", content);
    const filePath = path.join(__dirname, filename); // Change directory as needed
    fs.writeFile(filePath, content, "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
      } else {
        console.log(`File saved successfully at ${filePath}`);
      }
    });
  },
  // Example: Save a binary file (like an image or PDF)
  saveBinaryFile: (content, filename) => {
    print("content", content);
    const filePath = path.join(__dirname, filename); // Change directory as needed
    fs.writeFile(filePath, content, { encoding: "binary" }, (err) => {
      if (err) {
        console.error("Error writing file:", err);
      } else {
        console.log(`File saved successfully at ${filePath}`);
      }
    });
  },
  downloadFile: async (fileContent) => {
    // Specify the path where you want to save the file
    const downloadPath = path.join(
      process.env.HOME || process.env.USERPROFILE,
      "Downloads",
      "response.pdf"
    );

    // Write the file content to the specified path
    fs.writeFile(downloadPath, fileContent, (err) => {
      if (err) {
        console.error("Error saving the file:", err);
      } else {
        console.log("File downloaded successfully to:", downloadPath);
      }
    });
  },
};
