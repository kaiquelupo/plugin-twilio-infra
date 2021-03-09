const { TwilioClientCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;

const fs = require('fs');

const { runPulumiCommand, Printer } = require('../../utils');

class InfraDestroy extends TwilioClientCommand {
  async run() {
    await super.run();
    await runPulumiCommand(['destroy'], true, this.twilioClient);
    try {
      fs.access('./.twilio-deploy', fs.constants.F_OK, error => {
        if (!error) {
          fs.unlinkSync('./.twilio-deploy', { force: true });
          Printer.printSuccess('Resource(s) destroyed succesfully!');
        }
      });
    } catch (error) {
      throw new TwilioCliError('Error running destroy: ' + error.message);
    }
  }
}

InfraDestroy.description =
  'Destroy an existing stack and the deployed resources';

module.exports = InfraDestroy;
