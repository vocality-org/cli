"use strict";
import path from "path";
const findUp = require("find-up");
const fs = require("fs");
const { NodeVM } = require("vm2");
import Listr from "listr";
const chalk = require("chalk");
const vm = new NodeVM({
  require: {
    external: true
  }
});

const generateDocs = async args => {
  let commandsPath = process.cwd();
  let files = [];
  let inPath = await findUp("package.json");
  inPath = inPath
    .split("/")
    .slice(0, inPath.split("/").length - 1)
    .join("/");
  if (args.optArgs["--route"]) {
    commandsPath = path.join(process.cwd(), args.optArgs["--route"]);
  }
  const tasks = new Listr([
    {
      title: "Searching for Commands",
      task: () => (files = searchForCommands(commandsPath))
    },
    {
      title: "generating command.json",
      task: () => excute(files, inPath, commandsPath)
    }
  ]);
  await tasks.run();
  console.log("%s commands.json generated", chalk.green.bold("DONE"));
};
const searchForCommands = commandsPath => {
  return fs.readdirSync(commandsPath);
};
const excute = async (files, inPath, commandsPath) => {
  const commandDescriptions = [];
  for (const file of files) {
    if (!file.includes("index")) {
      const content = fs.readFileSync(path.join(commandsPath, file), "utf-8");
      const options = content.slice(
        content.indexOf("options"),
        content.length - 1
      );
      let counter = 0;
      let result = "";
      for (const char of options) {
        result += char;
        if (char === "{") {
          counter++;
        }
        if (char === "}") {
          counter--;
          if (counter === 0) {
            break;
          }
        }
      }
      result = result.slice(result.indexOf("{"), result.length);
      const code = vm.run(
        `const RichEmbed = require('discord.js').RichEmbed; let x = ${result}; module.exports = x`,
        __dirname
      );
      commandDescriptions.push(code);
    }
    fs.writeFile(
      path.join(inPath, "commands.json"),
      JSON.stringify(commandDescriptions),
      err => {
        if (err) console.log(err);
      }
    );
  }
};
module.exports = {
  generateDocs: generateDocs
};
