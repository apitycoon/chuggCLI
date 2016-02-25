"use strict";

const inquirer = require('inquirer');
const chalk = require('chalk');

const scrapeWebpack = require('./scrapers/scrapeWebpack');
const searchWebpackLoaders = require('./searchWebpackLoaders');
const scrapeGithub = require('./scrapers/scrapeGithub');
const install = require('./handlers/installNpmPackages');
const checkWP = require('./handlers/checkWebpackConfig');
const addPackage = require('./handlers/addPackageJsonScript');
const createWP = require('./createWebpackConfig');

// let webpackConfig = createWP(__dirname);

let npmInstallArray = [];
let searchResults = [];
let readmeUrl;
let loaderName;

let loaderObj = {
  test: '',
  loader: ''
};

let webpackObj = {
  entry: '',
  output: '',
  module: {
    loaders: []
  }
};

function inputFileNames() {
  inquirer.prompt([
    {
      type: `input`,
      name: `entry`,
      message: `Please input your main .js file for this project.`,
      default: function() { return `index.js`; },
      validate: function(value) {
        var pass = value.match(/\.jsx?$/);
        
          if (pass) {
            return true;
          } else {
            return `Please enter a valid file ending in .js`;
          }
      }
    }, 
    {
      type: `input`,
      name: `output`,
      message: `Please select the name of the bundle file you'd like made.`,
      default: function() { return `bundle.js`; },
      validate: function(value) {
        var pass = value.match(/\.jsx?$/);
        
          if (pass) {
            return true;
          } else {
            return `Please enter a valid file ending in .js`;
          }
      } 
    }
  ], function(answers) {
    webpackObj.entry = answers.entry;
    webpackObj.output = answers.output;
    
    selectPresets();
  });
}

