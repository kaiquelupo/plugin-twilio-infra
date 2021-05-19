const { TwilioClientCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;

const chalk = require('chalk');
const { getPulumiStack, Printer } = require('../../../utils');

class InfraEnvironmentGet extends TwilioClientCommand {
  async run() {
    await super.run();
    try {
      let environment = getPulumiStack();
      if (environment) {
        Printer.print(
          'Currently using environment: ' + chalk.green(environment)
        );
      } else {
        Printer.print('No environments set for this project');
      }
    } catch (error) {
      throw new TwilioCliError(
        'Error running `environment:get`: ' + error.message
      );
    }
  }
}

InfraEnvironmentGet.description =
  'Get the deployment environment set for the current project';

module.exports = InfraEnvironmentGet;
