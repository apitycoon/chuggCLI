const fs = require('fs');
const stringify = require('stringify-object');

// object constructor for loaders
// loaders need at least two props -- (i) loader and (ii) file extension to test
function Loader() {
  this.loader = '';
  this.test = '';
}
Loader.prototype.addLoader = function(value) {
  // deal with both array and chained loaders
  // convert everything to chained
  if (Array.isArray(value)) {
    value.forEach(loader => {
      if (this.loader) {
        this.loader = `${this.loader}!${loader.toString().trim()}`;
      } else {
        this.loader = loader.toString().trim();
      }
    })
  } else if (typeof value === 'string') {
    if (this.loader) {
      this.loader = `${this.loader}!${value.toString().trim()}`;
    } else {
      this.loader = value.toString().trim();
    }
  }
}

// merge flag allow you to bypass any tests/conversions
Loader.prototype.addTest = function(value, merge) {
  if (merge && value) {
    this.test = value.toString();
    return;
  }

  if (value) {
    // make sure that the input exists and is clean
    value = value.toString().trim();

    // add a period to the extension if not there
    if (value[0] !== '.') value = '.' + value;

    // add regex escapes
    value = '/\\' + value + '/';
    this.test = value;
  }
}
Loader.prototype.addQuery = function(value) {
  if (value) this.query = value;
}
Loader.prototype.addInclude = function(value, merge) {
  if (merge && value) {
    this.include = value.toString().trim();
    return;
  }

  // include should be regex otherwise not in the config
  if (value) {
    value = '/' + value.toString().trim() + '/';
    this.include = value;
  }
}
Loader.prototype.addExclude = function(value, merge) {
  if (merge && value) {
    this.exclude = value.toString().trim();
    return;
  }

  // exclude should be regex otherwise not in the config
  if (value) {
    value = '/' + value.toString().trim() + '/';
    this.exclude = value;
  }
}

// object constructor for the output portion of the config file
// there the minimum parameters are filename and path
function Output() {
  this.filename = '';
}
Output.prototype.addFilename = function(value) {
  this.filename = value;
}
Output.prototype.addPath = function(value) {
  if (value) this.path = value;
}
Output.prototype.addPublicPath = function(value) {
  // public path should be text; test before adding
  if (value) this.publicPath = value.toString();
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

// method to write the file to webpack.config.js file
Config.prototype.done = function(pathToFile) {
  // fs.writeFile('./webpack.config2.js', stringify(this));
  fs.writeFile(pathToFile + 'webpack.config.js', 'module.exports = ' + objToString(this));
}

// could wrap in closure to avoid the history variable in the main context
const history = [];
const regexCheck = {
  'include': true,
  'exclude': true,
  'test': true
};

function objToString(obj, ndeep) {
  if(obj == null){ return String(obj); }
  switch(typeof obj){
    case "string":
    // allows for modification to only properties that are predetermined to have regex
    if (obj[0] === '/' && obj[obj.length - 1] === '/' && regexCheck[history[history.length - 1]]) {
      history.pop();
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
function createWebpackConfig(pathToFile, merge) {
  if (merge === undefined) merge = true;

  // check for an existing webpack file
  var existingConfig;
  var existingRequires = [];
  try {
    existingConfig = require(pathToFile + '/webpack.config.js');

    // also read file for any require statements
    // fs.readFile
  }
  catch (e) {
    // no existing config file
  }

  const newConfig = new Config();
  if (!existingConfig || !merge) {
    // when there is no existing config file just return a new config object
    return newConfig;
  }

  // merge exisiting config into our structure
  for (var prop in existingConfig) {
    // handle objects where we want to use our methods
    if (prop === 'output') {
      newConfig.output.addPath(existingConfig[prop].path);
      newConfig.output.addPublicPath(existingConfig[prop].publicPath);
      newConfig.output.addFilename(existingConfig[prop].filename);
    } else if (prop === 'module') {
      existingConfig.module.loaders.forEach(loader => {
        const newLoader = newConfig.createLoader();
        newLoader.addLoader(loader.loader);
        newLoader.addLoader(loader.loaders);
        newLoader.addTest(loader.test, true);
        newLoader.addQuery(loader.query);
        newLoader.addInclude(loader.include, true);
        newLoader.addExclude(loader.exclude, true);
      });
    } else {
      // merge any other properties
      newConfig[prop] = existingConfig[prop];
    }
  }

  return newConfig;
}

module.exports = createWebpackConfig;
