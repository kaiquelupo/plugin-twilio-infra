<h1 align="center">plugin-twilio-infra</h1>
<p align="center">Plugin for the <a href="https://github.com/twilio/twilio-cli">Twilio CLI</a> to integrate Pulumi and Twilio in order to create, deploy, and manage Twilio infrastructure using code.</p>
<p align="center">
<img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome" /></a>
<hr>

This plugin adds functionality to the [Twilio CLI](https://github.com/twilio/twilio-cli) to integrate Pulumi and Twilio in order to create, deploy, and manage Twilio infrastructure using code.

## Requirements

### Install the Pulumi CLI

Please check the following [documentation](https://www.pulumi.com/docs/get-started/install/) in order to install the Pulumi CLI.

Also, you need a backend storage system to keep your infrastruture state. The options are:

- The Pulumi Service backend
- A self-managed backend, either stored locally on your filesystem or remotely using a cloud storage service

You can find more details [here](https://www.pulumi.com/docs/intro/concepts/state/#state-and-backends).

For quick testing, you can easily create a free Pulumi account and run `pulumi login` to use it as your storage system.

### Install the Twilio CLI

Via `npm` or `yarn`:

```sh-session
$ npm install -g twilio-cli
$ yarn global add twilio-cli
```

Via `homebrew`:

```sh-session
$ brew tap twilio/brew && brew install twilio
```

## Usage

```sh-session
$ twilio plugins:install kaiquelupo/plugin-twilio-infra
$ twilio --help infra
USAGE
  $ twilio infra
...
```

## Commands

<!-- commands -->
* twilio infra:new
* twilio infra:deploy
* twilio infra:preview
* twilio infra:watch
* twilio infra:stack:new

## Contributing

This project welcomes contributions from the community. Please see the [`CONTRIBUTING.md`](CONTRIBUTING.md) file for more details.

### Code of Conduct

Please be aware that this project has a [Code of Conduct](https://github.com/twilio-labs/.github/blob/master/CODE_OF_CONDUCT.md). The tldr; is to just be excellent to each other ❤️

## License

MIT

### Twilio CLI Serverless Plugin

This plugin uses as base the [Twilio CLI Serverless Plugin](https://github.com/twilio-labs/plugin-serverless) repository. A big thank you for everyone involved in this project! **#WeBuild**
