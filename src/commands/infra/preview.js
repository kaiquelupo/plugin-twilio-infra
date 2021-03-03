const { TwilioClientCommand } = require("@twilio/cli-core").baseCommands;

const {

  convertYargsOptionsToOclifFlags,
  runPulumiCommand,
  options

} = require('../../utils');

class FunctionsPreview extends TwilioClientCommand {
  async run() {
    await super.run();

    await runPulumiCommand(this.parse(FunctionsPreview), this.twilioClient, "pulumi preview");

    return;
  }
}

FunctionsPreview.description = "Previews changes related to resources described in this directory and mapped to a Twilio project";

FunctionsPreview.args = [];

FunctionsPreview.flags = Object.assign(
  {},
  convertYargsOptionsToOclifFlags(options),
  { profile: TwilioClientCommand.flags.profile }
);

module.exports = FunctionsPreview;
