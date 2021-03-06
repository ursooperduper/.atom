"use babel";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = {
  config: {
    rubyExecutablePath: {
      type: "string",
      "default": "ruby"
    },
    ignoredExtensions: {
      type: 'array',
      "default": ['erb', 'md'],
      items: {
        type: 'string'
      }
    }
  },

  activate: function activate() {
    // We are now using steelbrain's package dependency package to install our
    //  dependencies.
    require("atom-package-deps").install("linter-ruby");
  },

  provideLinter: function provideLinter() {
    var helpers = require("atom-linter");
    var Path = require("path");
    var regex = /.+:(\d+):\s*(.+?)[,:]\s(.+)/;
    return {
      name: "Ruby",
      grammarScopes: ["source.ruby", "source.ruby.rails", "source.ruby.rspec"],
      scope: "file",
      lintOnFly: true,
      lint: function lint(activeEditor) {
        var command = atom.config.get("linter-ruby.rubyExecutablePath");
        var ignored = atom.config.get("linter-ruby.ignoredExtensions");
        var filePath = activeEditor.getPath();
        var fileExtension = Path.extname(filePath).substr(1);

        for (var extension of ignored) {
          if (fileExtension === extension) return [];
        }

        return helpers.exec(command, ['-wc'], { stdin: activeEditor.getText(), stream: 'stderr' }).then(function (output) {
          var toReturn = [];
          output.split(/\r?\n/).forEach(function (line) {
            var matches = regex.exec(line);
            if (matches === null) {
              return;
            }
            toReturn.push({
              range: helpers.rangeFromLineNumber(activeEditor, Number.parseInt(matches[1] - 1)),
              type: matches[2],
              text: matches[3],
              filePath: filePath
            });
          });
          return toReturn;
        });
      }
    };
  }
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYXJhaC8uYXRvbS9wYWNrYWdlcy9saW50ZXItcnVieS9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7O3FCQUVHO0FBQ2IsUUFBTSxFQUFFO0FBQ04sc0JBQWtCLEVBQUU7QUFDbEIsVUFBSSxFQUFFLFFBQVE7QUFDZCxpQkFBUyxNQUFNO0tBQ2hCO0FBQ0QscUJBQWlCLEVBQUU7QUFDakIsVUFBSSxFQUFFLE9BQU87QUFDYixpQkFBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUM7QUFDdEIsV0FBSyxFQUFFO0FBQ0wsWUFBSSxFQUFFLFFBQVE7T0FDZjtLQUNGO0dBQ0Y7O0FBRUQsVUFBUSxFQUFFLG9CQUFNOzs7QUFHZCxXQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7R0FDckQ7O0FBRUQsZUFBYSxFQUFFLHlCQUFNO0FBQ25CLFFBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUN2QyxRQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsUUFBTSxLQUFLLEdBQUcsNkJBQTZCLENBQUM7QUFDNUMsV0FBTztBQUNMLFVBQUksRUFBRSxNQUFNO0FBQ1osbUJBQWEsRUFBRSxDQUFDLGFBQWEsRUFBRSxtQkFBbUIsRUFBRSxtQkFBbUIsQ0FBQztBQUN4RSxXQUFLLEVBQUUsTUFBTTtBQUNiLGVBQVMsRUFBRSxJQUFJO0FBQ2YsVUFBSSxFQUFFLGNBQUMsWUFBWSxFQUFLO0FBQ3RCLFlBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7QUFDbEUsWUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUMsQ0FBQztBQUNqRSxZQUFNLFFBQVEsR0FBRyxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDeEMsWUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRXZELGFBQUssSUFBSSxTQUFTLElBQUksT0FBTyxFQUFFO0FBQzdCLGNBQUksYUFBYSxLQUFLLFNBQVMsRUFBRSxPQUFPLEVBQUUsQ0FBQztTQUM1Qzs7QUFFRCxlQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLE9BQU8sRUFBRSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLE1BQU0sRUFBSTtBQUN0RyxjQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDbEIsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxFQUFFO0FBQzVDLGdCQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pDLGdCQUFJLE9BQU8sS0FBSyxJQUFJLEVBQUU7QUFDcEIscUJBQU87YUFDUjtBQUNELG9CQUFRLENBQUMsSUFBSSxDQUFDO0FBQ1osbUJBQUssRUFBRSxPQUFPLENBQUMsbUJBQW1CLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBRSxDQUFDO0FBQ25GLGtCQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNoQixrQkFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDaEIsc0JBQVEsRUFBRSxRQUFRO2FBQ25CLENBQUMsQ0FBQztXQUNKLENBQUMsQ0FBQztBQUNILGlCQUFPLFFBQVEsQ0FBQztTQUNqQixDQUFDLENBQUM7T0FDSjtLQUNGLENBQUM7R0FDSDtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy9zYXJhaC8uYXRvbS9wYWNrYWdlcy9saW50ZXItcnVieS9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgY29uZmlnOiB7XG4gICAgcnVieUV4ZWN1dGFibGVQYXRoOiB7XG4gICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgZGVmYXVsdDogXCJydWJ5XCJcbiAgICB9LFxuICAgIGlnbm9yZWRFeHRlbnNpb25zOiB7XG4gICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgZGVmYXVsdDogWydlcmInLCAnbWQnXSxcbiAgICAgIGl0ZW1zOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIGFjdGl2YXRlOiAoKSA9PiB7XG4gICAgLy8gV2UgYXJlIG5vdyB1c2luZyBzdGVlbGJyYWluJ3MgcGFja2FnZSBkZXBlbmRlbmN5IHBhY2thZ2UgdG8gaW5zdGFsbCBvdXJcbiAgICAvLyAgZGVwZW5kZW5jaWVzLlxuICAgIHJlcXVpcmUoXCJhdG9tLXBhY2thZ2UtZGVwc1wiKS5pbnN0YWxsKFwibGludGVyLXJ1YnlcIik7XG4gIH0sXG5cbiAgcHJvdmlkZUxpbnRlcjogKCkgPT4ge1xuICAgIGNvbnN0IGhlbHBlcnMgPSByZXF1aXJlKFwiYXRvbS1saW50ZXJcIik7XG4gICAgY29uc3QgUGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpO1xuICAgIGNvbnN0IHJlZ2V4ID0gLy4rOihcXGQrKTpcXHMqKC4rPylbLDpdXFxzKC4rKS87XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IFwiUnVieVwiLFxuICAgICAgZ3JhbW1hclNjb3BlczogW1wic291cmNlLnJ1YnlcIiwgXCJzb3VyY2UucnVieS5yYWlsc1wiLCBcInNvdXJjZS5ydWJ5LnJzcGVjXCJdLFxuICAgICAgc2NvcGU6IFwiZmlsZVwiLFxuICAgICAgbGludE9uRmx5OiB0cnVlLFxuICAgICAgbGludDogKGFjdGl2ZUVkaXRvcikgPT4ge1xuICAgICAgICBjb25zdCBjb21tYW5kID0gYXRvbS5jb25maWcuZ2V0KFwibGludGVyLXJ1YnkucnVieUV4ZWN1dGFibGVQYXRoXCIpO1xuICAgICAgICBjb25zdCBpZ25vcmVkID0gYXRvbS5jb25maWcuZ2V0KFwibGludGVyLXJ1YnkuaWdub3JlZEV4dGVuc2lvbnNcIik7XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gYWN0aXZlRWRpdG9yLmdldFBhdGgoKTtcbiAgICAgICAgY29uc3QgZmlsZUV4dGVuc2lvbiA9IFBhdGguZXh0bmFtZShmaWxlUGF0aCkuc3Vic3RyKDEpO1xuXG4gICAgICAgIGZvciAobGV0IGV4dGVuc2lvbiBvZiBpZ25vcmVkKSB7XG4gICAgICAgICAgaWYgKGZpbGVFeHRlbnNpb24gPT09IGV4dGVuc2lvbikgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGhlbHBlcnMuZXhlYyhjb21tYW5kLCBbJy13YyddLCB7c3RkaW46IGFjdGl2ZUVkaXRvci5nZXRUZXh0KCksIHN0cmVhbTogJ3N0ZGVycid9KS50aGVuKG91dHB1dCA9PiB7XG4gICAgICAgICAgdmFyIHRvUmV0dXJuID0gW107XG4gICAgICAgICAgb3V0cHV0LnNwbGl0KC9cXHI/XFxuLykuZm9yRWFjaChmdW5jdGlvbiAobGluZSkge1xuICAgICAgICAgICAgY29uc3QgbWF0Y2hlcyA9IHJlZ2V4LmV4ZWMobGluZSk7XG4gICAgICAgICAgICBpZiAobWF0Y2hlcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0b1JldHVybi5wdXNoKHtcbiAgICAgICAgICAgICAgcmFuZ2U6IGhlbHBlcnMucmFuZ2VGcm9tTGluZU51bWJlcihhY3RpdmVFZGl0b3IsIE51bWJlci5wYXJzZUludCgobWF0Y2hlc1sxXSAtIDEpKSksXG4gICAgICAgICAgICAgIHR5cGU6IG1hdGNoZXNbMl0sXG4gICAgICAgICAgICAgIHRleHQ6IG1hdGNoZXNbM10sXG4gICAgICAgICAgICAgIGZpbGVQYXRoOiBmaWxlUGF0aFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59O1xuIl19
//# sourceURL=/Users/sarah/.atom/packages/linter-ruby/lib/main.js
