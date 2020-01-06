"use strict";
var validate = require("validate-npm-package-name");

const validatePackageName = input => {
  return new Promise((res, rej) => {
    const error = validate(input).errors
      ? validate(input).errors[0]
      : !validate(input).errors && validate(input).warnings
      ? validate(input).warnings[0]
      : !validate(input).errors && !validate(input).warnings
      ? ""
      : validate(input).errors[0];
    res(error === "" ? validate(input).validForNewPackages : error);
  });
};

const validatePluginName = input => {
  return new Promise((res, rej) => {
    if (input.indexOf("-") < 0) {
      res("There must be at least on - seperator(e.g. my-plugin)", false);
    }
    if (input.split("-")[input.split("-").length - 1].indexOf("plugin") < 0) {
      res("The last word has to be plugin (e.g. my-plugin)", false);
    }
    res(true);
  });
};

module.exports = {
  validatePackageName: validatePackageName,
  validatePluginName: validatePluginName
};
