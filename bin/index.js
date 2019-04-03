#!/usr/bin/env node

const vorpal = require('vorpal')();
vorpal.use(require('../src/cli.js'));
// vorpal.use(require('../src/testcli.js'));
