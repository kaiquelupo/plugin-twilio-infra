const path = require("path");
const camelCase = require("lodash.camelcase");
const { flags } = require("@oclif/command");
const { TwilioCliError } = require("@twilio/cli-core").services.error;
const fs = require("fs");

//TODO: remove dependencies from shelljs
const shell = require("shelljs");

const util = require("util");
const exec = util.promisify(require("child_process").exec);

var inquirer = require("inquirer");

function logger(message) {
  console.log(message);
}

function convertYargsOptionsToOclifFlags(options) {
  const flagsResult = Object.keys(options).reduce((result, name) => {
    const opt = options[name];
    const flag = {
      description: opt.describe,
      default: opt.default,
      hidden: opt.hidden,
    };

    if (typeof opt.default !== "undefined") {
      flag.default = opt.default;

      if (opt.type === "boolean") {
        if (flag.default === true) {
          flag.allowNo = true;
        }
      }
    }

    if (opt.alias) {
      flag.char = opt.alias;
    }

    if (opt.requiresArg) {
      flag.required = opt.requiresArg;
    }

    result[name] = flags[opt.type](flag);
    return result;
  }, {});
  return flagsResult;
}

function normalizeFlags(flags) {
  const result = Object.keys(flags).reduce((current, name) => {
    if (name.includes("-")) {
      const normalizedName = camelCase(name);
      current[normalizedName] = flags[name];
    }
    return current;
  }, flags);
  const [, command, ...args] = process.argv;
  result.$0 = path.basename(command);
  result._ = args;
  return result;
}

function createExternalCliOptions(flags, twilioClient) {
  const profile = flags.profile;

  return {
    username: twilioClient.username,
    password: twilioClient.password,
    accountSid: twilioClient.accountSid,
    profile,
    logLevel: undefined,
    outputFormat: undefined,
  };
}

function getRegionAndEdge(flags, clientCommand) {
  const edge =
    flags.edge || process.env.TWILIO_EDGE || clientCommand.userConfig.edge;
  const region = flags.region || clientCommand.currentProfile.region;

  return { edge, region };
}

function getEnvironmentVariables(flags, clientCommand, stack) {

  const accountSid = flags.accountSid || clientCommand.accountSid
  const authToken = flags.authToken
  const username = clientCommand.username;
  const password = clientCommand.password;

  let envFileVars = ""; 

  if (fs.existsSync(`.${stack}.env`)) {
    envFileVars = `export $(cat .${stack}.env | xargs) && `;
  }

  return `${envFileVars} TWILIO_ACCOUNT_SID=${accountSid} TWILIO_AUTH_TOKEN=${authToken} TWILIO_USERNAME=${username} TWILIO_PASSWORD=${password}`;
}

function normalizeArgs(args) {
  return Object.keys(args).reduce((pr, cur) => {

    if(args[cur]) {

      return {
        ...pr,
        [cur]: args[cur].replace(`--${cur}=`, "")
      } 

    }

    return pr;
    
  }, {});
}

function getStackName(flags, clientCommand) {

  const accountSid = flags.accountSid || clientCommand.accountSid;

  let infraFile = {};

  if (fs.existsSync('twilio-infra.json')) {

    infraFile = JSON.parse(fs.readFileSync('twilio-infra.json', 'utf8'));

  }

  return flags.stack || infraFile[accountSid];

}

function setStack(flags, args, clientCommand) {

  const stackName = getStackName(flags, clientCommand)

  if(stackName) {
    shell.exec(`pulumi stack init ${stackName}`, { silent: true });
  }

  return stackName
}

async function checkPulumi() {
  try {
    const { stdout, stderr } = await exec("pulumi login");
    if (stderr) {
      throw new TwilioCliError(stderr);
    }
    if (stdout.includes("(file://~)")) {
      return { local: true };
    }
  } catch (err) {
    throw new TwilioCliError(
      "Error running Pulumi CLI.\nMake sure the Pulumi CLI is installed\n" + err
    );
  }
}

async function runPulumiCommand(
  parseInputs,
  twilioClient,
  command,
  commandFlags
) {
  let { flags, args } = parseInputs;

  flags = normalizeFlags(flags);

  const stackName = setStack(flags, args, twilioClient);
  let vars = getEnvironmentVariables(flags, twilioClient, stackName);

  const pulumiCLI = await checkPulumi();
  if (
    pulumiCLI.local &&
    !(
      process.env.PULUMI_CONFIG_PASSPHRASE ||
      process.env.PULUMI_CONFIG_PASSPHRASE_FILE
    )
  ) {
    const answers = await inquirer.prompt([
      {
        type: "password",
        name: "passPhrase",
        message: "Enter your passphrase to unlock config/secrets",
      },
    ]);
    // Add passphrase to env variable
    vars += ` PULUMI_CONFIG_PASSPHRASE=${answers.passPhrase}`;
  }

  try {
    const { stdout, stderr } = await exec(
      `${vars} ${command} --stack=${stackName} ${commandFlags || ""}`
    );
    console.log(stdout);
  } catch (err) {
    throw new TwilioCliError("Error running Pulumi CLI command.\n" + err);
  }
}

const options = { 
  'stack': {
    alias: 's',
    describe: 'The stack to use for resources state',
    type: 'string',
  },
};

module.exports = {
  convertYargsOptionsToOclifFlags,
  normalizeFlags,
  createExternalCliOptions,
  getRegionAndEdge,
  getEnvironmentVariables,
  normalizeArgs,
  setStack,
  runPulumiCommand,
  getStackName,
  options
};
