<img width="100%" src="media/vocality-cli-logo.svg">

# Vocality-CLI

This is the npm command line interface for the vocality-discord-bot ecosystem. It can be used for generating new bots which are build on top of our plugin based solution.

## Features

- Generate new plugins.
- Adding new commands with boilerplate code.
- Choose between JavaScript or TypeScript.(WIP)

## Prerequisites

For our cli to work you need **Node.js** and the **npm package manager**.
You can get both here: [Node.js and npm](https://nodejs.org/en/download/)

## Getting started

Once you have everything set up just type

```shell
npm install -g @vocality-org/cli
```

or if you have `npm > 5.2.0` you can use `npx` instead

```shell
npx @vocality-org/cli bootstrap
```

After installing the cli you can use the executables _vocality-cli_ or _vc_ to trigger different commands.

## Usage

```shell
vocality-cli [command] [optional parameters]
```

### Commands

- **bootstrap**
  Sets up a boilerplate project to develop a new plugin for a bot.
- **generate**
  Generates a new command in an existing vocality plugin project.
- **-v, --version**
  Displays the current version of the cli.
- **-h, --help**
  Displays usage information.

### Optional parameters

- **-r, --route**
  Optional parameter for **bootstrap** and **generate**. Used for entering a custom path relative to where the command is executed.
- **-t, --typescript**
  Optional parameter for **generate**. When set, a command with typescript support is generated.
