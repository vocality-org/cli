import { BasePlugin, loadCommands } from "@vocality-org/core";
import { Command } from "@vocality-org/types";
import * as commandDefs from "./commands";

class MyPlugin extends BasePlugin {
  commands: Command[];
  constructor() {
    super();
    this.commands = [];
    this.commands = loadCommands(commandDefs) as Command[];
  }

  load() {
    console.log("plugin was loaded");
    return this;
  }

  unload() {
    console.log("plugin was unloaded");
  }
}

export const myPlugin = new MyPlugin();
