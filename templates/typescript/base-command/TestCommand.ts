import { Command, CommandOptions } from "@vocality-org/types";
import { Message } from "discord.js";

export class TestCommand extends Command {
  options: CommandOptions = {
    id: {
      name: "test", // command identifier
      aliases: ["ts"]
    },
    description: "TestCommand",
    usage: "test",
    minArguments: 0,
    example: {
      input: "ping",
      output: "pong"
    }
  };

  execute(msg: Message, args: string[]) {
    msg.reply("thanks you for executing my command");
  }
}
