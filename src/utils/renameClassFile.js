"use strict";
import fs from "fs";
import path from "path";
const replace = require("replace-in-file");

const renameClassFile = async (ts, classname, outpath, renameClass) => {
  if (renameClass) {
    fs.renameSync(
      path.join(outpath, ts ? "TestCommand.ts" : "TestCommand.js"),
      path.join(outpath, `${classname}${ts ? ".ts" : ".js"}`)
    );
  }

  let replaceOptions = {
    files: [path.join(outpath, `${classname}${ts ? ".ts" : ".js"}`)],
    from: "TestCommand",
    to: `${classname}`
  };
  await replace(replaceOptions);
  replaceOptions = {
    files: [path.join(outpath, `${classname}${ts ? ".ts" : ".js"}`)],
    from: "TestCommand()",
    to: `${classname}()`
  };
  await replace(replaceOptions);
  if (ts) {
    replaceOptions = {
      files: [path.join(outpath, `${classname}${ts ? ".ts" : ".js"}`)],
      from: "myPlugin",
      to: `${classname.charAt(0).toLowerCase() + classname.slice(1)}`
    };
    await replace(replaceOptions);
  }
};
module.exports = {
  renameClassFile: renameClassFile
};
