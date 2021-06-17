<h1 align="center">plugin-twilio-infra</h1>
<p align="center">Plugin for the <a href="https://github.com/twilio/twilio-cli">Twilio CLI</a> to integrate Pulumi and Twilio in order to create, deploy, and manage Twilio infrastructure using code.</p>
<p align="center">
<img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome" /></a>
<hr>

This plugin adds the `infra` command to the [Twilio CLI](https://github.com/twilio/twilio-cli). It integrates Pulumi with Twilio and consists of subcommands that let you create, deploy, and manage Twilio infrastructure via code.

## Requirements

### Install the Pulumi CLI

To get started with the Pulumi CLI, check out the [Download and Install page](https://www.pulumi.com/docs/get-started/install/).

Also, you need a backend storage system to keep your infrastructure state. The options are:

- The Pulumi Service backend
- A self-managed backend, either stored locally on your filesystem or remotely using a cloud storage service

See [State and Backends](https://www.pulumi.com/docs/intro/concepts/state/#state-and-backends) for more details.

For quick testing, you can easily create a free Pulumi account and run `pulumi login` to your storage backend.

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

## Link the Twilio CLI Infra Plugin

To get started, run `npm install` to install the plugin package dependencies. Afterwards, run the following command:

```sh-session
$ twilio plugins:install plugin-twilio-infra
```

You can now start using the `twilio infra` commands on your machine.

## Usage

```sh-session
$ twilio infra --help
USAGE
  $ twilio infra
...
```

## Commands

<!-- commands -->
* `twilio infra:new`: Creates a new project using Pulumi provider
* `twilio infra:deploy`: Deploys and updates resources described in this directory to a Twilio project. 
* `twilio infra:preview`: Previews changes without deploying them to your Twilio project
* `twilio infra:destroy`: Destroy deployed resources associated to a specific environment
* `twilio infra:environment:new`: Create a new environment for the current Twilio project
* `twilio infra:environment:set`: Get the deployment environment set for the current project
* `twilio infra:environment:get`: Set the deployment environment for the current project

To see the usage details and options for each subcommand, run `twilio infra:<subcommand> --help`.

## Contributing

This project welcomes contributions from the community. Please see the [`CONTRIBUTING.md`](CONTRIBUTING.md) file for more details.

### Code of Conduct

Please be aware that this project has a [Code of Conduct](https://github.com/twilio-labs/.github/blob/master/CODE_OF_CONDUCT.md). The tldr; is to just be excellent to each other ❤️

## Acknowledgment and thanks

This plugin is based on the [Twilio CLI Serverless Plugin](https://github.com/twilio-labs/plugin-serverless) repository. A big thank you to everyone involved in that project! **#WeBuild**

## License

MIT
