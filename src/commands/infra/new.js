const { TwilioClientCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;

const childProcess = require('child_process');
const ora = require('ora');
const { runPulumiCommand, Printer, getPulumiStack } = require('../../utils');
const { addInfra } = require('../../infra');

class InfraNew extends TwilioClientCommand {
  async run() {
    await super.run();
    await runPulumiCommand(['new', 'javascript'], true);
    try {
      // Install twilio-pulumi-provider
      const spinner = ora('Installing additional dependencies').start();
      childProcess.execFile(
        'npm',
        ['install', 'twilio', 'twilio-pulumi-provider'],
        () => {
          spinner.succeed('Addtional dependencies installed');
          if (this.twilioClient.accountSid) {
            addInfra(this.twilioClient.accountSid, getPulumiStack());
          }
          Printer.printSuccess(
            'Project initialized succesfully\n\nAdd your resources to index.js and execute\n  twilio infra:deploy\nto deploy them to your Twilio project!'
          );
        }
      );
    } catch (error) {
      throw new TwilioCliError(
        '\nError executing infra:new:\n' + error.message
      );
    }
  }
}

InfraNew.description = 'Creates a new project Twilio Infra project';

module.exports = InfraNew;
