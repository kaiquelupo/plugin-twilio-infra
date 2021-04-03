const fs = require('fs');
const { getDeploymentEnvironment } = require('./utils');
const TWILIO_INFRA_FILENAME = '.twilio-infra';

/**
 * Read deployment from local log file
 * @returns {Object} Returns deployments stored locally
 */
function readInfra() {
  let deployments;
  try {
    deployments = JSON.parse(fs.readFileSync(TWILIO_INFRA_FILENAME)) || {};
  } catch (err) {
    deployments = {};
  }
  return deployments;
}

function writeInfra(deployments) {
  try {
    fs.writeFileSync(TWILIO_INFRA_FILENAME, JSON.stringify(deployments));
  } catch (err) {
    //TODO: Error handling
  }
}

function removeInfraFile() {
  fs.access(TWILIO_INFRA_FILENAME, fs.constants.F_OK, (error) => {
    if (!error) {
      fs.unlinkSync(TWILIO_INFRA_FILENAME, { force: true });
    }
  });
}

/**
 * Add a deployment log to the local file
 *
 * @param {string} accountSid Account SID of the deployment
 * @param {string} environment Environment name for the deployment
 * @return {Object} Deployments list
 */
async function addInfra(accountSid, environment) {
  if (!environment) {
    environment = getDeploymentEnvironment();
  }
  let deployments = readInfra();
  deployments[accountSid] = { environment };
  writeInfra(deployments);
  return deployments;
}

/**
 * Remove a deployment log to the local file
 *
 * @param {string} accountSid Account SID of the deployment
 * @return {Object} Deployment list, or empty object if no deployment left
 */
function removeInfra(accountSid) {
  let deployments = readInfra();
  if (deployments[accountSid]) {
    delete deployments[accountSid];
  }
  if (Object.keys(deployments).length === 0) {
    removeInfraFile();
  } else {
    writeInfra(deployments);
  }
  return deployments;
}

module.exports = {
  addInfra,
  removeInfra,
  readInfra,
};
