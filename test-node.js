
var jqlite = require('./jqlite');

if( !jqlite ) {
  console.log('\njqlite is not defined\n');
  process.exit(1);
}

console.log('\njqlite is defined (version: ' + jqlite.version + ')\n');

process.exit(0);
