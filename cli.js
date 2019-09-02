#!/usr/bin/env node

const app = require('./src');
app.run(process.argv.slice(2)).then(process.exit);
