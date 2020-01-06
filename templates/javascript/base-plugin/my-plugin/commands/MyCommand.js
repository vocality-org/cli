class MyCommand {
  options = {
    id: {
      name: "mycommand", // command identifier
      aliases: ["mc"]
    },
    description: "My first Command",
    displayName: "myCommand",
    minArguments: 0
  };

  execute(msg, args) {
    msg.reply("thanks you for executing my command");
  }
}

module.exports = new MyCommand();
