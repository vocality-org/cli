import { Command, CommandOptions } from "@vocality-org/types";

export class TestCommand extends Command {
  options: CommandOptions = {
    id: {
      name: "test", // command identifier
      aliases: ["ts"]
    },
    description: "TestCommand",
    usage: "test",
    minArguments: 0
  };

  execute(msg, args) {
    msg.reply("thanks you for executing my command");
  }
}
