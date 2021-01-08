const { TwilioClientCommand } = require("@twilio/cli-core").baseCommands;
const child_process = require("child_process");
const validUrl = require('valid-url');

const {

  convertYargsOptionsToOclifFlags,
  options,
  getStackName

} = require('../../utils');

class InfraNew extends TwilioClientCommand {
  async run() {
    await super.run();

    let { flags, args } = this.parse(InfraNew);

    const repo = 
      validUrl.isUri(args.template) ? 
        args.template :
        `https://github.com/pulumi/templates/tree/master/${args.template ? args.template : "javascript"}` 
    
    const stackName = getStackName(flags, this.twilioClient);

    child_process.execFileSync('pulumi', ["new", repo, `--stack=${stackName}`], { stdio: 'inherit' });

    return;
  }
}

InfraNew.description = "Creates a new project based on a template";

InfraNew.args = [
  {
    name: 'template',
    required: false,
    description: 'The template name',
  }
];

InfraNew.flags = Object.assign(
  {},
  convertYargsOptionsToOclifFlags(options),
  { profile: TwilioClientCommand.flags.profile }
);

module.exports = InfraNew;
