const { TwilioClientCommand } = require("@twilio/cli-core").baseCommands;

const {

  convertYargsOptionsToOclifFlags,
  runPulumiCommand,
  options

} = require('../../utils');

class FunctionsPreview extends TwilioClientCommand {
  async run() {
    await super.run();

    let { flags } = this.parse(FunctionsPreview);
    if (!flags.stack) {
      console.error(
        "Please provide the name of the Pulumi stack\n e.g. twilio infra:preview --stack dev\n"
      );
      return;
    }
    await runPulumiCommand(
      this.parse(FunctionsPreview),
      this.twilioClient,
      "pulumi preview"
    );

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
