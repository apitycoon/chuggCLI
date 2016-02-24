#!/usr/bin/env node

'use strict';

const readline = require('readline');
const path = require('path');
const scrapeWebpack = require('./scrapers/scrapeWebpack');
const searchWebpackLoaders = require('./searchWebpackLoaders');
const scrapeGithub = require('./scrapers/scrapeGithub');
const install = require('./handlers/installNpmPackages');
const checkWP = require('./handlers/checkWebpackConfig');
const createWP = require('./createWebpackConfig');

let webpackConfig = createWP(__dirname);


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let results;
let currentLoader;
let currentLoaderUrl;
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
      
      webpackConfig.done('./');
      
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

      webpackConfig.addEntry(answer);  
      console.log(`You answered: ${answer}`);
      inputOutput();
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

      webpackConfig.addEntry(answer);
      console.log(`You answered: ${answer}`);
      inputOutput();
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
          
        webpackConfig.output.addFilename(answer);
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
        
        webpackConfig.output.addFilename(answer);
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
  var reactLoader = webpackConfig.createLoader();
  
  reactLoader.addLoader('babel');
  reactLoader.addTest(/\.jsx?$/, true);
  reactLoader.addQuery({ presets: ['react', 'es2015'] });
  reactLoader.addExclude('node_modules|bower_components');
  installationArray = installationArray.concat(['babel-loader', 'babel-core', 'babel-preset-es2015', 'babel-preset-react']);
  console.log(`React preset added.`);
  
}

function loadES2015Preset() {
  var es2015Loader = webpackConfig.createLoader();
  
  es2015Loader.addLoader('babel');
  es2015Loader.addTest('.js');
  es2015Loader.addQuery({ presets: ['es2015'] });
  es2015Loader.addExclude('(node_modules|bower_components)');
  
  installationArray = installationArray.concat(['babel-loader', 'babel-core', 'babel-preset-es2015']);
  console.log(`ES2015 preset added.`);
}
  
function loadBoostrapPreset() {
  
  // { test: /\.css$/, loader: 'style-loader!css-loader' },
  // { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
  // { test: /\.(woff|woff2)$/, loader:"url?prefix=font/&limit=5000" },
  // { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
  // { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" }
  
  var cssLoader = webpackConfig.createLoader();
  var eotLoader = webpackConfig.createLoader();
  var woffLoader = webpackConfig.createLoader();
  var ttfLoader = webpackConfig.createLoader();
  var svgLoader = webpackConfig.createLoader();
  
  
  cssLoader.addLoader('style-loader!css-loader');
  cssLoader.addTest('.css');
  
  eotLoader.addLoader('file');
  eotLoader.addTest(/\.eot(\?v=\d+\.\d+\.\d+)?$/, true);
  
  woffLoader.addLoader('url?prefix=font/&limit=5000');
  woffLoader.addTest(/\.(woff|woff2)$/, true);
  
  ttfLoader.addLoader('url?limit=10000&mimetype=application/octet-stream');
  ttfLoader.addTest(/\.ttf(\?v=\d+\.\d+\.\d+)?$/, true);
  
  svgLoader.addLoader('url?limit=10000&mimetype=image/svg+xml');
  svgLoader.addTest(/\.svg(\?v=\d+\.\d+\.\d+)?$/, true);
  
  
  installationArray = installationArray.concat(['file-loader', 'url-loader', 'style-loader', 'css-loader', 'bootstrap-webpack', 'expose-loader']);
  console.log(`Boostrap preset added.`)
}

// function invalidPreset(mistake) {
//   rl.question(`${mistake} is an invalid preset. Please select either [r] React, [a] Angular or [n] none
// `, answer => {
//       if (answer !== 'r' && answer !== 'a' && answer !== 'n') {
//         invalidPreset(answer);
//       } else if (answer === 'r') {
//         webpackConfig.presets = answer;
//         console.log(`You answered: React`);
//         closeReadline();
//       } else if (answer === 'a') {
//         webpackConfig.presets = answer;
//         console.log(`You answered: Angular`);
//         closeReadline();
//       } else {
//         webpackConfig.presets = answer;
//         useLoaders();
//       }
//   });
// }

function useLoaders() {
  rl.question(`Will you need to load any non-js files? y/n
`, answer => {
      if (answer !== 'y' && answer !== 'n') {
        useLoaders();
      } else if (answer === 'n') {
        closeReadline();
      } else {
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
  
      console.log(`You answered: ${answer}`);
  });
  
}

function showSearchResults() {
  results.map(result => result.desc)
  .forEach( (desc, index) => console.log(`[${index}] ${desc}`));
  rl.question(`Please select the option you would like to install:
`, answer => {
    var resultsIndexes = Object.keys(results);
    currentLoaderUrl = results[resultsIndexes[answer]].url;
    currentLoaderName = currentLoaderUrl.slice(currentLoaderUrl.lastIndexOf('/') + 1);
    scrapeGithub(currentLoaderUrl).then(data => {
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
        currentLoader = webpackConfig.createLoader();
        currentLoader.addLoader(currentLoaderName);
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
        currentLoader.addTest(`${answer}`);
      } else {
        currentLoader.addTest(`.${answer}`);
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
    currentLoader.addInclude(answer);
    console.log(`${currentLoaderName} loaded. Returning to seach query.`);
    useLoaders();
  });
}

function exclude() {
  rl.question(`Which file or folder would you like to exclude?
`, answer => {
    currentLoader.addExclude(answer);
    
    
    console.log(`${currentLoaderName} loaded. Returning to seach query.`);
    useLoaders();
  });
}


checkWP().then(data => {
  if (data) console.log(`Welcome to wpm. Please wait patiently as we check your pre-existing webpack files...`);
  install(data).then(installData => {
      if (installData) {
        installData.forEach((result, index) => {
            if (result[0].err) {
              console.log('Error Installing: ', result[1][index]);
              console.log('Error: ', result[0].stderr);
            } else {
              console.log('Installed: ', result[1][index]);
            }
          });
      }
    inputEntry();
  });
});

// inputEntry();

// beginSearch();
