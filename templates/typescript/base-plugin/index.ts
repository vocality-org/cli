import { Bot } from "@vocality-org/core";
import { ClientOptions } from "@vocality-org/types";
import dotenv from "dotenv";
import myPlugin from "./my-plugin";

dotenv.config();
const options: ClientOptions = {
  token: process.env.BOT_TOKEN,
  messageCacheMaxSize: 100,
  disabledEvents: ["TYPING_START"],
  plugins: [
    {
      loaded: true,
      path: [myPlugin]
    }
    // { enabled: true, path: 'other/plugin' },
  ]
};

const bot = new Bot(options);

bot.start();
