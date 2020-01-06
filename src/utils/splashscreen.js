const chalk = require("chalk");

module.exports = {
  generateSplashScreen: () => {
    const vaporStyle = chalk.bgMagenta.bold.cyan;
    console.log(
      vaporStyle(
        " _   _                      _  _  _                   _____  _      _____ "
      )
    );
    console.log(
      vaporStyle(
        "| | | |                    | |(_)| |                 /  __ \\| |    |_   _|"
      )
    );
    console.log(
      vaporStyle(
        "| | | |  ___    ___   __ _ | | _ | |_  _   _  ______ | /  \\/| |      | |  "
      )
    );
    console.log(
      vaporStyle(
        "| | | | / _ \\  / __| / _` || || || __|| | | ||______|| |    | |      | |  "
      )
    );
    console.log(
      vaporStyle(
        "\\ \\_/ /| (_) || (__ | (_| || || || |_ | |_| |        | \\__/\\| |____ _| |_ "
      )
    );
    console.log(
      vaporStyle(
        " \\___/  \\___/  \\___| \\__,_||_||_| \\__| \\__, |         \\____/\\_____/ \\___/ "
      )
    );
    console.log(
      vaporStyle(
        "                                        __/ |                             "
      )
    );
    console.log(
      vaporStyle(
        "                                       |___/                              "
      )
    );
  }
};
