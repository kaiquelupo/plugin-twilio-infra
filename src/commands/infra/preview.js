const { TwilioClientCommand } = require('@twilio/cli-core').baseCommands;

const { runPulumiCommand } = require('../../utils');

class FunctionsPreview extends TwilioClientCommand {
  async run() {
    await super.run();
    await runPulumiCommand(['preview'], true);
  }
}

FunctionsPreview.description =
  'Previews changes related to resources described in this directory and mapped to a Twilio project';

module.exports = FunctionsPreview;
