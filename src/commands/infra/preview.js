const { TwilioClientCommand } = require('@twilio/cli-core').baseCommands;

const { runPulumiCommand } = require('../../utils');

class InfraPreview extends TwilioClientCommand {
  async run() {
    await super.run();
    await runPulumiCommand(['preview'], true, this.twilioClient);
  }
}

InfraPreview.description =
  'Previews changes related to resources described in this directory and mapped to a Twilio project';

module.exports = InfraPreview;
