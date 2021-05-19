const { TwilioCliError } = require('@twilio/cli-core').services.error;

const childProcess = require('child_process');
const { readInfra } = require('./infra');
const Printer = require('./printer');

function getPulumiStack() {
  let pulumiOut = runPulumiCommand(['stack', 'ls'], false);
  let result = /^(.*?)\* /m.exec(pulumiOut);
  return result ? result[1] : null;
}

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
 * @return {null | string} Pulumi command output if executed non interactively. Void if execute interactively
 */

function runPulumiCommand(args, interactive = true, twilioClient) {
  try {
    if (interactive) {
      Printer.printHeader('Pulumi CLI output');
      childProcess.execFileSync('pulumi', args, {
        stdio: 'inherit',
        env: getEnvironmentVariables(twilioClient),
      });
      Printer.printHeader('End of Pulumi CLI output');
    } else {
      const stdout = childProcess.execSync(`pulumi ${args.join(' ')}`, {
        env: getEnvironmentVariables(twilioClient),
      });
      return stdout.toString();
    }
  } catch (error) {
    throw new TwilioCliError(
      '\n\nError running Pulumi CLI command.\n ** ' + error.message
    );
  }
}

/**
 * Check if there is already a deployment of the current stack under a different
 * account SID
 *
 * @returns {string | undefined} Account Sid of the project the current stack is deployed to
 */
function getEnvironmentDeployment() {
  let result;
  try {
    let stack = getPulumiStack();
    let infras = readInfra();
    if (stack && Object.keys(infras).length > 0) {
      Object.keys(infras).forEach(sid => {
        if (infras[sid].environment === stack) {
          result = sid;
        }
      });
    }
  } catch (err) {
    console.log(err);
  }

  return result;
}

module.exports = {
  runPulumiCommand,
  Printer,
  getPulumiStack,
  getEnvironmentDeployment,
};
