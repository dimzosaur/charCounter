const path = require('path');
const fs = require('fs');
const readLine = require('readline');
// Generates a filepath to the given filename
const filePath = filename => path.join(__dirname, filename);

const charCounter = string => {
  // Remove all white spaces in the string
  string = string.toLowerCase().replace(/\s/g, '');
  
  // Get chars which are not duplicated
  const nodups = string.split('').reduce((prev, curr) => {
    !prev.includes(curr) ? prev.push(curr) : null
    return prev;
  }, []);

  return nodups
    .map(el => {
      // Tests how many ocurrences a char has in the given string
      // Escapes (\) the char if its non char (example . ? etc)
      const regex = new RegExp(/\W/.test(el) ? `\\${el}` : el , 'g');
      return `${el}: ${string.match(regex).length}`;
    })
    .sort((a, b) => {
      // Sort by ocurrence
      // parseInt -> otherwise it will sort by string.length 
      // because string.split returns an array containing strings
      const c = parseInt(a.split(':')[1]), d = parseInt(b.split(':')[1]) 
      if(c>d) return -1
      else if(c<d) return 1
      else return 0;
    })
    .join(', ');
};

// Generates a new instance of readline.Instance
const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Outputs query, waits for user to provide an input 
// then executes the given callback
rl.question(`Type relative directory and filename: \n`, answer => {

  const userInput = answer.toString().split(' ');

  // If input is 1 length, search for that named file
  // in the current directory (./)
  if(userInput.length === 1) {
    userInput[1] = userInput[0];
    userInput[0] = './';
  };

  fs.readdir(userInput[0], (err, data) => {
    if(err) throw err;

    // Loop files in the given directory
    // return filename if matches input's filename
    const f = data
      .find(el => el.replace(/\.[^.]+$/, '') === userInput[1].replace(/\.[^.]+$/, '')); // Removes extension

    // If f is not definer nor null
    if(!!f) {
      fs.readFile(path.join(__dirname, userInput[0], f), { encoding: 'utf8' }, (err, file) => {
        if(err) throw err
        console.log(charCounter(file));
      });

    } else console.log('File was not found.');
  })
  // Closes readline's stream
  rl.close();
});
