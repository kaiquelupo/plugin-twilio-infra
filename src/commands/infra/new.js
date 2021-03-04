const { TwilioClientCommand } = require('@twilio/cli-core').baseCommands;
const childProcess = require('child_process');
const validUrl = require('valid-url');

const {
  convertYargsOptionsToOclifFlags,
  options,
  getStackName,
} = require('../../utils');

class InfraNew extends TwilioClientCommand {
  async run() {
    await super.run();

    let { flags, args } = this.parse(InfraNew);

    const repo = validUrl.isUri(args.template) ?
      args.template :
      `https://github.com/pulumi/templates/tree/master/${
        args.template ? args.template : 'javascript'
      }`;

    let pulumiArgs = ['new', repo];
    const stackName = getStackName(flags, this.twilioClient);
    if (stackName) {
      pulumiArgs.push(`--stack=${stackName}`);
    }
    childProcess.execFileSync('pulumi', pulumiArgs, { stdio: 'inherit' });

    // Install twilio-pulumi-provider
    childProcess.execFileSync(
      'npm',
      ['install', 'twilio', 'twilio-pulumi-provider'],
      { stdio: 'inherit' }
    );
  }
}

InfraNew.description = 'Creates a new project based on a template';

InfraNew.args = [
  {
    name: 'template',
    required: false,
    description: 'The template name',
  },
];

InfraNew.flags = Object.assign({}, convertYargsOptionsToOclifFlags(options), {
  profile: TwilioClientCommand.flags.profile,
});

module.exports = InfraNew;
