/**
 * DISCLAIMER: This code uses a selfbot, which violates Discord's Terms of Service.
 * Use at your own risk. This example is for educational purposes only.
 */

import { Client } from "discord.js-selfbot-v13";
import inquirer from "inquirer";
import chalk from "chalk";

// Utility: returns a promise that resolves after a random delay between min and max (milliseconds)
function randomDelay(min, max) {
  const delayTime = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, delayTime));
}

// Create the Discord client
const client = new Client();

// Command logic: Clone Server (cloneguild)
async function cloneguild(dummyMessage, args) {
  if (dummyMessage.author.id !== client.user.id) return;

  if (args.length < 3) {
    return dummyMessage.reply(
      `Usage: cloneguild <sourceGuildId> <targetGuildId> <cloneEmojis:true|false>`
    );
  }

  const sourceId = args[0];
  const targetId = args[1];
  const cloneEmojis = args[2].toLowerCase() === "true";

  const sourceGuild = client.guilds.cache.get(sourceId);
  if (!sourceGuild) {
    return dummyMessage.reply(`Source guild with ID ${sourceId} not found.`);
  }

  const targetGuild = client.guilds.cache.get(targetId);
  if (!targetGuild) {
    return dummyMessage.reply(`Target guild with ID ${targetId} not found.`);
  }

  dummyMessage.reply(
    `Starting cloning from **${sourceGuild.name}** to **${targetGuild.name}**. This might take some time...`
  );

  // Clone server name and icon
  try {
    await randomDelay(2000, 5000);
    await targetGuild.setName(sourceGuild.name, "Cloning server name");
    if (sourceGuild.icon) {
      const iconURL = sourceGuild.iconURL({
        dynamic: true,
        format: "png",
        size: 1024,
      });
      await randomDelay(2000, 5000);
      await targetGuild.setIcon(iconURL, "Cloning server icon");
    }
    console.log(chalk.green(`Cloned server name and icon to ${targetGuild.name}`));
  } catch (err) {
    console.error(chalk.red("Failed to clone server name/icon:"), err);
    dummyMessage.reply("Warning: Could not update target server's name/icon.");
  }

  // Delete all channels in target guild
  for (const channel of targetGuild.channels.cache.values()) {
    try {
      await randomDelay(2000, 5000);
      await channel.delete("Cloning: removing old channels");
    } catch (e) {
      console.error(chalk.red(`Failed to delete channel ${channel.name}:`), e);
    }
  }

  // Delete all roles (except @everyone) in target guild
  for (const role of targetGuild.roles.cache.filter((r) => r.name !== "@everyone").values()) {
    try {
      await randomDelay(2000, 5000);
      await role.delete("Cloning: removing old roles");
    } catch (e) {
      console.error(chalk.red(`Failed to delete role ${role.name}:`), e);
    }
  }

  // Clone roles from source guild
  const rolesToClone = sourceGuild.roles.cache
    .filter((r) => r.name !== "@everyone")
    .sort((a, b) => b.position - a.position);
  const roleMapping = new Map();
  for (const role of rolesToClone.values()) {
    try {
      await randomDelay(2000, 5000);
      const newRole = await targetGuild.roles.create({
        reason: "Cloned role",
        name: role.name,
        color: role.hexColor,
        hoist: role.hoist,
        permissions: role.permissions.bitfield,
        mentionable: role.mentionable,
      });
      roleMapping.set(role.id, newRole.id);
      console.log(chalk.green(`Cloned role: ${role.name}`));
    } catch (err) {
      console.error(chalk.red(`Failed to clone role ${role.name}:`), err);
    }
  }

  // Clone channels from source guild
  const channelMapping = new Map();
  const categories = sourceGuild.channels.cache.filter((c) => c.type === "GUILD_CATEGORY");
  for (const category of categories.values()) {
    try {
      await randomDelay(2000, 5000);
      const newCategory = await targetGuild.channels.create(category.name, {
        type: category.type,
        position: category.position,
        topic: category.topic,
        nsfw: category.nsfw,
        reason: "Cloned category",
      });
      channelMapping.set(category.id, newCategory.id);
      console.log(chalk.green(`Cloned category: ${category.name}`));
    } catch (err) {
      console.error(chalk.red(`Failed to clone category ${category.name}:`), err);
    }
  }

  const channels = sourceGuild.channels.cache
    .filter((c) => c.type !== "GUILD_CATEGORY")
    .sort((a, b) => a.position - b.position);
  for (const channel of channels.values()) {
    try {
      await randomDelay(2000, 5000);
      let parentId = null;
      if (channel.parentId && channelMapping.has(channel.parentId)) {
        parentId = channelMapping.get(channel.parentId);
      }
      await targetGuild.channels.create(channel.name, {
        type: channel.type,
        topic: channel.topic,
        nsfw: channel.nsfw,
        bitrate: channel.bitrate,
        userLimit: channel.userLimit,
        rateLimitPerUser: channel.rateLimitPerUser,
        parent: parentId,
        position: channel.position,
        reason: "Cloned channel",
      });
      console.log(chalk.green(`Cloned channel: ${channel.name}`));
    } catch (err) {
      console.error(chalk.red(`Failed to clone channel ${channel.name}:`), err);
    }
  }

  // Optionally clone emojis if enabled
  if (cloneEmojis) {
    const emojis = sourceGuild.emojis.cache;
    for (const emoji of emojis.values()) {
      try {
        await randomDelay(2000, 5000);
        await targetGuild.emojis.create(emoji.url, emoji.name, {
          reason: "Cloned emoji",
        });
        console.log(chalk.green(`Cloned emoji: ${emoji.name}`));
      } catch (err) {
        console.error(chalk.red(`Failed to clone emoji ${emoji.name}:`), err);
      }
    }
  }

  dummyMessage.reply(`Cloning complete. **${targetGuild.name}** now mirrors **${sourceGuild.name}**.`);
}

