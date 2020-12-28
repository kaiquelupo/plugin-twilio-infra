const { TwilioClientCommand } = require("@twilio/cli-core").baseCommands;

const {
  
  convertYargsOptionsToOclifFlags,
  runPulumiCommand,
  options

} = require('../../utils');

class FunctionsWatch extends TwilioClientCommand {
  async run() {
    await super.run();

    runPulumiCommand(this.parse(FunctionsWatch), this.twilioClient, "pulumi watch");
    
    return;
  }
}

FunctionsWatch.description = "Continuously update resources described in this directory in a Twilio project";

FunctionsWatch.args = [];

FunctionsWatch.flags = Object.assign(
  {},
  convertYargsOptionsToOclifFlags(options),
  { profile: TwilioClientCommand.flags.profile }
);

module.exports = FunctionsWatch;
