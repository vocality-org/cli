import { Bot } from "@vocality-org/core";
import { ClientOptions } from "@vocality-org/types";
import dotenv from "dotenv";
import { myPlugin } from "./my-plugin/MyPlugin";

dotenv.config({ path: "./dev.env" });
const options: ClientOptions = {
  token: process.env.DISCORD_TOKEN,
  messageCacheMaxSize: 100,
  disabledEvents: ["TYPING_START"],
  plugins: [myPlugin]
};

const bot = new Bot(options);

bot.start();
