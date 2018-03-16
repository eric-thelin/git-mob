#! /usr/bin/env node

const minimist = require('minimist');
const { oneLine } = require('common-tags');

const { config } = require('../git');
const { gitMessage, gitMessagePath } = require('../git-message');
const { runHelp, runVersion } = require('../helpers');

const argv = minimist(process.argv.slice(2), {
  alias: {
    h: 'help',
    v: 'version',
  },
});

if (argv.help) {
  runHelp();
  process.exit(0);
}

if (argv.version) {
  runVersion();
  process.exit(0);
}

runSolo(argv._);

function runSolo(args) {
  if (args.length === 0) {
    gitMessage(gitMessagePath)
      .removeCoAuthors()
      .then(() => {
        resetMob();
        printAuthor();
        process.exit(0);
      })
      .catch(err => {
        console.error(`Error: ${err.message}`);
        process.exit(1);
      });
  }
}

function printAuthor() {
  console.log(author());
}

function author() {
  const name = config.get('user.name').stdout.trim();
  const email = config.get('user.email').stdout.trim();
  return oneLine`${name} <${email}>`;
}

function resetMob() {
  config.removeSection('git-mob');
}
