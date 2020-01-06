class TestCommand {
  options = {
    id: {
      name: "test", // command identifier
      aliases: ["ts"]
    },
    description: "TestCommand",
    displayName: "test",
    minArguments: 0
  };

  execute(msg, args) {
    msg.reply("thanks you for executing my command");
  }
}

module.exports = new TestCommand();
