# GodKode's Nebula AIO Tool

> **DISCLAIMER:**  
> This tool is a selfbot that violates Discord's Terms of Service. Use it at your own risk and only for educational purposes. Improper use may result in your Discord account being banned.

## Overview

GodKode's Nebula AIO Tool is a terminal-based Discord management utility built using Node.js. It provides multiple commands through an interactive CLI interface to help manage Discord guilds (servers). Currently, the tool includes the following commands:

- **Clone Server:** Clones roles, channels, emojis, and other server settings from a source guild to a target guild.
- **Backup Server:** Creates a backup of a guild's structure and settings and saves it as a JSON file in a `backups` folder.
- **Restore Backup:** Lists available backup files and restores the selected backup to the corresponding guild.

## Features

- **Interactive Terminal Interface:** Presents a command menu after logging in.
- **Terminal Title:** The terminal is set to "GodKode's Nebula AIO Tool" upon startup.
- **Non-Blocking Login:** The tool waits until the Discord client is fully logged in before accepting further keyboard input.
- **Robust Backup File Naming:** Backup files are saved in a `backups` folder with sanitized file names that handle emojis and spaces.
- **Command Loop:** After executing a command, you are prompted whether to execute another command or exit.

## Requirements

- Node.js (v18+ is recommended)
- NPM
- A Discord account that is a member of the target guilds (servers)

## Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/GodKode69/meta-cloner.git
cd meta-cloner
npm install
```
