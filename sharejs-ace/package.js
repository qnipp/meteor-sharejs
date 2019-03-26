Package.describe({
  name: "qnipp:sharejs-ace",
  summary: "ShareJS with the Ace Editor",
  version: "1.4.1",
  git: "https://github.com/qnipp/meteor-sharejs.git"
});

Npm.depends({
  "ace-builds": "1.2.2"
});

// Ugly-ass function stolen from http://stackoverflow.com/a/20794116/586086
// TODO make this less ugly in future
function getFilesFromFolder(packageName, folder){
  // local imports
  var _ = Npm.require("underscore");
  var fs = Npm.require("fs");
  var path = Npm.require("path");
  // helper function, walks recursively inside nested folders and return absolute filenames
  function walk(folder){
    var filenames = [];
    // get relative filenames from folder
    var folderContent = fs.readdirSync(folder);
    // iterate over the folder content to handle nested folders
    _.each(folderContent, function(filename) {
      // build absolute filename
      var absoluteFilename = path.join(folder, filename);
      // get file stats
      var stat = fs.statSync(absoluteFilename);
      if(stat.isDirectory()){
        // directory case => add filenames fetched from recursive call
        filenames = filenames.concat(walk(absoluteFilename));
      }
      else{
        // file case => simply add it
        filenames.push(absoluteFilename);
      }
    });
    return filenames;
  }
  // save current working directory (something like "/home/user/projects/my-project")
  var cwd = process.cwd();

  var isRunningFromApp = fs.existsSync(path.resolve("packages"));
  var packagePath = isRunningFromApp ? path.resolve("packages", packageName) : "";

  packagePath = path.resolve(packagePath);
  // chdir to our package directory
  process.chdir(path.join(packagePath));
  // launch initial walk
  var result = walk(folder);
  // restore previous cwd
  process.chdir(cwd);
  return result;
}

Package.onUse(function (api) {
  api.versionsFrom("1.3");

  api.use(['ecmascript', 'modules', 'templating']);

  api.use("edemaine:sharejs@0.10.3-alpha.2");
  api.imply("edemaine:sharejs");

  var _ = Npm.require("underscore");

  // Add Ace files as assets that can be loaded by the client later
  try {
    var aceSettings = getFilesFromFolder("qnipp:sharejs-ace", ".npm/package/node_modules/ace-builds/src-noconflict");
    api.addAssets(aceSettings, 'client');  
  } catch(e) {
    console.log(`Ignoring ${e}`);
  }

  api.mainModule('client.js', 'client');
  api.addFiles([
    'templates.html'
  ], 'client');
});
