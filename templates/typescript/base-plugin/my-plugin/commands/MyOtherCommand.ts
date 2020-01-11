import { Command, CommandOptions } from "@vocality-org/types";
import { Message } from "discord.js";

export class MyOtherCommand implements Command {
  options: CommandOptions = {
    id: {
      name: "moc" // command identifier
    },
    example: {
      input: "ping",
      output: "pong"
    }
  };

  execute(msg: Message, args: string[]) {
    msg.reply("thanks you for executing my other command");
  }
}
