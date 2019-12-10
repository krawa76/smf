// a modified copy of app.js

require('ts-node/register');

process.chdir(__dirname);

function start(kmfCore) {
  var sails;
  var rc;
  try {
    sails = require('sails');
    rc = require('sails/accessible/rc');
  } catch (err) {
    console.error('Encountered an error when attempting to require(\'sails\'):');
    console.error(err.stack);
    return;
  }
  
  sails.kmfCore = kmfCore;
  
  // Start server
  sails.lift(rc('sails'));
  
  }

module.exports = start;