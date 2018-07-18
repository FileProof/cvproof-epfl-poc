// This file can be used as a main method for quick testing

var Block = require('../models/block.js').Block;

var block = new Block("Holder", "Validator", "Type", "Frame", "Body", "Path");
console.log(block);

var hash = block.process(true);
console.log(hash);

console.log(block);