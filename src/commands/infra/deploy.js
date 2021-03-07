const { TwilioClientCommand } = require('@twilio/cli-core').baseCommands;

const { runPulumiCommand } = require('../../utils');

class FunctionsDeploy extends TwilioClientCommand {
  async run() {
    await super.run();

    await runPulumiCommand(['up'], true, this.twilioClient);
  }
}

FunctionsDeploy.description =
  'Deploys and updates resources described in this directory to a Twilio project';

module.exports = FunctionsDeploy;
