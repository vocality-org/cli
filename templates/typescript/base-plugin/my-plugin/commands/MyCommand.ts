import { Command, CommandOptions } from "@vocality-org/types";
import { Message } from "discord.js";

export class MyCommand extends Command {
  options: CommandOptions = {
    id: {
      name: "mycommand", // command identifier
      aliases: ["mc"]
    },
    description: "My first Command",
    displayName: "myCommand",
    minArguments: 0
  };

  execute(msg: Message, args: string[]) {
    msg.reply("thanks you for executing my command");
  }
}
