const { TwilioClientCommand } = require('@twilio/cli-core').baseCommands;

const { runPulumiCommand } = require('../../utils');

class FunctionsDeploy extends TwilioClientCommand {
  async run() {
    await super.run();

    await runPulumiCommand(['destroy'], true, this.twilioClient);
  }
}

FunctionsDeploy.description =
  'Destroy an existing stack and the deployed resources';

module.exports = FunctionsDeploy;
