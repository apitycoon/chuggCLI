const fs = require('fs');

// object constructor for loaders
// these will also be exposed from the module
function Loader() {
  this.loader = [];
  this.test = '';
  this.query = '';
  this.include = '';
}
Loader.prototype.addLoader = function(value) {
  //deal with both array and chained loaders
  this.loader = value;
}
Loader.prototype.addTest = function(value) {
  this.test = value.toString();
}
Loader.prototype.addQuery = function(value) {
  this.query = value;
}
Loader.prototype.addInclude = function(value) {
  this.include = value ? value : '/node_modules/';
}

// object constructor for the output portion of the config file
function Output() {
  this.filename = '';
  this.path = '';
  this.publicPath = '';
}
Output.prototype.addFilename = function(value) {
  this.filename = value;
}
Output.prototype.addPath = function(value) {
  this.path = value;
}
Output.prototype.addPublicPath = function(value) {
  this.publicPath = value;
}

// primary config file object constructor
function Config() {
  this.entry = '';
  this.output = new Output();
  this.module = { loaders: [] };
  this.plugins = [];
}
Config.prototype.addEntry = function(value) {
  this.entry = value;
}
Config.prototype.createLoader = function() {
  const newLoader = new Loader();
  this.module.loaders.push(newLoader);
  return newLoader;
}
Config.prototype.addPlugin = function(value) {
  // add error handling
  this.plugins.push(value);
}

Config.prototype.getPath = function() {

}

// to be added
Config.prototype.removeLoader = function() {

}

// method to write the file to webpack.config.js file
Config.prototype.done = function() {
  fs.writeFile('test.js', objToString(this));
}

// could wrap in closure to avoid the history variable in the
// main context
const history = [];

function objToString(obj, ndeep) {
  if(obj == null){ return String(obj); }
  switch(typeof obj){
    case "string":
    // deal with regex inputs
    if (obj[0] === '/' && obj[obj.length - 1] === '/') {
      // allows for modification to only do change for
      // properties that are predetermined to have regex
      console.log(history.pop(), obj)
      return obj;
    }
    return "'"+obj+"'";
    case "function": return obj.name || obj.toString();
    case "object":
    var indent = Array(ndeep || 1).join('  '), isArray = Array.isArray(obj);
    return '{['[+isArray] + Object.keys(obj).map(function(key){
      history.push(key);
      var disp = isArray ? '' : `${key}: `;
      return '\n  ' + indent + disp + objToString(obj[key], (ndeep || 1) + 1);
    }).join(',') + '\n' + indent + '}]'[+isArray];
    default: return obj.toString();
  }
}

// returns a Config object that integrates information from
// an existing webpack.config.js file
function createWebpackConfig(pathToFile) {
  // check for an existing webpack filename
  var existingConfig;
  try {
    existingConfig = require(pathToFile + '/webpack.config.js');
  }
  catch (e) {
    // no existing config file
  }

  if (!existingConfig) {
    // when there is no existing config file return a new config object
    return new Config();
  }

  const newConfig = new Config();
  // merge exisiting config into our structure
  for (var prop in existingConfig) {

    // handle output object to grab methods
    if (prop === 'output') {
      newConfig.output.addPath(existingConfig[prop].path);
      newConfig.output.addPublicPath(existingConfig[prop].publicPath);
      newConfig.output.addFilename(existingConfig[prop].filename);
    } else if (prop === 'module') {
      existingConfig.module.loaders.forEach(loader => {
        const newLoader = newConfig.createLoader();
        newLoader.addLoader(loader.loader);
        //newLoader.addLoader(loader.loaders);
        newLoader.addTest(loader.test);
        newLoader.addQuery(loader.query);
        newLoader.addInclude(loader.include);
      });
    } else {
      newConfig[prop] = existingConfig[prop];
    }
  }

  return newConfig;

}

const test = createWebpackConfig(__dirname);
test.done();

module.exports = createWebpackConfig;
