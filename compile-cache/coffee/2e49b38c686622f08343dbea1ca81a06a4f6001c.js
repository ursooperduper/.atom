(function() {
  var fs, getClangFlagsCompDB, getClangFlagsDotClangComplete, getFileContents, path;

  path = require('path');

  fs = require('fs');

  module.exports = {
    getClangFlags: function(fileName) {
      var flags;
      flags = getClangFlagsCompDB(fileName);
      if (flags.length === 0) {
        flags = getClangFlagsDotClangComplete(fileName);
      }
      return flags;
    },
    activate: function(state) {}
  };

  getFileContents = function(startFile, fileName) {
    var contents, error, parentDir, searchDir, searchFilePath, searchFileStats;
    searchDir = path.dirname(startFile);
    while (searchDir) {
      searchFilePath = path.join(searchDir, fileName);
      try {
        searchFileStats = fs.statSync(searchFilePath);
        if (searchFileStats.isFile()) {
          try {
            contents = fs.readFileSync(searchFilePath, 'utf8');
            return [searchDir, contents];
          } catch (_error) {
            error = _error;
            console.log("clang-flags for " + fileName + " couldn't read file " + searchFilePath);
            console.log(error);
          }
          return [null, null];
        }
      } catch (_error) {}
      parentDir = path.dirname(searchDir);
      if (parentDir === searchDir) {
        break;
      }
      searchDir = parentDir;
    }
    return [null, null];
  };

  getClangFlagsCompDB = function(fileName) {
    var allArgs, args, compDB, compDBContents, config, doubleArgs, i, it, nextArg, relativeName, searchDir, singleArgs, _i, _j, _k, _len, _len1, _ref, _ref1;
    _ref = getFileContents(fileName, "compile_commands.json"), searchDir = _ref[0], compDBContents = _ref[1];
    args = [];
    if (compDBContents !== null && compDBContents.length > 0) {
      compDB = JSON.parse(compDBContents);
      for (_i = 0, _len = compDB.length; _i < _len; _i++) {
        config = compDB[_i];
        relativeName = fileName.slice(searchDir.length + 1, +fileName.length + 1 || 9e9);
        if (fileName === config['file'] || relativeName === config['file']) {
          allArgs = config.command.replace(/\s+/g, " ").split(' ');
          singleArgs = [];
          doubleArgs = [];
          for (i = _j = 0, _ref1 = allArgs.length - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
            nextArg = allArgs[i + 1];
            if (allArgs[i][0] === '-' && (!nextArg || nextArg[0] === '-')) {
              singleArgs.push(allArgs[i]);
            }
            if (allArgs[i][0] === '-' && nextArg && (nextArg[0] !== '-')) {
              doubleArgs.push(allArgs[i] + " " + nextArg);
            }
          }
          args = singleArgs;
          for (_k = 0, _len1 = doubleArgs.length; _k < _len1; _k++) {
            it = doubleArgs[_k];
            if (it.slice(0, 8) === '-isystem') {
              args.push(it);
            }
          }
          args = args.concat(["-working-directory=" + searchDir]);
          break;
        }
      }
    }
    return args;
  };

  getClangFlagsDotClangComplete = function(fileName) {
    var args, clangCompleteContents, searchDir, _ref;
    _ref = getFileContents(fileName, ".clang_complete"), searchDir = _ref[0], clangCompleteContents = _ref[1];
    args = [];
    if (clangCompleteContents !== null && clangCompleteContents.length > 0) {
      args = clangCompleteContents.trim().split("\n");
      args = args.concat(["-working-directory=" + searchDir]);
    }
    return args;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLDZFQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQURMLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxhQUFBLEVBQWUsU0FBQyxRQUFELEdBQUE7QUFDYixVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxtQkFBQSxDQUFvQixRQUFwQixDQUFSLENBQUE7QUFDQSxNQUFBLElBQUcsS0FBSyxDQUFDLE1BQU4sS0FBZ0IsQ0FBbkI7QUFDRSxRQUFBLEtBQUEsR0FBUSw2QkFBQSxDQUE4QixRQUE5QixDQUFSLENBREY7T0FEQTtBQUdBLGFBQU8sS0FBUCxDQUphO0lBQUEsQ0FBZjtBQUFBLElBS0EsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBLENBTFY7R0FKRixDQUFBOztBQUFBLEVBV0EsZUFBQSxHQUFrQixTQUFDLFNBQUQsRUFBWSxRQUFaLEdBQUE7QUFDaEIsUUFBQSxzRUFBQTtBQUFBLElBQUEsU0FBQSxHQUFZLElBQUksQ0FBQyxPQUFMLENBQWEsU0FBYixDQUFaLENBQUE7QUFDQSxXQUFNLFNBQU4sR0FBQTtBQUNFLE1BQUEsY0FBQSxHQUFpQixJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsUUFBckIsQ0FBakIsQ0FBQTtBQUNBO0FBQ0UsUUFBQSxlQUFBLEdBQWtCLEVBQUUsQ0FBQyxRQUFILENBQVksY0FBWixDQUFsQixDQUFBO0FBQ0EsUUFBQSxJQUFHLGVBQWUsQ0FBQyxNQUFoQixDQUFBLENBQUg7QUFDRTtBQUNFLFlBQUEsUUFBQSxHQUFXLEVBQUUsQ0FBQyxZQUFILENBQWdCLGNBQWhCLEVBQWdDLE1BQWhD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
//# sourceURL=/Users/sarah/.atom/packages/autocomplete-clang/node_modules/clang-flags/lib/clang-flags.coffee