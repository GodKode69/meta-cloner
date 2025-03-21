// cmd/cloneguild.js

function randomDelay(min, max) {
  const delayTime = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, delayTime));
}

export default {
  name: "cloneguild",
  description:
    "Clone a guild's channels, roles, server name/icon, and optionally emojis from a source guild to a target guild. This command deletes all existing channels and roles in the target guild before cloning.",
  async execute(message, args) {
    if (message.author.id !== message.client.user.id) return;

    if (args.length < 3) {
      return message.reply(
        `Usage: ${global.config.prefix}cloneguild <sourceGuildId> <targetGuildId> <cloneEmojis:true|false>`
      );
    }

    const sourceId = args[0];
    const targetId = args[1];
    const cloneEmojis = args[2].toLowerCase() === "true";
    const client = message.client;

    const sourceGuild = client.guilds.cache.get(sourceId);
    if (!sourceGuild) {
      return message.reply(`Source guild with ID \`${sourceId}\` not found.`);
    }

    const targetGuild = client.guilds.cache.get(targetId);
    if (!targetGuild) {
      return message.reply(`Target guild with ID \`${targetId}\` not found.`);
    }

    message.reply(
      `Starting cloning from **${sourceGuild.name}** to **${targetGuild.name}**. This might take some time...`
    );

    // Clone server name and icon.
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
      console.log(`Cloned server name and icon to ${targetGuild.name}`);
    } catch (err) {
      console.error("Failed to clone server name/icon:", err);
      message.reply("Warning: Could not update target server's name/icon.");
    }

    const tgn = targetGuild.name;

    // Delete all channels in target guild.
    for (const channel of targetGuild.channels.cache.values()) {
      try {
        await randomDelay(2000, 5000);
        await channel.delete("Cloning: removing old channels");
      } catch (e) {
        console.error(`Failed to delete channel ${channel.name}: ${e}`);
      }
    }

    // Delete all roles (except @everyone) in target guild.
    for (const role of targetGuild.roles.cache
      .filter((r) => r.name !== "@everyone")
      .values()) {
      try {
        await randomDelay(2000, 5000);
        await role.delete("Cloning: removing old roles");
      } catch (e) {
        console.error(`Failed to delete role ${role.name}: ${e}`);
      }
    }

    // Clone roles from source guild.
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
        console.log(`Cloned role: ${role.name}`);
      } catch (err) {
        console.error(`Failed to clone role ${role.name}: ${err}`);
      }
    }

    // Clone channels from source guild.
    const channelMapping = new Map();
    const categories = sourceGuild.channels.cache.filter(
      (c) => c.type === "GUILD_CATEGORY"
    );
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
        console.log(`Cloned category: ${category.name}`);
      } catch (err) {
        console.error(`Failed to clone category ${category.name}: ${err}`);
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
        console.log(`Cloned channel: ${channel.name}`);
      } catch (err) {
        console.error(`Failed to clone channel ${channel.name}: ${err}`);
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
          console.log(`Cloned emoji: ${emoji.name}`);
        } catch (err) {
          console.error(`Failed to clone emoji ${emoji.name}: ${err}`);
        }
      }
    }

    message.reply(
      `Cloning complete. **${tgn}** now mirrors **${sourceGuild.name}**.`
    );
  },
};
