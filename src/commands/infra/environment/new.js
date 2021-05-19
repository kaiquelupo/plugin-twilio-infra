const { TwilioClientCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;

const inquirer = require('inquirer');
const { readInfra, addInfra } = require('../../../infra');
const { getPulumiStack, Printer, runPulumiCommand } = require('../../../utils');

class InfraEnvironmentNew extends TwilioClientCommand {
  async run() {
    await super.run();
    try {
      let { args } = this.parse(InfraEnvironmentNew);
      let accountSid = this.twilioClient.accountSid;
      let deploymentEnvironments = readInfra();

      if (
        deploymentEnvironments[accountSid] &&
        deploymentEnvironments[accountSid].deployed
      ) {
        Printer.print(
          `Your Twilio project ${accountSid} is already associated to another environment (${deploymentEnvironments[accountSid].environment})\n\nUse\n\n  $ twilio profiles:use <profile name>\n\nto select a different project, or:\n\n  $ twilio profiles:create\n\nto create a new profile.`
        );
      } else {
        if (deploymentEnvironments[accountSid]) {
          const answer = await inquirer.prompt({
            type: 'confirm',
            name: 'confirm',
            message: `The current Twilio project (${accountSid}) is already associated to environment "${deploymentEnvironments[accountSid].environment}", but it's not deployed. \nAre you sure you want to associate a new environment to it?`,
          });
          if (!answer.confirm) {
            Printer.print('New environemnt not defined');
            return;
          }
        }
        runPulumiCommand(['stack', 'init', args.environmentName]);
        if (this.twilioClient) {
          addInfra(accountSid, getPulumiStack());
        }
        Printer.printSuccess(
          'New environment created. When you are ready, use\n\n  $ twilio infra:deploy\n\nto deploy it to your Twilio project'
        );
      }
    } catch (error) {
      throw new TwilioCliError(
        'Error running `environment:new`: ' + error.message
      );
    }
  }
}

InfraEnvironmentNew.description =
  'Create a new environment for the current Twilio project';

InfraEnvironmentNew.args = [
  {
    name: 'environmentName',
    required: true,
    description: 'The name of the environment to create',
  },
];

module.exports = InfraEnvironmentNew;
