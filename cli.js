#!/usr/bin/env node

'use strict';

const readline = require('readline');
const path = require('path');
const scrapeWebpack = require('./scrapers/scrapeWebpack');
const searchWebpackLoaders = require('./searchWebpackLoaders');
const scrapeGithub = require('./scrapers/scrapeGithub');
const install = require('./handlers/installNpmPackages');
const checkWP = require('./handlers/checkWebpackConfig');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let configObj = {};
let results;
let currentLoader;
let currentLoaderName;
let currentLoaderData;
let installationArray = [];

function closeReadline() {
  console.log(`Loading modules: ${installationArray}`)
  install(installationArray).then(function(data) {
    
    
      data.forEach((result, index) => {
        if (result[0].err) {
          console.log('Error Installing: ', result[1][index]);
          console.log('Error: ', result[0].stderr);
        } else {
          console.log('Installed: ', result[1][index]);
        }
      });
      rl.close();
  });
}

function inputEntry() {
  rl.question(`Please input your entry js file:
`, answer => {
      if (answer.slice(-3) !== '.js') incorrectEntry(answer);
      else {
        if (answer[0] !== `.`) answer = `.${answer}`;
        if (answer[1] !== `/`) answer = `./${answer.slice(1)}`;

      configObj.entry = answer;  
      console.log(`You answered: ${answer}`);
      inputOutput(answer);
      }
  });
}

function incorrectEntry(mistake) {
  rl.question(`${mistake} is not a valid JavaScript file. Please enter a file with a .js extension:
`, answer => {
      if (answer.slice(-3) !== '.js') incorrectEntry(answer);
      else {
        if (answer[0] !== `.`) answer = `.${answer}`;
        if (answer[1] !== `/`) answer = `./${answer.slice(1)}`;

      configObj.entry = answer;  
      console.log(`You answered: ${answer}`);
      inputOutput(answer);
      }
  });
}

function inputOutput() {
  rl.question(`Please select the location of your output file:
`, answer => {
      if (answer.slice(-3) !== '.js') {
        incorrectOutput(answer);
      }
      else {
          if (answer[0] !== `.`) answer = `.${answer}`;
          if (answer[1] !== `/`) answer = `./${answer.slice(1)}`;
          
        configObj.output = answer;
        console.log(`You answered: ${answer}`);
        selectPreset();
      }
  });
  
}

function incorrectOutput(mistake) {
  rl.question(`${mistake} is not a valid JavaScript file. Please enter a file with a .js extension:
`, answer => {
      if (answer.slice(-3) !== '.js') {
        incorrectOutput(answer);
      } else {
          if (answer[0] !== `.`) answer = `.${answer}`;
          if (answer[1] !== `/`) answer = `./${answer.slice(1)}`;
        
        configObj.output = answer;
        console.log(`You answered: ${answer}`);
        selectPreset();
      }
  });  
}

function selectPreset() {
  rl.question(`Would you like to use any of our presets? Flag as many as you'd like
[r] React JSX w/ ES2015 
[e] ES2015 
[b] Bootstrap
-----------------------
To add other loaders, please include [n]
`, answer => {
    if (answer.search('r') > -1) {
      loadReactPreset();
    } else if (answer.search('e') > - 1) {
      loadES2015Preset();
    }
    
    if (answer.search('b') > -1) {
      loadBoostrapPreset();
    }
    if (answer.search('n') > -1) {
      return useLoaders();
    }
  closeReadline();
  });
}

function loadReactPreset() {
  console.log(`React preset added.`);
  installationArray = installationArray.concat(['babel-loader', 'babel-core', 'babel-preset-es2015', 'babel-preset-react']);
  
}

function loadES2015Preset() {
  console.log(`ES2015 preset added.`);
  installationArray = installationArray.concat(['babel-loader', 'babel-core', 'babel-preset-es2015']);
}
  
function loadBoostrapPreset() {
  console.log(`Boostrap preset added.`)
  installationArray = installationArray.concat(['file-loader', 'url-loader', 'bootstrap-webpack', 'expose-loader']);
}
  
  
  
  
  
  
//       if (answer !== 'r' && answer !== 'a' && answer !== 'n') {
//         invalidPreset(answer);
//       } else if (answer === 'r') {
//         configObj.presets = answer;
//         console.log(`You answered: React`);
//         closeReadline();
//       } else if (answer === 'a') {
//         configObj.presets = answer;
//         console.log(`You answered: Angular`);
//         closeReadline();
//       } else {
//         configObj.presets = answer;
//         useLoaders();
//       }
//   });
// }

