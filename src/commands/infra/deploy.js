const { TwilioClientCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;

const { addInfra } = require('../../infra');

const {
  runPulumiCommand,
  getPulumiStack,
  getEnvironmentDeployment,
} = require('../../utils');

class InfraDeploy extends TwilioClientCommand {
  async run() {
    await super.run();
    let deployment = getEnvironmentDeployment();
    if (deployment && deployment !== this.twilioClient.accountSid) {
      throw new TwilioCliError(
        `The current stack is already deployed to ${deployment}. Please switch to that profile or define a new environment`
      );
    }
    runPulumiCommand(['up'], true, true, this.twilioClient);
    try {
      // Store account SID of the project used for deployment
      addInfra(this.twilioClient.accountSid, getPulumiStack(), true);
    } catch (error) {
      throw new TwilioCliError('Error running deploy: ' + error.message);
    }
  }
}

InfraDeploy.description =
  'Deploys and updates resources described in this directory to a Twilio project';

module.exports = InfraDeploy;
