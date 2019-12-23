(function() {
  var MetaCoffee, code, compiled, fileName, fs, mkdirp, path, targetDirectory, targetFileName;

  path = require('path');

  fs = require('fs');

  mkdirp = require('mkdirp');

  MetaCoffee = (require('./prettyfier'))(require('./index'));

  targetDirectory = process.argv[2];

  fileName = process.argv[3];

  code = fs.readFileSync(fileName, "utf-8");

  compiled = MetaCoffee.compile(code);

  targetFileName = path.basename(fileName, path.extname(fileName));

  mkdirp.sync(targetDirectory);

  fs.writeFileSync(path.join(targetDirectory, targetFileName + '.js'), compiled, "utf-8");

}).call(this);