function invalidPreset(mistake) {
  rl.question(`${mistake} is an invalid preset. Please select either [r] React, [a] Angular or [n] none
`, answer => {
      if (answer !== 'r' && answer !== 'a' && answer !== 'n') {
        invalidPreset(answer);
      } else if (answer === 'r') {
        configObj.presets = answer;
        console.log(`You answered: React`);
        closeReadline();
      } else if (answer === 'a') {
        configObj.presets = answer;
        console.log(`You answered: Angular`);
        closeReadline();
      } else {
        configObj.presets = answer;
        useLoaders();
      }
  });
}

function useLoaders() {
  rl.question(`Will you need to load any non-js files? y/n
`, answer => {
      if (answer !== 'y' && answer !== 'n') {
        useLoaders();
      } else if (answer === 'n') {
        closeReadline();
      } else {
        configObj.needLoader = answer;
        console.log(`You answered: ${answer}`);
        beginSearch();
      }
  });
}

function beginSearch() {
  rl.question(`Please input the type of file you'd like to search the webpack loader list for:
`, answer => {
  scrapeWebpack('https://webpack.github.io/docs/list-of-loaders.html')
    .then(data => {
      results = searchWebpackLoaders(answer, data);
      showSearchResults();
    });
  
  
      configObj.search = answer;
      console.log(`You answered: ${answer}`);
  });
  
}

function showSearchResults() {
  results.map(result => result.desc)
  .forEach( (desc, index) => console.log(`[${index}] ${desc}`));
  rl.question(`Please select the option you would like to install:
`, answer => {
    var resultsIndexes = Object.keys(results);
    currentLoader = results[resultsIndexes[answer]];
    currentLoaderName = currentLoader.url.slice(currentLoader.url.lastIndexOf('/') + 1);
    scrapeGithub(currentLoader.url).then(data => {
      currentLoaderData = data;
      console.log(data.readme);
      askToInstall();
    });
  });
}

function askToInstall() {
  rl.question(`Would you like to install ${currentLoaderName}? y/n
`, answer => {
      if (answer === 'y') {
          installationArray.push(currentLoaderName);
          inputTest();
      } else if (answer === 'n') {
        showSearchResults();
      } else {
        console.log(`You didn't choose y or n.`);
        askToInstall();
      }
  });
}

function inputTest() {
  rl.question(`What file extension would you like to associate with this loader?
`, answer => {
      if (answer[0] === `.`) {
        configObj.test = answer;
      } else {
        configObj.test = `.${answer}`;
      }
    console.log(`You answered: ${answer}`);      
    includeOrExclude();
  });
}

function includeOrExclude() {
  rl.question(`Would you like to [i]nclude or [e]xclude any files/folders or [n]ot?
`, answer => {
      if (answer === 'i') {
        include();
      } else if (answer === 'e') {
        exclude();
      } else if (answer === 'n') {
        useLoaders();
      } else {
        console.log(`You didn't choose i, e or n.`)
        includeOrExclude();
      }
  });
}

function include() {
  rl.question(`Which file or folder would you like to include?
`, answer => {
    configObj.include = answer;
    console.log(`${currentLoaderName} loaded. Returning to seach query.`);
    useLoaders();
  });
}

function exclude() {
  rl.question(`Which file or folder would you like to exclude?
`, answer => {
    configObj.exclude = answer;
    
    
    console.log(`${currentLoaderName} loaded. Returning to seach query.`);
    useLoaders();
  });
}


checkWP().then(data => {
  if (data) console.log(`Welcome to wpm. Please wait patiently as we check your pre-existing webpack files...`);
  install(data).then(installData => {
    installData.forEach((result, index) => {
        if (result[0].err) {
          console.log('Error Installing: ', result[1][index]);
          console.log('Error: ', result[0].stderr);
        } else {
          console.log('Installed: ', result[1][index]);
        }
      });
    inputEntry();
  });
});

// inputEntry();

// beginSearch();
