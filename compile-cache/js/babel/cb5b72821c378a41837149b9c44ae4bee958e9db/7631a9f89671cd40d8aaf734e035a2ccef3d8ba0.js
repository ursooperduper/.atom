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
    var regex = "(?<file>.+):(?<line>\\d+):\\s*(?<type>[\\w\\s\\-]+)[:,]?\\s*(?<message>.+)";
    return {
      grammarScopes: ["source.ruby", "source.ruby.rails", "source.ruby.rspec"],
      scope: "file",
      lintOnFly: true,
      lint: function lint(activeEditor) {
        var command = atom.config.get("linter-ruby.rubyExecutablePath");
        var file = activeEditor.getPath();
        var args = ["-wc", file];
        return helpers.exec(command, args, { stream: "stderr", cwd: file }).then(function (output) {
          return helpers.parse(output, regex);
        });
      }
    };
  }
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYXJhaC8uYXRvbS9wYWNrYWdlcy9saW50ZXItcnVieS9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7O3FCQUVHO0FBQ2IsUUFBTSxFQUFFO0FBQ04sc0JBQWtCLEVBQUU7QUFDbEIsVUFBSSxFQUFFLFFBQVE7QUFDZCxpQkFBUyxNQUFNO0tBQ2hCO0dBQ0Y7O0FBRUQsVUFBUSxFQUFFLG9CQUFNOzs7Ozs7Ozs7OztBQVdkLFFBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQzdDLFVBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUN6QiwyQkFBMkIsRUFDM0I7QUFDRSxjQUFNLEVBQUUsNERBQTREO09BQ3JFLENBQ0YsQ0FBQztLQUNIO0dBQ0Y7O0FBRUQsZUFBYSxFQUFFLHlCQUFNO0FBQ25CLFFBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUN2QyxRQUFNLEtBQUssR0FBRyw0RUFBNEUsQ0FBQztBQUMzRixXQUFPO0FBQ0wsbUJBQWEsRUFBRSxDQUFDLGFBQWEsRUFBRSxtQkFBbUIsRUFBRSxtQkFBbUIsQ0FBQztBQUN4RSxXQUFLLEVBQUUsTUFBTTtBQUNiLGVBQVMsRUFBRSxJQUFJO0FBQ2YsVUFBSSxFQUFFLGNBQUMsWUFBWSxFQUFLO0FBQ3RCLFlBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7QUFDbEUsWUFBTSxJQUFJLEdBQUcsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ25DLFlBQU0sSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzNCLGVBQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNO2lCQUMzRSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUM7U0FBQSxDQUM3QixDQUFDO09BQ0g7S0FDRixDQUFDO0dBQ0g7Q0FDRiIsImZpbGUiOiIvVXNlcnMvc2FyYWgvLmF0b20vcGFja2FnZXMvbGludGVyLXJ1YnkvbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbmZpZzoge1xuICAgIHJ1YnlFeGVjdXRhYmxlUGF0aDoge1xuICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgIGRlZmF1bHQ6IFwicnVieVwiXG4gICAgfVxuICB9LFxuXG4gIGFjdGl2YXRlOiAoKSA9PiB7XG4gICAgLy8gQmVjYXVzZSBhbGwgb2YgdGhlIGdyYW1tYXJzIHRoaXMgbGludGVyIHN1cHBvcnRzIGFyZVxuICAgIC8vICBidWlsdCBpbnRvIHRoZSBlZGl0b3Igd2UgZG8gbm90IG5lZWQgdG8gdGhyb3cgZXJyb3JzIHdoZW5cbiAgICAvLyAgYW55IG9uZSBvZiB0aGUgZ3JhbW1tYXJzIGlzbid0IGluc3RhbGxlZC4gSWYgYSB1c2VyIGhhcyB0aGUgZ3JhbW1hclxuICAgIC8vICBkaXNhYmxlZCB0aGF0IGlzIGEgY2hvaWNlIHRoZXkgaGF2ZSBtYWRlLlxuXG4gICAgLy8gU2hvdyB0aGUgdXNlciBhbiBlcnJvciBpZiB0aGV5IGRvIG5vdCBoYXZlIGFuIGFwcHJvcHJpYXRlIGxpbnRlciBiYXNlXG4gICAgLy8gIHBhY2thZ2UgaW5zdGFsbGVkIGZyb20gQXRvbSBQYWNrYWdlIE1hbmFnZXIuIFRoaXMgd2lsbCBub3QgYmUgYW4gaXNzdWVzXG4gICAgLy8gIGFmdGVyIGEgYmFzZSBsaW50ZXIgcGFja2FnZSBpcyBpbnRlZ3JhdGVkIGludG8gQXRvbSwgaW4gdGhlIGNvbW1pbmdcbiAgICAvLyAgbW9udGhzLlxuICAgIC8vIFRPRE86IFJlbW92ZSB3aGVuIExpbnRlciBCYXNlIGlzIGludGVncmF0ZWQgaW50byBBdG9tLlxuICAgIGlmKCFhdG9tLnBhY2thZ2VzLmdldExvYWRlZFBhY2thZ2VzKFwibGludGVyXCIpKSB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoXG4gICAgICAgIFwiTGludGVyIHBhY2thZ2Ugbm90IGZvdW5kLlwiLFxuICAgICAgICB7XG4gICAgICAgICAgZGV0YWlsOiBcIlBsZWFzZSBpbnN0YWxsIHRoZSBgbGludGVyYCBwYWNrYWdlIGluIHlvdXIgU2V0dGluZ3Mgdmlldy5cIlxuICAgICAgICB9XG4gICAgICApO1xuICAgIH1cbiAgfSxcblxuICBwcm92aWRlTGludGVyOiAoKSA9PiB7XG4gICAgY29uc3QgaGVscGVycyA9IHJlcXVpcmUoXCJhdG9tLWxpbnRlclwiKTtcbiAgICBjb25zdCByZWdleCA9IFwiKD88ZmlsZT4uKyk6KD88bGluZT5cXFxcZCspOlxcXFxzKig/PHR5cGU+W1xcXFx3XFxcXHNcXFxcLV0rKVs6LF0/XFxcXHMqKD88bWVzc2FnZT4uKylcIjtcbiAgICByZXR1cm4ge1xuICAgICAgZ3JhbW1hclNjb3BlczogW1wic291cmNlLnJ1YnlcIiwgXCJzb3VyY2UucnVieS5yYWlsc1wiLCBcInNvdXJjZS5ydWJ5LnJzcGVjXCJdLFxuICAgICAgc2NvcGU6IFwiZmlsZVwiLFxuICAgICAgbGludE9uRmx5OiB0cnVlLFxuICAgICAgbGludDogKGFjdGl2ZUVkaXRvcikgPT4ge1xuICAgICAgICBjb25zdCBjb21tYW5kID0gYXRvbS5jb25maWcuZ2V0KFwibGludGVyLXJ1YnkucnVieUV4ZWN1dGFibGVQYXRoXCIpO1xuICAgICAgICBjb25zdCBmaWxlID0gYWN0aXZlRWRpdG9yLmdldFBhdGgoKVxuICAgICAgICBjb25zdCBhcmdzID0gW1wiLXdjXCIsIGZpbGVdO1xuICAgICAgICByZXR1cm4gaGVscGVycy5leGVjKGNvbW1hbmQsIGFyZ3MsIHtzdHJlYW06IFwic3RkZXJyXCIsIGN3ZDogZmlsZX0pLnRoZW4ob3V0cHV0ID0+XG4gICAgICAgICAgaGVscGVycy5wYXJzZShvdXRwdXQsIHJlZ2V4KVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn07XG4iXX0=