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
const rename = require("./utils/renameClassFile");

const generateCommand = async args => {
  let outpath = process.cwd();
  let ts = false;
  if (args.optArgs["--route"]) {
    outpath = path.join(process.cwd(), args.optArgs["--route"]);
  }
  if (args.optArgs["--typescript"]) {
    ts = true;
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
      task: () => copyCommandFile(outpath, ts)
    },
    {
      title: "Changing files",
      task: () => renameFiles(answers, outpath, ts)
    }
  ]);
  await tasks.run();
  console.log("%s Command generated", chalk.green.bold("DONE"));
};
const copyCommandFile = (outpath, ts) => {
  const templatedir = path.join(
    __dirname,
    "..",
    "templates",
    ts ? "typescript" : "javascript",
    "base-command"
  );
  return copy(templatedir, outpath, {
    clobber: false
  });
};

const renameFiles = async (answers, outpath, ts) => {
  rename.renameClassFile(ts, answers.commandName, outpath, true);
  let result = fs.readFileSync(
    path.join(outpath, ts ? "index.ts" : "index.js"),
    {
      encoding: "utf-8"
    }
  );
  if (ts) {
    result = `export * from './${answers.commandName}'; \n` + result;
  } else {
    result =
      result.substring(0, result.indexOf("{") + 1) +
      `\n\xa0\xa0${answers.commandName}: require('./${answers.commandName}'),` +
      result.substring(result.indexOf("{") + 1);
  }

  fs.writeFileSync(path.join(outpath, ts ? "index.ts" : "index.js"), result);
};

module.exports = {
  generateCommand: generateCommand
};
