Package.describe({
  name: "mizzao:sharejs-ace",
  summary: "ShareJS with the Ace Editor",
  version: "1.4.1",
  git: "https://github.com/mizzao/meteor-sharejs.git"
});

Package.onUse(function (api) {
  api.versionsFrom("1.3");

  api.use(['ecmascript', 'modules', 'templating']);

  api.use("mizzao:sharejs@0.9.0");
  api.imply("mizzao:sharejs");

  var _ = Npm.require("underscore");

  api.mainModule('client.js', 'client');
  api.addFiles([
    'templates.html'
  ], 'client');
});
