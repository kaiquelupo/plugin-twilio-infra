const { TwilioClientCommand } = require('@twilio/cli-core').baseCommands;

const {
  convertYargsOptionsToOclifFlags,
  options,
} = require('../../../utils');

const shell = require('shelljs');

class FunctionsStackNew extends TwilioClientCommand {
  async run() {
    await super.run();

    let { args } = this.parse(FunctionsStackNew);
    shell.exec(`pulumi stack init ${args.name.replace('--name=', '')}`);
  }
}

FunctionsStackNew.description = 'Create a new Pulumi stack in your project';

FunctionsStackNew.args = [
  {
    name: 'name',
    required: true,
    description: 'Name of the stack',
  },
];

FunctionsStackNew.flags = Object.assign(
  {},
  convertYargsOptionsToOclifFlags(options),
  { profile: TwilioClientCommand.flags.profile }
);

module.exports = FunctionsStackNew;
