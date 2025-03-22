# GodKode's Nebula AIO Tool

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green)](https://nodejs.org/)  
[![License](https://img.shields.io/badge/License-Educational-orange)](LICENSE)

> **DISCLAIMER:**  
> This tool is a selfbot that violates Discord's Terms of Service. Use it at your own risk and only for educational purposes. Improper use may result in your Discord account being banned.

## Overview

**GodKode's Nebula AIO Tool** is a powerful, terminal-based Discord management utility built with Node.js. With its interactive CLI interface, it offers a suite of commands to manage Discord guilds (servers) effectively. Whether you need to clone a server's setup, back up its configuration, or restore a previous backup, this tool has you covered.

## Capabilities

- **Clone Server**  
  Easily duplicate roles, channels, emojis, and other server settings from one guild to another, saving you time and effort.

- **Backup Server**  
  Create a secure backup of your server's structure and settings. Backups are stored as JSON files in a dedicated `backups` folder with sanitized filenames to handle emojis and spaces.

- **Restore Backup**  
  Quickly restore your server's configuration by selecting from available backup files via a user-friendly menu that extracts the server ID automatically.

## Features

- **Interactive Terminal Interface**  
  Enjoy a fully interactive command menu with clear, color-coded prompts and messages.

- **Secure Token Entry**  
  Your Discord token is entered via a masked prompt (using `*#` as the mask), ensuring your sensitive data stays private.

- **Robust Error Handling**  
  Detailed, colorful logs provide real-time feedback and error notifications, powered by Chalk.

- **Command Loop**  
  Execute multiple commands in succession without restarting the tool, making it seamless to manage your Discord servers.

- **Real-Time Status Updates**  
  Monitor the progress of operations like cloning or backup creation with dynamic and colorful status messages.

## Requirements

- **Node.js (v18+ is recommended)**
- **NPM**
- A Discord account that is a member of the target guilds (servers)

## Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/GodKode69/meta-cloner.git
cd meta-cloner
npm install
```

## Usage

### Running the Application

You can run the tool directly using Node.js:

`bash node index.mjs `

Or use the provided launcher scripts:

Linux:
`bash ./start.sh ` _(Ensure the script is executable: `chmod +x start.sh`)_

Windows:
Double-click `start.bat` or run it from Command Prompt.

### How It Works

Token Prompt:
Your token is requested securely using a masked input field. The tool will wait until the client is fully logged in before accepting further commands.

Command Menu:
Once logged in, you'll be presented with a command menu where you can choose to:

Clone Server: Duplicate a server’s configuration to another.
Backup Server: Save a backup of your server's settings in a clean, safe filename.
Restore Backup: Restore a previously saved backup by selecting from a list.
Dynamic Operations:

Cloning: Duplicate your server configuration in real-time.
Backup: Save a complete server backup with robust, sanitized file naming.
Restore: Easily restore a backup by selecting it from a menu that automatically extracts the server ID for restoratio
