/**
 * DISCLAIMER: This code uses a selfbot, which violates Discord's Terms of Service.
 * Use at your own risk. This example is for educational purposes only.
 */

import { Client } from "discord.js-selfbot-v13";
import inquirer from "inquirer";
import commands from "./commands.mjs"; // Use a static commands index for pkg-like file inclusion, if needed

// Create client instance
const client = new Client();
client.commands = new Map();

// Load commands from your commands index (commands.mjs)
for (const key in commands) {
  const command = commands[key];
  if (command.name && typeof command.execute === "function") {
    client.commands.set(command.name.toLowerCase(), command);
    console.log(`Loaded command: ${command.name}`);
  } else {
    console.warn(`Command ${key} is missing a "name" or "execute" property.`);
  }
}

// Message listener for command handling
client.on("messageCreate", async (message) => {
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
  console.log("Logged in as", client.user.tag);
});

// Prompt for config and log in
async function start() {
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
