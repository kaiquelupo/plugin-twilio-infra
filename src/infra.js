const fs = require('fs');
const TWILIO_INFRA_FILENAME = '.twilio-infra';

/**
 * Read deployment from local log file
 * @returns {Object} Returns deployments stored locally
 */
function readInfra() {
  let infras;
  try {
    infras = JSON.parse(fs.readFileSync(TWILIO_INFRA_FILENAME)) || {};
  } catch (err) {
    infras = {};
  }
  return infras;
}

function writeInfra(infras) {
  try {
    fs.writeFileSync(TWILIO_INFRA_FILENAME, JSON.stringify(infras));
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
 * @param {boolean} [deployed=false] Deployment status: set true if deployed
 * @return {Object} Deployments list
 */
async function addInfra(accountSid, environment, deployed) {
  deployed = deployed || false;
  let infras = readInfra();
  infras[accountSid] = { environment, deployed };
  writeInfra(infras);
  return infras;
}

/**
 * Remove a deployment log to the local file
 *
 * @param {string} accountSid Account SID of the deployment
 * @return {Object} Deployment list, or empty object if no deployment left
 */
function removeInfra(accountSid) {
  let infras = readInfra();
  if (infras[accountSid]) {
    delete infras[accountSid];
  }
  if (Object.keys(infras).length === 0) {
    removeInfraFile();
  } else {
    writeInfra(infras);
  }
  return infras;
}

function destroyInfra(accountSid) {
  let infras = readInfra();
  if (infras[accountSid]) {
    infras[accountSid].deployed = false;
  }
  writeInfra(infras);
  return infras;
}

module.exports = {
  addInfra,
  removeInfra,
  readInfra,
  destroyInfra,
};
