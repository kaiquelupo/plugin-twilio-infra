const { TwilioClientCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;

const chalk = require('chalk');
const { readInfra } = require('../../../infra');
const { Printer, runPulumiCommand } = require('../../../utils');

class InfraEnvironmentSet extends TwilioClientCommand {
  async run() {
    await super.run();
    let { args } = this.parse(InfraEnvironmentSet);
    let environment = args.environmentName;
    try {
      let deploymentEnvironments = readInfra();
      if (deploymentEnvironments[environment]) {
        runPulumiCommand(
          ['stack', 'select', environment],
          false,
          this.twilioClient
        );
        Printer.printSuccess(`Environment set to ${environment}`);
      } else {
        Printer.print(
          'Environment ' +
            chalk.green(environment) +
            ' is not defined. Use:\n  twilio infra:environment:new\nto define a new environment and deploy it.'
        );
      }
    } catch (error) {
      throw new TwilioCliError(
        'Error running `infra:environment:set`: ' + error.message
      );
    }
  }
}

InfraEnvironmentSet.description =
  'Set the deployment environment for the current project';

InfraEnvironmentSet.args = [
  {
    name: 'environmentName',
    required: true,
    description: 'The name of the environment you want to set for this project',
  },
];

module.exports = InfraEnvironmentSet;
