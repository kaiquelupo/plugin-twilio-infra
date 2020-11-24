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

class FunctionsDeploy extends TwilioClientCommand {
  async run() {
    await super.run();

    let { flags, args } = this.parse(FunctionsDeploy);
    flags = normalizeFlags(flags);

    const vars = getEnvironmentVariables(flags, this.twilioClient);

    shell.exec(`${vars} eval 'pulumi up ${args.stack} --yes'`).stdout;

    return;
  }
}

FunctionsDeploy.description = "previews your local infra project";

FunctionsDeploy.args = [
  {
    name: 'stack',
    required: true,
    description: 'Stack name to preview changes of this project',
  },
];

FunctionsDeploy.flags = Object.assign(
  {},
  convertYargsOptionsToOclifFlags(cliInfo.options),
  { profile: TwilioClientCommand.flags.profile }
);

module.exports = FunctionsDeploy;
