const { TwilioClientCommand } = require("@twilio/cli-core").baseCommands;

const {
  cliInfo
} = require('create-twilio-function/src/command');

const {
  
  convertYargsOptionsToOclifFlags,
  normalizeFlags,
  getEnvironmentVariables

} = require('../../utils');

const shell = require("shelljs");

class FunctionsPreview extends TwilioClientCommand {
  async run() {
    await super.run();

    let { flags, args } = this.parse(FunctionsPreview);
    flags = normalizeFlags(flags);

    const vars = getEnvironmentVariables(flags, this.twilioClient);

    shell.exec(`${vars} eval 'pulumi preview ${args.stack}'`).stdout;

    return;
  }
}

FunctionsPreview.description = "previews your local infra project";

FunctionsPreview.args = [
  {
    name: 'stack',
    required: true,
    description: 'Stack name to preview changes of this project',
  },
];

FunctionsPreview.flags = Object.assign(
  {},
  convertYargsOptionsToOclifFlags(cliInfo.options),
  { profile: TwilioClientCommand.flags.profile }
);

module.exports = FunctionsPreview;
