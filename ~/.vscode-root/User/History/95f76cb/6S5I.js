/**
 * DISCLAIMER: This code uses a selfbot, which violates Discord's Terms of Service.
 * Use at your own risk. This example is for educational purposes only.
 */

const fs = require("fs");
const path = require("path");
const { Client } = require("discord.js-selfbot-v13");

const client = new Client();
client.commands = new Map();

// Load commands from the "cmd" folder using a template literal for require.
const commandsPath = path.join(__dirname, "cmd");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  // Use a static string literal pattern that pkg can analyze.
  const command = require(`./cmd/${file}`);
  if (command.name && typeof command.execute === "function") {
    client.commands.set(command.name.toLowerCase(), command);
    console.log(`Loaded command: ${command.name}`);
  } else {
    console.warn(
      `The command in ./cmd/${file} is missing a required "name" or "execute" property.`
    );
  }
}

// Listen for new messages (command handling).
client.on("messageCreate", async (message) => {
  // Process only messages from yourself.
  if (message.author.id !== client.user.id) return;
  if (!message.content.startsWith(global.config.prefix)) return;

  const args = message.content.slice(global.config.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(`Error executing command ${commandName}:`, error);
  }
});

client.on("ready", () => {
  console.log("Logged in as " + client.user.tag);
});

// Use dynamic import for Inquirer (ESM-only package).
async function start() {
  const inquirerModule = await import("inquirer");
  const inquirer = inquirerModule.default;
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "token",
      message: "Enter your Discord token:",
    },
    {
      type: "input",
      name: "prefix",
      message: "Enter the command prefix:",
      default: "!",
    },
  ]);

  global.config = {
    token: answers.token,
    prefix: answers.prefix,
  };

  client.login(answers.token);
}

start();
