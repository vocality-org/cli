"use strict";
const vocality = require("@vocality-org/core");
const myPlugin = require("./my-plugin/MyPlugin");
const dotenv = require("dotenv");
dotenv.config({ path: "./dev.env" });

const options = {
  token: process.env.DISCORD_TOKEN,
  messageCacheMaxSize: 100,
  disabledEvents: ["TYPING_START"],
  plugins: [myPlugin]
};

const bot = new vocality.Bot(options);

bot.start();
