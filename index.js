const OpenAI = require("openai");
var readlineSync = require("readline-sync");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const LANGUAGE_MODEL = "gpt-3.5-turbo-1106";
const DEFAULT_USER_MESSAGE =
  "I need to solve the equation `3x + 11 = 14`. Can you help me?";
const ASSISTANT_NAME = "Math Tutor";
const ASSISTANT_DEFAULT_INSTRUCTIONS =
  "You are a personal math tutor. Write and run code to answer math questions.";

const downloadFile = async (fileContent) => {
  // Specify the path where you want to save the file
  const downloadPath = path.join(
    process.env.HOME || process.env.USERPROFILE,
    "Downloads",
    "response.pdf"
  );

  console.log(process.env.HOME);

  // Write the file content to the specified path
  fs.writeFile(downloadPath, fileContent, (err) => {
    if (err) {
      console.error("Error saving the file:", err);
    } else {
      console.log("File downloaded successfully to:", downloadPath);
    }
  });
};

// Step 1: Create an Assistant
const createAssistant = async () => {
  const assistant = await openai.beta.assistants.create({
    name: ASSISTANT_NAME,
    instructions: ASSISTANT_DEFAULT_INSTRUCTIONS,
    tools: [{ type: "code_interpreter" }],
    model: LANGUAGE_MODEL,
  });
  return assistant;
};

// Step 2: Create a Thread
const createThread = async () => {
  return await openai.beta.threads.create();
};

// Step 3: Add a Message to a Thread
const addMessageToThread = async (thread, input) => {
  try {
    const message = await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: input,
    });
    return message;
  } catch (error) {
    console;
  }
};

// Step 4: Run the Assistant
const runThread = async (assistant, thread) => {
  try {
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
      instructions: "Please address the user as Rok Benko.",
    });
    console.log("This is the run object: ", run, "\n");

    return run;
  } catch (error) {
    console.error(error);
  }
};

// Step 5: Check the Run Status
const checkRunStatus = async (run, thread) => {
  try {
    keepRetrievingRun = await openai.beta.threads.runs.retrieve(
      thread.id,
      run.id
    );
    console.log("This is the run status: ", run.status, "\n");
  } catch (error) {
    console.error(error);
  }
};

// Step 6: Retrieve and display the Messages
const retrieveMessages = async (run, thread, message) => {
  if (run.status === "completed") {
    console.log("This is the run status: ", run.status, "\n");
    const messages = await openai.beta.threads.messages.list(thread.id);

    console.log(
      "user: ",
      message.content[message.content.length - 1].text.value
    );
    console.log("assistant: ", messages.data[0].content[0].text.value);

    console.log(messages.data[0].content[0].text);

    if (messages.data[0].content[0].text.annotations?.length > 0) {
      console.log(
        "annotations: ",
        messages.data[0].content[0].text.annotations
      );
      downloadFile(messages.data[0].content[0].text.annotations[0].text);
    }
  }
};

function getInput(promptMessage) {
  return readlineSync.question(promptMessage, {
    hideEchoBack: false, // The typed characters won't be displayed if set to true
  });
}

async function main() {
  console.log("\n\n----------------------------------");
  console.log("           🤖 AI ASSISTANT           ");
  console.log("---------------------------------- \n ");
  console.log("to exit Chat type 'X'");

  // Step 1: Create an Assistant
  const assistant = await createAssistant();
  // Step 2: Create a Thread
  const thread = await createThread();

  while (true) {
    // Step 3: Add a Message to a Thread
    let userMessage = getInput("You: ");
    if (userMessage.toUpperCase() === "X") {
      console.log("Goodbye!");
      process.exit();
    }
    if (!!userMessage) {
      const message = await addMessageToThread(thread, userMessage);

      // Step 4: Run the Assistant
      let run = await runThread(assistant, thread);

      // Step 5: Check the Run Status
      while (run.status !== "completed") {
        await checkRunStatus(run, thread);
        // Re-fetch the run status inside the loop
        run = await openai.beta.threads.runs.retrieve(thread.id, run.id);

        if (run.status === "failed" || run.status === "expired") {
          console.log("Chat terminated.");
          process.exit();
        }
      }

      // Step 6: Retrieve and display the Messages
      await retrieveMessages(run, thread, message);
    }
  }
}

main();
