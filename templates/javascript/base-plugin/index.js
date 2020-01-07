const vocality = require("@vocality-org/core");
const plugin = require("./my-plugin/MyPlugin");
const dotenv = require("dotenv");
dotenv.config();

const options = {
  token: process.env.BOT_TOKEN,
  messageCacheMaxSize: 100,
  disabledEvents: ["TYPING_START"],
  plugins: [plugin]
};

const bot = new vocality.Bot(options);

bot.start();
