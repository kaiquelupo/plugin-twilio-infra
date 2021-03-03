const { TwilioClientCommand } = require("@twilio/cli-core").baseCommands;

const {

  convertYargsOptionsToOclifFlags,
  runPulumiCommand,
  options

} = require('../../utils');


class FunctionsDeploy extends TwilioClientCommand {
  async run() {

    await super.run();
    
    await runPulumiCommand(this.parse(FunctionsDeploy), this.twilioClient, "pulumi up", "--yes");

    return;

  }
}

FunctionsDeploy.description = "Deploys and updates resources described in this directory to a Twilio project";

FunctionsDeploy.args = [];

FunctionsDeploy.flags = Object.assign(
  {},
  convertYargsOptionsToOclifFlags(options),
  { profile: TwilioClientCommand.flags.profile }
);

module.exports = FunctionsDeploy;
