const { TwilioCliError } = require('@twilio/cli-core').services.error;
const childProcess = require('child_process');
const { readInfra } = require('./infra');
const Printer = require('./printer');
const fs = require('fs');
const dotenv = require('dotenv');

function getPulumiStack() {
  let pulumiOut = runPulumiCommand(['stack', 'ls'], false);
  let result = /^(.*?)\* /m.exec(pulumiOut);
  return result ? result[1] : null;
}

/**
 * Add environment variable to process.env
 *
 * @param {{}} twilioClient Initialized Twilio Client
 * @param {*?} shouldGetEnvsFromFile Whether to search and load env file for the current stack  
 * @return {{}} Environment key-value pairs
 */
function getEnvironmentVariables(twilioClient, shouldGetEnvFromFile) {

  let envVars = process.env;

  //remove recursion
  if(shouldGetEnvFromFile) {

    let environment = getPulumiStack();

    if(environment){

      const envFilePath = `${process.cwd()}/.env.${environment}`;

      if (fs.existsSync(envFilePath)) {

          const env = dotenv.config({ path: envFilePath });

          envVars = {
            ...envVars,
            ...env.parsed
          }

      }
    }
  }
  
  if (twilioClient) {
    envVars.TWILIO_ACCOUNT_SID = twilioClient.accountSid;
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

    const isDifferentFromGetPulumiStack = 
      (args[0] !== "stack" && args[1] !== "ls");

    if (interactive) {
      Printer.printHeader('Pulumi CLI output');
      childProcess.execFileSync('pulumi', args, {
        stdio: 'inherit',
        env: getEnvironmentVariables(twilioClient, isDifferentFromGetPulumiStack),
      });
      Printer.printHeader('End of Pulumi CLI output');
    } else {
      const stdout = childProcess.execSync(`pulumi ${args.join(' ')}`, {
        env: getEnvironmentVariables(twilioClient, isDifferentFromGetPulumiStack),
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
