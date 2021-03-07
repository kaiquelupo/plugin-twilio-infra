const { TwilioCliError } = require('@twilio/cli-core').services.error;

const util = require('util');
const childProcess = require('child_process');
const exec = util.promisify(childProcess.exec);

const Printer = require('./printer');

/**
 * Add environment variable to process.env
 *
 * @param {{}} twilioClient Initialized Twilio Client
 * @param {*?} flags Command flags
 * @param {string?} stack Pulumi stack
 * @return {{}} Environment key-value pairs
 */
function getEnvironmentVariables(twilioClient) {
  let envVars = process.env;
  if (twilioClient) {
    envVars.TWILIO_ACCOUNT_SID = twilioClient.accountSid;
    envVars.TWILIO_AUTH_TOKEN = twilioClient.authToken;
    envVars.TWILIO_USERNAME = twilioClient.username;
    envVars.TWILIO_PASSWORD = twilioClient.password;
  }

  return envVars;
}

/**
 * Execute Pulumi CLI command
 *
 * @param {Array} args Arguments to Pulumi CLI command
 * @param {boolean=true} interactive Whether to run the command in interactive mode (i.e. gathering input from user)
 * @param {{}} twilioClient Initialized Twilio client
 */

async function runPulumiCommand(args, interactive = true, twilioClient) {
  try {
    let envVars = '';
    envVars = getEnvironmentVariables(twilioClient);
    if (interactive) {
      Printer.printHeader('Pulumi CLI output');
      childProcess.execFileSync('pulumi', args, {
        stdio: 'inherit',
        env: getEnvironmentVariables(twilioClient),
      });
      Printer.printHeader('End of Pulumi CLI output');
    } else {
      const { stdout, stderr } = await exec(
        `${envVars} pulumi ${args.join(' ')}`
      );
      if (stderr) {
        if (!stdout) {
          throw new TwilioCliError(stderr);
        }
        Printer.printPulumiError(stderr);
      }
      Printer.printPulumiOutput(stdout);
    }
  } catch (error) {
    throw new TwilioCliError(
      '\n\nError running Pulumi CLI command.\n ** ' + error.message
    );
  }
}

module.exports = {
  runPulumiCommand,
  Printer,
};
