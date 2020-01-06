"use strict";
import inquirer from "inquirer";
import ncp from "ncp";
import path from "path";
import Listr from "listr";
import { promisify } from "util";
import fs from "fs";
import { projectInstall } from "pkg-install";

const validator = require("./utils/validator");
const chalk = require("chalk");

const copy = promisify(ncp);
const replace = require("replace-in-file");

const generateTemplate = async args => {
  const questions = [];
  let options = {};
  options.targetDirectory = args.optArgs["--route"]
    ? path.join(process.cwd(), args.optArgs["--route"])
    : process.cwd();
  const defaultTemplate = "JavaScript";
  questions.push({
    type: "input",
    message: "Enter the name of your project",
    name: "projectName",
    validate: input => validator.validatePackageName(input)
  }),
    questions.push({
      type: "input",
      message: "Enter the name of your plugin",
      name: "pluginName",
      validate: input => validator.validatePluginName(input)
    });
  questions.push({
    type: "input",
    message: "Enter the token of your Discord Bot",
    name: "discordToken"
  });
  questions.push({
    type: "list",
    name: "template",
    message: "Please choose which project template to use",
    choices: ["JavaScript", "TypeScript"],
    default: defaultTemplate
  });
  const answers = await inquirer.prompt(questions);
  const tasks = new Listr([
    {
      title: "Copy project files",
      task: () => copyTemplateFiles(answers, options)
    },
    {
      title: "Setting up files",
      task: () => renameFiles(answers, options)
    },
    {
      title: "Install dependencies",
      task: () =>
        projectInstall({
          cwd: options.targetDirectory + "/" + answers.projectName
        })
    }
  ]);
  console.log(answers);
  await tasks.run();
  console.log("%s Project ready", chalk.green.bold("DONE"));
  return true;
};
const copyTemplateFiles = async (answers, options) => {
  if (!fs.existsSync(options.targetDirectory + "/" + answers.projectName)) {
    fs.mkdirSync(options.targetDirectory + "/" + answers.projectName);
    const templatedir = path.join(
      __dirname,
      "..",
      "templates",
      "javascript",
      "base-plugin"
    );
    return copy(
      templatedir,
      options.targetDirectory + "/" + answers.projectName,
      {
        clobber: false
      }
    );
  }
  return;
};

const renameFiles = async (answers, options) => {
  let replaceOptions = {
    files: [
      path.join(options.targetDirectory, answers.projectName, "package.json")
    ],
    from: '"name": "plugin-setup",',
    to: `"name": "${answers.projectName}",`
  };
  await replace(replaceOptions);
  let varName = renamePluginName(answers.pluginName, 1);
  let className = renamePluginName(answers.pluginName, 0);
  fs.renameSync(
    path.join(
      options.targetDirectory,
      answers.projectName,
      "my-plugin",
      "MyPlugin.js"
    ),
    path.join(
      options.targetDirectory,
      answers.projectName,
      "my-plugin",
      className + ".js"
    )
  );
  fs.renameSync(
    path.join(options.targetDirectory, answers.projectName, "my-plugin"),
    path.join(options.targetDirectory, answers.projectName, answers.pluginName)
  );
  replaceOptions = {
    files: [
      path.join(options.targetDirectory, answers.projectName, "index.js")
    ],
    from: "[plugin]",
    to: `[${varName}]`
  };
  await replace(replaceOptions);
  replaceOptions = {
    files: [
      path.join(options.targetDirectory, answers.projectName, "index.js")
    ],
    from: 'const plugin = require("./my-plugin/MyPlugin");',
    to: `const ${varName} = require("./${answers.pluginName}/${className}");`
  };
  await replace(replaceOptions);
  replaceOptions = {
    files: [
      path.join(
        options.targetDirectory,
        answers.projectName,
        answers.pluginName,
        className + ".js"
      )
    ],
    from: "MyPlugin",
    to: `${className}`
  };
  await replace(replaceOptions);
  replaceOptions = {
    files: [path.join(options.targetDirectory, answers.projectName, "dev.env")],
    from: "YOUR_TOKEN_HERE",
    to: `${answers.discordToken}`
  };
  await replace(replaceOptions);
  replaceOptions = {
    files: [
      path.join(
        options.targetDirectory,
        answers.projectName,
        answers.pluginName,
        className + ".js"
      )
    ],
    from: "MyPlugin()",
    to: `${className}()`
  };
  await replace(replaceOptions);
};

const renamePluginName = (pluginName, startIndex) => {
  let varName = startIndex === 1 ? pluginName.split("-")[0] : "";
  for (var i = startIndex; i < pluginName.split("-").length; i++) {
    varName +=
      pluginName
        .split("-")
        [i].charAt(0)
        .toUpperCase() + pluginName.split("-")[i].slice(1);
  }
  return varName;
};
module.exports = {
  generateTemplate: generateTemplate,
  copyTemplateFiles: copyTemplateFiles
};
