const chalk = require('chalk');

/**
 * Simple printer class
 */

class Printer {
  static printPulumiOutput(message) {
    console.log(chalk.blue(message));
  }

  static printPulumiError(message) {
    const indent = '     ';
    console.log(chalk.magenta(`\n>${indent.substring(1)}Pulumi CLI:`));
    console.log(chalk.magenta(indent + message.replace(/\n/g, `\n${indent}`)));
  }

  static printHeader(message) {
    let decorator = '****************';
    console.log(chalk.magenta(`\n${decorator} ${message} ${decorator}\n`));
  }

  static printSuccess(message) {
    console.log(chalk.green(`\n🎉 ${message}\n`));
  }

  static print(message) {
    console.log(`\n${message}\n`);
  }
}

module.exports = Printer;
