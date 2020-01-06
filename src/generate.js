"use strict";
import inquirer from "inquirer";
import ncp from "ncp";
import path from "path";
import Listr from "listr";
import { promisify } from "util";
import fs from "fs";

const copy = promisify(ncp);
const replace = require("replace-in-file");
const chalk = require("chalk");

const generateCommand = async args => {
  let outpath = process.cwd();
  if (args.optArgs["--route"]) {
    outpath = path.join(process.cwd(), args.optArgs["--route"]);
  }
  const questions = [];
  questions.push({
    type: "input",
    message: "Enter the name of your Command",
    name: "commandName"
  });
  const answers = await inquirer.prompt(questions);
  const tasks = new Listr([
    {
      title: "Copy command files",
      task: () => copyCommandFile(outpath)
    },
    {
      title: "Changing files",
      task: () => renameFiles(answers, outpath)
    }
  ]);
  await tasks.run();
  console.log("%s Command generated", chalk.green.bold("DONE"));
};
const copyCommandFile = outpath => {
  const templatedir = path.join(
    __dirname,
    "..",
    "templates",
    "javascript",
    "base-command"
  );
  return copy(templatedir, outpath, {
    clobber: false
  });
};

const renameFiles = async (answers, outpath) => {
  fs.renameSync(
    path.join(outpath, "TestCommand.js"),
    path.join(outpath, answers.commandName + ".js")
  );
  let replaceOptions = {
    files: [path.join(outpath, answers.commandName + ".js")],
    from: "TestCommand",
    to: `${answers.commandName}`
  };
  await replace(replaceOptions);
  replaceOptions = {
    files: [path.join(outpath, answers.commandName + ".js")],
    from: "TestCommand()",
    to: `${answers.commandName}()`
  };
  await replace(replaceOptions);
  let result = fs.readFileSync(path.join(outpath, "index.js"), {
    encoding: "utf-8"
  });
  result =
    result.substring(0, result.indexOf("{") + 1) +
    `\n\xa0\xa0${answers.commandName}: require('./${answers.commandName}'),` +
    result.substring(result.indexOf("{") + 1);
  fs.writeFileSync(path.join(outpath, "index.js"), result);
};

module.exports = {
  generateCommand: generateCommand
};
