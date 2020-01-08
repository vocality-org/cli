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
const rename = require("./utils/renameClassFile");

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
      answers.template.toLowerCase(),
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
      answers.template === "JavaScript" ? "MyPlugin.js" : "MyPlugin.ts"
    ),
    path.join(
      options.targetDirectory,
      answers.projectName,
      "my-plugin",
      `${className}${answers.template === "JavaScript" ? ".js" : ".ts"}`
    )
  );
  fs.renameSync(
    path.join(options.targetDirectory, answers.projectName, "my-plugin"),
    path.join(options.targetDirectory, answers.projectName, answers.pluginName)
  );
  replaceOptions = {
    files: [
      path.join(
        options.targetDirectory,
        answers.projectName,
        `index${answers.template === "JavaScript" ? ".js" : ".ts"}`
      )
    ],
    from: "[myPlugin]",
    to: `[${varName}]`
  };
  await replace(replaceOptions);
  replaceOptions = {
    files: [
      path.join(
        options.targetDirectory,
        answers.projectName,
        `index${answers.template === "JavaScript" ? ".js" : ".ts"}`
      )
    ],
    from:
      answers.template === "JavaScript"
        ? 'const plugin = require("./my-plugin/MyPlugin");'
        : 'import { myPlugin } from "./my-plugin/MyPlugin"',
    to:
      answers.template === "JavaScript"
        ? `const ${varName} = require("./${answers.pluginName}/${className}");`
        : `import { ${varName} } from "./${answers.pluginName}/${className}"`
  };
  await replace(replaceOptions);
  replaceOptions = {
    files: [path.join(options.targetDirectory, answers.projectName, "dev.env")],
    from: "YOUR_TOKEN_HERE",
    to: `${answers.discordToken}`
  };
  await replace(replaceOptions);
  rename.renameClassFile(
    answers.template === "JavaScript" ? false : true,
    className,
    path.join(options.targetDirectory, answers.projectName, answers.pluginName),
    false
  );
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
