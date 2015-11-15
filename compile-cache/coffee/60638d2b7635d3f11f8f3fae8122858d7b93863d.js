(function() {
  var Directory, File, getClangFlagsCompDB, getClangFlagsDotClangComplete, getFileContents, path, readFileSync, _ref;

  path = require('path');

  readFileSync = require('fs').readFileSync;

  _ref = require('pathwatcher'), File = _ref.File, Directory = _ref.Directory;

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
    var args, contents, error, searchDir, searchFile, searchFilePath, thisDir;
    searchDir = path.dirname(startFile);
    args = [];
    while (searchDir.length) {
      searchFilePath = path.join(searchDir, fileName);
      searchFile = new File(searchFilePath);
      if (searchFile.exists()) {
        try {
          contents = readFileSync(searchFilePath, 'utf8');
          return [searchDir, contents];
        } catch (_error) {
          error = _error;
          console.log("clang-flags for " + fileName + " couldn't read file " + searchFilePath);
          console.log(error);
        }
        return [null, null];
      }
      thisDir = new Directory(searchDir);
      if (thisDir.isRoot()) {
        break;
      }
      searchDir = thisDir.getParent().getPath();
    }
    return [null, null];
  };

  getClangFlagsCompDB = function(fileName) {
    var args, compDB, compDBContents, config, includes, searchDir, system_includes, _i, _len, _ref1;
    _ref1 = getFileContents(fileName, "compile_commands.json"), searchDir = _ref1[0], compDBContents = _ref1[1];
    args = [];
    if (compDBContents !== null && compDBContents.length > 0) {
      compDB = JSON.parse(compDBContents);
      for (_i = 0, _len = compDB.length; _i < _len; _i++) {
        config = compDB[_i];
        if (fileName === config['file']) {
          includes = config.command.match(/-I\S*/g);
          if (includes) {
            args = args.concat(includes);
          }
          system_includes = config.command.match(/-isystem\s*\S*/gi);
          if (system_includes) {
            args = args.concat(system_includes);
          }
          args = args.concat(["-working-directory=" + searchDir]);
          break;
        }
      }
    }
    return args;
  };

  getClangFlagsDotClangComplete = function(fileName) {
    var args, clangCompleteContents, searchDir, _ref1;
    _ref1 = getFileContents(fileName, ".clang_complete"), searchDir = _ref1[0], clangCompleteContents = _ref1[1];
    args = [];
    if (clangCompleteContents !== null && clangCompleteContents.length > 0) {
      args = clangCompleteContents.trim().split("\n");
      args = args.concat(["-working-directory=" + searchDir]);
    }
    return args;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLDhHQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNDLGVBQWdCLE9BQUEsQ0FBUSxJQUFSLEVBQWhCLFlBREQsQ0FBQTs7QUFBQSxFQUVBLE9BQW9CLE9BQUEsQ0FBUSxhQUFSLENBQXBCLEVBQUMsWUFBQSxJQUFELEVBQU8saUJBQUEsU0FGUCxDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsYUFBQSxFQUFlLFNBQUMsUUFBRCxHQUFBO0FBQ2IsVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsbUJBQUEsQ0FBb0IsUUFBcEIsQ0FBUixDQUFBO0FBQ0EsTUFBQSxJQUFHLEtBQUssQ0FBQyxNQUFOLEtBQWdCLENBQW5CO0FBQ0UsUUFBQSxLQUFBLEdBQVEsNkJBQUEsQ0FBOEIsUUFBOUIsQ0FBUixDQURGO09BREE7QUFHQSxhQUFPLEtBQVAsQ0FKYTtJQUFBLENBQWY7QUFBQSxJQUtBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQSxDQUxWO0dBTEYsQ0FBQTs7QUFBQSxFQVlBLGVBQUEsR0FBa0IsU0FBQyxTQUFELEVBQVksUUFBWixHQUFBO0FBQ2hCLFFBQUEscUVBQUE7QUFBQSxJQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsT0FBTCxDQUFhLFNBQWIsQ0FBWixDQUFBO0FBQUEsSUFDQSxJQUFBLEdBQU8sRUFEUCxDQUFBO0FBRUEsV0FBTSxTQUFTLENBQUMsTUFBaEIsR0FBQTtBQUNFLE1BQUEsY0FBQSxHQUFpQixJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsUUFBckIsQ0FBakIsQ0FBQTtBQUFBLE1BQ0EsVUFBQSxHQUFpQixJQUFBLElBQUEsQ0FBSyxjQUFMLENBRGpCLENB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
//# sourceURL=/Users/sarah/.atom/packages/autocomplete-clang/node_modules/clang-flags/lib/clang-flags.coffee