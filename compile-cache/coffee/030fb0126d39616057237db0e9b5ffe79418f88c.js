(function() {
  var Directory, File, getClangFlagsCompDB, getClangFlagsDotClangComplete, getFileContents, path, readFileSync, _ref;

  path = require('path');

  readFileSync = require('fs').readFileSync;

  _ref = require('pathwatcher'), File = _ref.File, Directory = _ref.Directory;

  module.exports = {
    getClangFlags: function(fileName) {
      var flags;
      flags = getClangFlagsCompDB(fileName);
      if (flags === 0) {
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
        contents = "";
        try {
          contents = readFileSync(searchFilePath, 'utf8');
          return contents;
        } catch (_error) {
          error = _error;
          console.log("clang-flags for " + fileName + " couldn't read file " + searchFilePath);
          console.log(error);
        }
        return null;
      }
      thisDir = new Directory(searchDir);
      if (thisDir.isRoot()) {
        break;
      }
      searchDir = thisDir.getParent().getPath();
    }
    return null;
  };

  getClangFlagsCompDB = function(fileName) {
    var args, compDB, compDBContents, config, _i, _len;
    compDBContents = getFileContents(fileName, "compile_commands.json");
    args = 0;
    if (compDBContents !== null && compDBContents.length > 0) {
      compDB = JSON.parse(compDBContents);
      for (_i = 0, _len = compDB.length; _i < _len; _i++) {
        config = compDB[_i];
        if (fileName === path.join(config['directory'], config['file'])) {
          args = args.concat(["-working-directory=" + config['directory']]);
        }
      }
    }
    return args;
  };

  getClangFlagsDotClangComplete = function(fileName) {
    var args, clangCompleteContents;
    clangCompleteContents = getFileContents(fileName, ".clang_complete");
    args = [];
    if (clangCompleteContents !== null && clangCompleteContents.length > 0) {
      args = clangCompleteContents.trim().split("\n");
    }
    return args;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLDhHQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNDLGVBQWdCLE9BQUEsQ0FBUSxJQUFSLEVBQWhCLFlBREQsQ0FBQTs7QUFBQSxFQUVBLE9BQW9CLE9BQUEsQ0FBUSxhQUFSLENBQXBCLEVBQUMsWUFBQSxJQUFELEVBQU8saUJBQUEsU0FGUCxDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsYUFBQSxFQUFlLFNBQUMsUUFBRCxHQUFBO0FBQ2IsVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsbUJBQUEsQ0FBb0IsUUFBcEIsQ0FBUixDQUFBO0FBQ0EsTUFBQSxJQUFHLEtBQUEsS0FBUyxDQUFaO0FBQ0UsUUFBQSxLQUFBLEdBQVEsNkJBQUEsQ0FBOEIsUUFBOUIsQ0FBUixDQURGO09BREE7QUFHQSxhQUFPLEtBQVAsQ0FKYTtJQUFBLENBQWY7QUFBQSxJQUtBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQSxDQUxWO0dBTEYsQ0FBQTs7QUFBQSxFQVlBLGVBQUEsR0FBa0IsU0FBQyxTQUFELEVBQVksUUFBWixHQUFBO0FBQ2hCLFFBQUEscUVBQUE7QUFBQSxJQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsT0FBTCxDQUFhLFNBQWIsQ0FBWixDQUFBO0FBQUEsSUFDQSxJQUFBLEdBQU8sRUFEUCxDQUFBO0FBRUEsV0FBTSxTQUFTLENBQUMsTUFBaEIsR0FBQTtBQUNFLE1BQUEsY0FBQSxHQUFpQixJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsUUFBckIsQ0FBakIsQ0FBQTtBQUFBLE1BQ0EsVUFBQSxHQUFpQixJQUFBLElBQUEsQ0FBSyxjQUFMLENBRGpCLENBQUE7QUFFQSxNQUFBLElBQUcsVUFBVSxDQUFDLE1BQVgsQ0FBQSxDQUFIO0FBQ0UsUUFBQSxRQUFBLEdBQVcsRUFBWCxDQUFBO0FBQ0E7QUFDRSxVQUFBLFFBQUEsR0FBVyxZQUFBLENBQWEsY0FBYixFQUE2QixNQUE3QixDQUFYLENBQUE7QUFDQSxpQkFBTyxRQUFQLENBRkY7U0FBQSxjQUFBO0FBSUUsVUFESSxjQUNKLENBQUE7QUFBQSxVQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksa0JBQUEsR0FBcUIsUUFBckIsR0FBZ0Msc0JBQWhDLEdBQXlELGNBQXJFLENBQUEsQ0FBQTtBQUFBLFVBQ0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxLQUFaLENBREEsQ0FKRjtTQURBO0FBT0EsZUFBTyxJQUFQLENBUkY7T0FGQTtBQUFBLE1BV0EsT0FBQSxHQUFjLElBQUEsU0FBQSxDQUFVLFNBQVYsQ0FYZCxDQUFBO0FBWUEsTUFBQSxJQUFHLE9BQU8sQ0FBQyxNQUFSLENBQUEsQ0FBSDtBQUNFLGNBREY7T0FaQTtBQUFBLE1BY0EsU0FBQSxHQUFZLE9BQU8sQ0FBQyxTQUFSLENBQUEsQ0FBbUIsQ0FBQyxPQUFwQixDQUFBLENBZFosQ0FERjtJQUFBLENBRkE7QUFrQkEsV0FBTyxJQUFQLENBbkJnQjtFQUFBLENBWmxCLENBQUE7O0FBQUEsRUFpQ0EsbUJBQUEsR0FBc0IsU0FBQyxRQUFELEdBQUE7QUFDcEIsUUFBQSw4Q0FBQTtBQUFBLElBQUEsY0FBQSxHQUFpQixlQUFBLENBQWdCLFFBQWhCLEVBQTBCLHVCQUExQixDQUFqQixDQUFBO0FBQUEsSUFDQSxJQUFBLEdBQU8sQ0FEUCxDQUFBO0FBRUEsSUFBQSxJQUFHLGNBQUEsS0FBa0IsSUFBbEIsSUFBMEIsY0FBYyxDQUFDLE1BQWYsR0FBd0IsQ0FBckQ7QUFDRSxNQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsS0FBTCxDQUFXLGNBQVgsQ0FBVCxDQUFBO0FBQ0EsV0FBQSw2Q0FBQTs0QkFBQTtBQUNFLFFBQUEsSUFBRyxRQUFBLEtBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxNQUFPLENBQUEsV0FBQSxDQUFqQixFQUErQixNQUFPLENBQUEsTUFBQSxDQUF0QyxDQUFmO0FBRUUsVUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLE1BQUwsQ0FBWSxDQUFFLHFCQUFBLEdBQW9CLE1BQU8sQ0FBQSxXQUFBLENBQTdCLENBQVosQ0FBUCxDQUZGO1NBREY7QUFBQSxPQUZGO0tBRkE7QUFRQSxXQUFPLElBQVAsQ0FUb0I7RUFBQSxDQWpDdEIsQ0FBQTs7QUFBQSxFQTRDQSw2QkFBQSxHQUFnQyxTQUFDLFFBQUQsR0FBQTtBQUM5QixRQUFBLDJCQUFBO0FBQUEsSUFBQSxxQkFBQSxHQUF3QixlQUFBLENBQWdCLFFBQWhCLEVBQTBCLGlCQUExQixDQUF4QixDQUFBO0FBQUEsSUFDQSxJQUFBLEdBQU8sRUFEUCxDQUFBO0FBRUEsSUFBQSxJQUFHLHFCQUFBLEtBQXlCLElBQXpCLElBQWlDLHFCQUFxQixDQUFDLE1BQXRCLEdBQStCLENBQW5FO0FBQ0UsTUFBQSxJQUFBLEdBQU8scUJBQXFCLENBQUMsSUFBdEIsQ0FBQSxDQUE0QixDQUFDLEtBQTdCLENBQW1DLElBQW5DLENBQVAsQ0FERjtLQUZBO0FBSUEsV0FBTyxJQUFQLENBTDhCO0VBQUEsQ0E1Q2hDLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/sarah/.atom/packages/autocomplete-clang/node_modules/clang-flags/lib/clang-flags.coffee