// Set the terminal title to "GodKode's Nebula AIO Tool"
function setTerminalTitle() {
  process.stdout.write("\x1b]0;GodKode's Nebula AIO Tool\x07");
}

// Main function: prompt for token, login, then show command menu
async function start() {
  // Set terminal title
  setTerminalTitle();

  // Prompt for Discord token
  const { token } = await inquirer.prompt([
    {
      type: "input",
      name: "token",
      message: "Enter your Discord token:",
    },
  ]);

  // Log in to Discord
  client.login(token);

  // When ready, show the command menu
  client.once("ready", async () => {
    console.log(`Logged in as ${client.user.tag}`);

    // Display command menu
    const { command } = await inquirer.prompt([
      {
        type: "list",
        name: "command",
        message: "Select a command to execute:",
        choices: [
          { name: "Clone Server", value: "cloneguild" },
          { name: "Another command here", value: "another" },
        ],
      },
    ]);

    // Create a dummy message object for command functions
    const dummyMessage = {
      author: { id: client.user.id },
      client,
      reply: (msg) => console.log(chalk.blue("Reply:"), msg),
    };

    // Based on the selection, prompt for additional parameters and execute command
    if (command === "cloneguild") {
      const answers = await inquirer.prompt([
        {
          type: "input",
          name: "sourceGuildId",
          message: "Enter the source guild ID:",
        },
        {
          type: "input",
          name: "targetGuildId",
          message: "Enter the target guild ID:",
        },
        {
          type: "confirm",
          name: "cloneEmojis",
          message: "Do you want to clone emojis?",
          default: false,
        },
      ]);

      const args = [
        answers.sourceGuildId,
        answers.targetGuildId,
        answers.cloneEmojis ? "true" : "false",
      ];
      await cloneguild(dummyMessage, args);
    } else if (command === "another") {
      console.log("Another command is not implemented yet.");
    }
  });
}

start();