function selectPresets() {
  inquirer.prompt([
    {
      type: `checkbox`,
      name: `loaders`,
      message: `Select any presets you'd like installed`,
      choices: [
        {
          name: `React JSX w/ ES2015`
        },
        {
          name: `ES2015`
        },
        {
          name: `Bootstrap`
        },
        new inquirer.Separator(`=======`),
        {
          name: `Please, No Presets`
        }
      ]
      
    }
    ], function(answers) {
      
        if (answers.loaders.indexOf(`React JSX w/ ES2015`) > -1) {
          webpackObj.module.loaders.push(
            {
              test: /\.jsx?$/,
              exclude: /(node_modules|bower_components)/,
              loader: 'babel',
              query: {
                presets: ['react', 'es2015']
              }
            }
          );
          
          npmInstallArray = npmInstallArray.concat([`babel-loader`, `babel-core`, `babel-preset-es2015`, `babel-preset-react`]);
        } else if (answers.loaders.indexOf(`ES2015`) > -1) {
          webpackObj.module.loaders.push(
            {
              test: /\.jsx?$/,
              exclude: /(node_modules|bower_components)/,
              loader: 'babel',
              query: {
                presets: ['es2015']
              }
            }
          );
          
          npmInstallArray = npmInstallArray.concat([`babel-loader`, `babel-core`, `babel-preset-es2015`]);
        }
        
        if (answers.loaders.indexOf(`Bootstrap`) > - 1) {
          webpackObj.module.loaders = webpackObj.module.loaders.concat([
            {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'},
            { test: /\.css$/, loader: 'style-loader!css-loader' }
          ]);
          
          npmInstallArray = npmInstallArray.concat([`url-loader`, `file-loader`, `style-loader`, `css-loader`])
        }
      
      useCustomLoaders();
    }
  );
}

function useCustomLoaders() {
  inquirer.prompt({
    type: `confirm`,
    name: `usingMoreLoaders`,
    message: `Will you require webpack to bundle any non-js files?`,
    default: function() { return true; }
  }, function(answers) {
      if (answers.usingMoreLoaders) {
        loaderObj = {
          test: '',
          loader: ''
        };
        
        promptSearch();
      } else {
        endCLI();
      }
  });
}

function promptSearch() {
  inquirer.prompt({
    type: `input`,
    name: `searchQuery`,
    message: `Please input the kind of file you'd like webpack to load:`,
    validate: function(value) {
      if (value) {
        return true;
      } else {
        return `Please enter a search query:`
      }
    }
  }, function(answers) {
    scrapeWebpack('https://webpack.github.io/docs/list-of-loaders.html')
    .then(function(data) {
      searchResults = searchWebpackLoaders(answers.searchQuery, data);
      
      showSearchResults();
    });
  })
}

function showSearchResults() {
  let searchResultsDescriptions = searchResults.map(function(result) {
        const resultObj = { name: result.desc };
        return resultObj;
      });
  inquirer.prompt({
    type: `list`,
    name: `loaderChoice`,
    message: `Which loader would you like to use?`,
    choices: searchResultsDescriptions
  }, function(answers) {
    readmeUrl = searchResults.filter(function(obj) {
      return obj.desc === answers.loaderChoice;
    }).map(function(obj) { return obj.url })[0];
    
    showReadme();
  });
}

function showReadme() {
  loaderName = readmeUrl.slice(readmeUrl.lastIndexOf('/') + 1);
  
  scrapeGithub(readmeUrl).then(function(data) {
    console.log(data.readme)
    
    inquirer.prompt({
      type: `confirm`,
      name: `install`,
      message: `Would you like to add this loader to your webpack configuration?`,
      default: function() { return true; }
    }, function(answers) {
        if (answers.install) {
          loaderObj.loader = loaderName;
          
          giveTest();
        } else {
          showSearchResults();
        }
    });
  });
}

function giveTest() {
  inquirer.prompt({
    type: `input`,
    name: `test`,
    message: `What file extension will this loader be bundling?`
  }, function(answers) {
      if (answers.test[0] !== `.`) answers.test = `.${answers.test}`;
    
    loaderObj.test = new RegExp(`\${answers.test}`);
    includeOrExclude();
  });
}

function includeOrExclude() {
  inquirer.prompt({
    type: `list`,
    name: `include-exclude`,
    message: `Would you like to include or exclude and folders or files?`,
    choices: [
      {
        name: `Include`
      },
      {
        name: `Exclude`
      },
      {
        name: `No`
      }
    ]
  }, function(answers) {
    if (answers[`include-exclude`] === `Include`) {
      include();
    } else if (answers[`include-exclude`] === `Exclude`) {
      exclude();
    } else {
      loadLoader();
    }
  });
}

function include() {
  inquirer.prompt({
    type: `input`,
    name: `include`,
    message: `Which file or folder would you like to include for this loader?`,
    validate: function(value) {
      if (value) return true;
      
      return `Please enter a valid file or folder.`
    }
  }, function(answers) {
    loaderObj.include = new RegExp(answers.include);
    loadLoader();
  });
}
  
function exclude() {
  inquirer.prompt({
    type: `input`,
    name: `exclude`,
    message: `Which file or folder would you like to exclude from this loader?`,
    validate: function(value) {
      if (value) return true;
      
      return `Please enter a valid file or folder.`
    }
  }, function(answers) {
    loaderObj.exclude = new RegExp(answers.exclude);
    loadLoader();
  });
}

function loadLoader() {
  
    if (npmInstallArray.indexOf(loaderName) < 0) {
      webpackObj.module.loaders.push(loaderObj);
      npmInstallArray.push(loaderName);
      console.log(chalk.bgGreen(loaderName), `successfully loaded.`);
    } else {
      console.log(chalk.bgRed(loaderName), `detected as a duplicate and not loaded.`);
    }
    
  useCustomLoaders();
}

function endCLI() {
  console.log(webpackObj);
  console.log(npmInstallArray);
}

inputFileNames();


// checkWP().then(data => {
//   if (data) console.log(`Welcome to wpm. Please wait patiently as we check your pre-existing webpack files...`);
//   install(data).then(installData => {
//       if (installData) {
//         installData.forEach((result, index) => {
//             if (result[0].err) {
//               console.log('Error Installing: ', result[1][index]);
//               console.log('Error: ', result[0].stderr);
//             } else {
//               console.log('Installed: ', result[1][index]);
//             }
//           });
//       }
//     inputEntry();
//   });
// });