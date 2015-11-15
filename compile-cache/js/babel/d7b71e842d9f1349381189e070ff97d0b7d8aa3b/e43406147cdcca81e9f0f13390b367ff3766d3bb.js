"use babel";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = {
  config: {
    rubyExecutablePath: {
      type: "string",
      "default": "ruby"
    }
  },

  activate: function activate() {
    // Because all of the grammars this linter supports are
    //  built into the editor we do not need to throw errors when
    //  any one of the grammmars isn't installed. If a user has the grammar
    //  disabled that is a choice they have made.

    // Show the user an error if they do not have an appropriate linter base
    //  package installed from Atom Package Manager. This will not be an issues
    //  after a base linter package is integrated into Atom, in the comming
    //  months.
    // TODO: Remove when Linter Base is integrated into Atom.
    if (!atom.packages.getLoadedPackages("linter")) {
      atom.notifications.addError("Linter package not found.", {
        detail: "Please install the `linter` package in your Settings view."
      });
    }
  },

  provideLinter: function provideLinter() {
    var helpers = require("atom-linter");
    var path = require("path");
    var regex = /.+:(\d+):\s*(.+)/;
    return {
      grammarScopes: ["source.ruby", "source.ruby.rails", "source.ruby.rspec"],
      scope: "file",
      lintOnFly: true,
      lint: function lint(activeEditor) {
        var command = atom.config.get("linter-ruby.rubyExecutablePath");
        var file = activeEditor.getPath();
        var cwd = path.dirname(file);
        var args = ["-wc", file];
        return helpers.exec(command, args, { stream: "stderr", cwd: cwd }).then(function (output) {
          var toReturn = [];
          output.split(/\r?\n/).forEach(function (line) {
            var matches = regex.exec(line);
            if (matches === null) {
              return;
            }
            toReturn.push({
              range: helpers.rangeFromLineNumber(activeEditor, Number.parseInt(matches[1])),
              type: "Error",
              text: matches[2],
              filePath: file
            });
          });
          return toReturn;
        });
      }
    };
  }
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYXJhaC8uYXRvbS9wYWNrYWdlcy9saW50ZXItcnVieS9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7O3FCQUVHO0FBQ2IsUUFBTSxFQUFFO0FBQ04sc0JBQWtCLEVBQUU7QUFDbEIsVUFBSSxFQUFFLFFBQVE7QUFDZCxpQkFBUyxNQUFNO0tBQ2hCO0dBQ0Y7O0FBRUQsVUFBUSxFQUFFLG9CQUFNOzs7Ozs7Ozs7OztBQVdkLFFBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQzlDLFVBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUN6QiwyQkFBMkIsRUFDM0I7QUFDRSxjQUFNLEVBQUUsNERBQTREO09BQ3JFLENBQ0YsQ0FBQztLQUNIO0dBQ0Y7O0FBRUQsZUFBYSxFQUFFLHlCQUFNO0FBQ25CLFFBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUN2QyxRQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsUUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUM7QUFDakMsV0FBTztBQUNMLG1CQUFhLEVBQUUsQ0FBQyxhQUFhLEVBQUUsbUJBQW1CLEVBQUUsbUJBQW1CLENBQUM7QUFDeEUsV0FBSyxFQUFFLE1BQU07QUFDYixlQUFTLEVBQUUsSUFBSTtBQUNmLFVBQUksRUFBRSxjQUFDLFlBQVksRUFBSztBQUN0QixZQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0FBQ2xFLFlBQU0sSUFBSSxHQUFHLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNwQyxZQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9CLFlBQU0sSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzNCLGVBQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNLEVBQUk7QUFDOUUsY0FBTSxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLGdCQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUksRUFBRTtBQUM1QyxnQkFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqQyxnQkFBSSxPQUFPLEtBQUssSUFBSSxFQUFFO0FBQ3BCLHFCQUFPO2FBQ1I7QUFDRCxvQkFBUSxDQUFDLElBQUksQ0FBQztBQUNaLG1CQUFLLEVBQUUsT0FBTyxDQUFDLG1CQUFtQixDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdFLGtCQUFJLEVBQUUsT0FBTztBQUNiLGtCQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNoQixzQkFBUSxFQUFFLElBQUk7YUFDZixDQUFDLENBQUM7V0FDSixDQUFDLENBQUM7QUFDSCxpQkFBTyxRQUFRLENBQUM7U0FDakIsQ0FBQyxDQUFDO09BQ0o7S0FDRixDQUFDO0dBQ0g7Q0FDRiIsImZpbGUiOiIvVXNlcnMvc2FyYWgvLmF0b20vcGFja2FnZXMvbGludGVyLXJ1YnkvbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbmZpZzoge1xuICAgIHJ1YnlFeGVjdXRhYmxlUGF0aDoge1xuICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgIGRlZmF1bHQ6IFwicnVieVwiXG4gICAgfVxuICB9LFxuXG4gIGFjdGl2YXRlOiAoKSA9PiB7XG4gICAgLy8gQmVjYXVzZSBhbGwgb2YgdGhlIGdyYW1tYXJzIHRoaXMgbGludGVyIHN1cHBvcnRzIGFyZVxuICAgIC8vICBidWlsdCBpbnRvIHRoZSBlZGl0b3Igd2UgZG8gbm90IG5lZWQgdG8gdGhyb3cgZXJyb3JzIHdoZW5cbiAgICAvLyAgYW55IG9uZSBvZiB0aGUgZ3JhbW1tYXJzIGlzbid0IGluc3RhbGxlZC4gSWYgYSB1c2VyIGhhcyB0aGUgZ3JhbW1hclxuICAgIC8vICBkaXNhYmxlZCB0aGF0IGlzIGEgY2hvaWNlIHRoZXkgaGF2ZSBtYWRlLlxuXG4gICAgLy8gU2hvdyB0aGUgdXNlciBhbiBlcnJvciBpZiB0aGV5IGRvIG5vdCBoYXZlIGFuIGFwcHJvcHJpYXRlIGxpbnRlciBiYXNlXG4gICAgLy8gIHBhY2thZ2UgaW5zdGFsbGVkIGZyb20gQXRvbSBQYWNrYWdlIE1hbmFnZXIuIFRoaXMgd2lsbCBub3QgYmUgYW4gaXNzdWVzXG4gICAgLy8gIGFmdGVyIGEgYmFzZSBsaW50ZXIgcGFja2FnZSBpcyBpbnRlZ3JhdGVkIGludG8gQXRvbSwgaW4gdGhlIGNvbW1pbmdcbiAgICAvLyAgbW9udGhzLlxuICAgIC8vIFRPRE86IFJlbW92ZSB3aGVuIExpbnRlciBCYXNlIGlzIGludGVncmF0ZWQgaW50byBBdG9tLlxuICAgIGlmICghYXRvbS5wYWNrYWdlcy5nZXRMb2FkZWRQYWNrYWdlcyhcImxpbnRlclwiKSkge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFxuICAgICAgICBcIkxpbnRlciBwYWNrYWdlIG5vdCBmb3VuZC5cIixcbiAgICAgICAge1xuICAgICAgICAgIGRldGFpbDogXCJQbGVhc2UgaW5zdGFsbCB0aGUgYGxpbnRlcmAgcGFja2FnZSBpbiB5b3VyIFNldHRpbmdzIHZpZXcuXCJcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9XG4gIH0sXG5cbiAgcHJvdmlkZUxpbnRlcjogKCkgPT4ge1xuICAgIGNvbnN0IGhlbHBlcnMgPSByZXF1aXJlKFwiYXRvbS1saW50ZXJcIik7XG4gICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpO1xuICAgIGNvbnN0IHJlZ2V4ID0gLy4rOihcXGQrKTpcXHMqKC4rKS87XG4gICAgcmV0dXJuIHtcbiAgICAgIGdyYW1tYXJTY29wZXM6IFtcInNvdXJjZS5ydWJ5XCIsIFwic291cmNlLnJ1YnkucmFpbHNcIiwgXCJzb3VyY2UucnVieS5yc3BlY1wiXSxcbiAgICAgIHNjb3BlOiBcImZpbGVcIixcbiAgICAgIGxpbnRPbkZseTogdHJ1ZSxcbiAgICAgIGxpbnQ6IChhY3RpdmVFZGl0b3IpID0+IHtcbiAgICAgICAgY29uc3QgY29tbWFuZCA9IGF0b20uY29uZmlnLmdldChcImxpbnRlci1ydWJ5LnJ1YnlFeGVjdXRhYmxlUGF0aFwiKTtcbiAgICAgICAgY29uc3QgZmlsZSA9IGFjdGl2ZUVkaXRvci5nZXRQYXRoKCk7XG4gICAgICAgIGNvbnN0IGN3ZCA9IHBhdGguZGlybmFtZShmaWxlKTtcbiAgICAgICAgY29uc3QgYXJncyA9IFtcIi13Y1wiLCBmaWxlXTtcbiAgICAgICAgcmV0dXJuIGhlbHBlcnMuZXhlYyhjb21tYW5kLCBhcmdzLCB7c3RyZWFtOiBcInN0ZGVyclwiLCBjd2Q6IGN3ZH0pLnRoZW4ob3V0cHV0ID0+IHtcbiAgICAgICAgICBjb25zdCB0b1JldHVybiA9IFtdO1xuICAgICAgICAgIG91dHB1dC5zcGxpdCgvXFxyP1xcbi8pLmZvckVhY2goZnVuY3Rpb24gKGxpbmUpIHtcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoZXMgPSByZWdleC5leGVjKGxpbmUpO1xuICAgICAgICAgICAgaWYgKG1hdGNoZXMgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdG9SZXR1cm4ucHVzaCh7XG4gICAgICAgICAgICAgIHJhbmdlOiBoZWxwZXJzLnJhbmdlRnJvbUxpbmVOdW1iZXIoYWN0aXZlRWRpdG9yLCBOdW1iZXIucGFyc2VJbnQobWF0Y2hlc1sxXSkpLFxuICAgICAgICAgICAgICB0eXBlOiBcIkVycm9yXCIsXG4gICAgICAgICAgICAgIHRleHQ6IG1hdGNoZXNbMl0sXG4gICAgICAgICAgICAgIGZpbGVQYXRoOiBmaWxlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gdG9SZXR1cm47XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn07XG4iXX0=
//# sourceURL=/Users/sarah/.atom/packages/linter-ruby/lib/main.js
