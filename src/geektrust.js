const fs = require('fs');
const Main = require('./main');

const filename = process.argv[2];

fs.readFile(filename, 'utf8', (err, data) => {
  if (err) throw err;
  const inputLines = data.toString().split('\n');
  // Add your code here to process input commands
  new Main(inputLines);
  // for (let item of inputLines) {
  //     console.log(item);
  // }
});
