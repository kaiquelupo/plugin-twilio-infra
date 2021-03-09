const { TwilioClientCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;

const fs = require('fs');

const { runPulumiCommand } = require('../../utils');

class InfraDeploy extends TwilioClientCommand {
  async run() {
    await super.run();
    await runPulumiCommand(['up'], true, this.twilioClient);
    try {
      // Store account SID of the project used for deployment
      fs.writeFileSync(
        '.twilio-deploy',
        JSON.stringify({ accountSid: this.twilioClient.accountSid })
      );
    } catch (error) {
      throw new TwilioCliError('Error running destroy: ' + error.message);
    }
  }
}

InfraDeploy.description =
  'Deploys and updates resources described in this directory to a Twilio project';

module.exports = InfraDeploy;
