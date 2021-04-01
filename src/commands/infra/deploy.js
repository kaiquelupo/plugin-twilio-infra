const { TwilioClientCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;

const { addDeployment } = require('../../deployments');

const { runPulumiCommand } = require('../../utils');

class InfraDeploy extends TwilioClientCommand {
  async run() {
    await super.run();
    runPulumiCommand(['up'], true, this.twilioClient);
    try {
      // Store account SID of the project used for deployment
      addDeployment(this.twilioClient.accountSid);
    } catch (error) {
      throw new TwilioCliError('Error running destroy: ' + error.message);
    }
  }
}

InfraDeploy.description =
  'Deploys and updates resources described in this directory to a Twilio project';

module.exports = InfraDeploy;
