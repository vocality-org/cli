"use strict";
import arg from "arg";
const bootstrap = require("./bootstrap");
const generate = require("./generate");
const meow = require("meow");
const splashScreen = require("./utils/splashscreen");

function parseArguments(rawArgs) {
  const optArgs = arg({
    "--route": String,
    "--typescript": Boolean,
    "--version": Boolean,
    "--help": Boolean,
    "-h": "--help",
    "-r": "--route",
    "-t": "--typescript",
    "-v": "--version"
  });
  return { optArgs: optArgs };
}

export function cli(args) {
  const command = parseArguments(args);
  const argValues = command;
  const cli = meow(
    `
    Usage: vc or vocality-cli [command] [optional parameters]
  
    Commands:
          bootstrap [-r, --route]                    start the routine for a new project
          generate  [-r, --route] [-t, --typescript] generate a new command
          -h, --help                                 show usage information
          -v, --version                              print version info
    optional parameters:
      -r, --route        optional for bootstrap and generate. enter a path relative to where the command is executed
      -t, --typescript   optional for generate. When set, a command with typescript support is generated
  `
  );
  splashScreen.generateSplashScreen();
  command.optArgs._.push(...Object.keys(command.optArgs));
  command.optArgs._.splice(
    command.optArgs._.findIndex(c => c === "_"),
    1
  );

  switch (command.optArgs._[0]) {
    case "bootstrap":
      bootstrap.generateTemplate(argValues);
      break;
    case "generate":
      generate.generateCommand(argValues);
      break;
    case "--version":
      console.log(cli.pkg.version);
      break;
    case "--help":
      console.log(cli.help);
      break;
    default:
      console.log(cli.help);
      break;
  }
}
