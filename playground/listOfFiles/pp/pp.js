const ponyName = require('../rd/rd.js');
console.log(`Pinkie Loves ${ponyName.ponyName}`);

/*
describe:
Just importing the rd.js file
And tell the world how Pinkie loves Rainbow Dahs <3
*/

/*
describe:
Turn the pony name to lower case letters
*/
const lowerCasePonyName = ponyName.ponyName.toLocaleLowerCase();

/*
describe:
Turn the pony name to upper case letters
*/
const uppercaseCasePonyName = ponyName.ponyName.toUpperCase();
