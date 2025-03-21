/**
 * DISCLAIMER: This code uses a selfbot, which violates Discord's Terms of Service.
 * Use at your own risk. This example is for educational purposes only.
 */

import { Client } from "discord.js-selfbot-v13";
import inquirer from "inquirer";
import chalk from "chalk";
import { promises as fs } from "fs";
import path from "path";

process.on("unhandledRejection", (reason, promise) => {
  console.error(chalk.red("Unhandled Rejection:"), reason);
});
process.on("uncaughtException", (err) => {
  console.error(chalk.red("Uncaught Exception:"), err);
});

function randomDelay(min, max) {
  const delayTime = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, delayTime));
}

function jsonReplacer(key, value) {
  return typeof value === "bigint" ? value.toString() : value;
}

const client = new Client();

function setTerminalTitle() {
  process.stdout.write("\x1b]0;GodKode's Nebula AIO Tool\x07");
}

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

  for (const channel of targetGuild.channels.cache.values()) {
    try {
      await randomDelay(2000, 5000);
      await channel.delete("Cloning: removing old channels");
    } catch (e) {
      console.error(chalk.red(`Failed to delete channel ${channel.name}:`), e);
    }
  }

  for (const role of targetGuild.roles.cache.filter((r) => r.name !== "@everyone").values()) {
    try {
      await randomDelay(2000, 5000);
      await role.delete("Cloning: removing old roles");
    } catch (e) {
      console.error(chalk.red(`Failed to delete role ${role.name}:`), e);
    }
  }

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

async function backupServer(dummyMessage) {
  const { guildId } = await inquirer.prompt([
    {
      type: "input",
      name: "guildId",
      message: "Enter the guild ID to backup:",
    },
  ]);

  const guild = client.guilds.cache.get(guildId);
  if (!guild) {
    return dummyMessage.reply(`Guild with ID ${guildId} not found in cache.`);
  }

  const backupData = {
    id: guild.id,
    name: guild.name,
    icon: guild.iconURL({ dynamic: true, format: "png", size: 1024 }),
    channels: Array.from(guild.channels.cache.values()).map((ch) => ({
      id: ch.id,
      name: ch.name,
      type: ch.type,
      parentId: ch.parentId || null,
      position: ch.position,
      topic: ch.topic || "",
      nsfw: ch.nsfw || false,
    })),
    roles: Array.from(guild.roles.cache.values())
      .filter((r) => r.name !== "@everyone")
      .map((r) => ({
        id: r.id,
        name: r.name,
        color: r.hexColor,
        hoist: r.hoist,
        permissions: r.permissions.bitfield,
        mentionable: r.mentionable,
      })),
  };

  const backupDir = path.join(process.cwd(), "backups");
  await fs.mkdir(backupDir, { recursive: true });

  const safeName = guild.name
    .replace(/[^a-zA-Z0-9\s_-]/g, "")
    .trim()
    .replace(/\s+/g, "_");
  const fileName = path.join(backupDir, `${safeName}_${guild.id}.json`);

  await fs.writeFile(fileName, JSON.stringify(backupData, jsonReplacer, 2));
  dummyMessage.reply(`Backup created at ${fileName}`);
}

async function restoreBackup(dummyMessage) {
  const backupDir = path.join(process.cwd(), "backups");
  let files;
  try {
    files = await fs.readdir(backupDir);
  } catch (err) {
    return dummyMessage.reply("No backup folder found.");
  }

  const backupFiles = files.filter((f) => f.endsWith(".json"));
  if (backupFiles.length === 0) {
    return dummyMessage.reply("No backup files found.");
  }

  const choices = backupFiles.map((f) => {
    const displayName = f.replace(".json", "");
    return { name: displayName, value: f };
  });

  const { selectedFile } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedFile",
      message: "Select a backup to restore:",
      choices,
    },
  ]);

  const filePath = path.join(backupDir, selectedFile);
  let backupData;
  try {
    const content = await fs.readFile(filePath, "utf8");
    backupData = JSON.parse(content);
  } catch (err) {
    return dummyMessage.reply("Failed to read or parse the backup file.");
  }

  const match = selectedFile.match(/_(\d+)\.json$/);
  if (!match) {
    return dummyMessage.reply("Could not extract server ID from the backup file name.");
  }
  const serverId = match[1];
  const guild = client.guilds.cache.get(serverId);
  if (!guild) {
    return dummyMessage.reply(`Server with ID ${serverId} not found in cache. Restoration cannot proceed.`);
  }

  console.log(chalk.green("Backup data loaded:"), backupData);
  dummyMessage.reply(`Restoration process initiated for server "${backupData.name}" (ID: ${serverId}). (Restoration logic not fully implemented.)`);
}

async function mainMenu() {
  const { command } = await inquirer.prompt([
    {
      type: "list",
      name: "command",
      message: "Select a command to execute:",
      choices: [
        { name: "Clone Server", value: "cloneguild" },
        { name: "Backup Server", value: "backup" },
        { name: "Restore Backup", value: "restore" },
      ],
    },
  ]);

  const dummyMessage = {
    author: { id: client.user.id },
    client,
    reply: (msg) => console.log(chalk.blue("Reply:"), msg),
  };

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

    const sourceGuild = client.guilds.cache.get(answers.sourceGuildId);
    if (sourceGuild) {
      console.log(chalk.yellow(`Source server: ${sourceGuild.name}`));
    } else {
      console.log(chalk.red("Source guild not found in cache. It might not be available yet."));
    }

    const args = [
      answers.sourceGuildId,
      answers.targetGuildId,
      answers.cloneEmojis ? "true" : "false",
    ];
    await cloneguild(dummyMessage, args);
  } else if (command === "backup") {
    await backupServer(dummyMessage);
  } else if (command === "restore") {
    await restoreBackup(dummyMessage);
  }

  const { again } = await inquirer.prompt([
    {
      type: "confirm",
      name: "again",
      message: "Do you want to execute another command?",
      default: true,
    },
  ]);

  if (again) {
    await mainMenu();
  } else {
    console.log(chalk.green("Exiting application. Goodbye!"));
    process.exit(0);
  }
}

async function start() {
  setTerminalTitle();

  const { token } = await inquirer.prompt([
    {
      type: "password",
      name: "token",
      message: "Enter your Discord token:",
      mask: "*",
    },
  ]);

  client.login(token);
  await new Promise((resolve) => client.once("ready", resolve));
  console.log(`Logged in as ${client.user.tag}`);

  await mainMenu();
}


start();
