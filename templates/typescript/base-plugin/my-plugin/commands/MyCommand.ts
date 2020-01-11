import { Command, CommandOptions } from "@vocality-org/types";
import { Message, RichEmbed } from "discord.js";

export class MyCommand implements Command {
  options: CommandOptions = {
    id: {
      name: "mycommand", // command identifier
      aliases: ["mc"]
    },
    description: "My first Command",
    usage: "myCommand",
    minArguments: 0,
    example: {
      input: "rich embed",
      output: new RichEmbed()
        .setTitle("Current Song Queue")
        .addField("Test", "Test")
        .setDescription("I am a Description")
        .setColor("#00e773")
        .setFooter(`Page 1 of 1`)
    }
  };

  execute(msg: Message, args: string[]) {
    msg.reply("thanks you for executing my command");
  }
}
