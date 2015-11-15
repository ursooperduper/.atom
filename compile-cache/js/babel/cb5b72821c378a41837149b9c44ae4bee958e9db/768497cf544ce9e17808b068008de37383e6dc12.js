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
    var regex = "(?<file>.+):(?<line>\\d+):\\s*(?<type>[\\w\\s\\-]+)[:,]?\\s*(?<message>.+)";
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
          return helpers.parse(output, regex);
        });
      }
    };
  }
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYXJhaC8uYXRvbS9wYWNrYWdlcy9saW50ZXItcnVieS9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7O3FCQUVHO0FBQ2IsUUFBTSxFQUFFO0FBQ04sc0JBQWtCLEVBQUU7QUFDbEIsVUFBSSxFQUFFLFFBQVE7QUFDZCxpQkFBUyxNQUFNO0tBQ2hCO0dBQ0Y7O0FBRUQsVUFBUSxFQUFFLG9CQUFNOzs7Ozs7Ozs7OztBQVdkLFFBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQzdDLFVBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUN6QiwyQkFBMkIsRUFDM0I7QUFDRSxjQUFNLEVBQUUsNERBQTREO09BQ3JFLENBQ0YsQ0FBQztLQUNIO0dBQ0Y7O0FBRUQsZUFBYSxFQUFFLHlCQUFNO0FBQ25CLFFBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUN2QyxRQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsUUFBTSxLQUFLLEdBQUcsNEVBQTRFLENBQUM7QUFDM0YsV0FBTztBQUNMLG1CQUFhLEVBQUUsQ0FBQyxhQUFhLEVBQUUsbUJBQW1CLEVBQUUsbUJBQW1CLENBQUM7QUFDeEUsV0FBSyxFQUFFLE1BQU07QUFDYixlQUFTLEVBQUUsSUFBSTtBQUNmLFVBQUksRUFBRSxjQUFDLFlBQVksRUFBSztBQUN0QixZQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0FBQ2xFLFlBQU0sSUFBSSxHQUFHLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNwQyxZQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9CLFlBQU0sSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzNCLGVBQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNO2lCQUMxRSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUM7U0FBQSxDQUM3QixDQUFDO09BQ0g7S0FDRixDQUFDO0dBQ0g7Q0FDRiIsImZpbGUiOiIvVXNlcnMvc2FyYWgvLmF0b20vcGFja2FnZXMvbGludGVyLXJ1YnkvbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbmZpZzoge1xuICAgIHJ1YnlFeGVjdXRhYmxlUGF0aDoge1xuICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgIGRlZmF1bHQ6IFwicnVieVwiXG4gICAgfVxuICB9LFxuXG4gIGFjdGl2YXRlOiAoKSA9PiB7XG4gICAgLy8gQmVjYXVzZSBhbGwgb2YgdGhlIGdyYW1tYXJzIHRoaXMgbGludGVyIHN1cHBvcnRzIGFyZVxuICAgIC8vICBidWlsdCBpbnRvIHRoZSBlZGl0b3Igd2UgZG8gbm90IG5lZWQgdG8gdGhyb3cgZXJyb3JzIHdoZW5cbiAgICAvLyAgYW55IG9uZSBvZiB0aGUgZ3JhbW1tYXJzIGlzbid0IGluc3RhbGxlZC4gSWYgYSB1c2VyIGhhcyB0aGUgZ3JhbW1hclxuICAgIC8vICBkaXNhYmxlZCB0aGF0IGlzIGEgY2hvaWNlIHRoZXkgaGF2ZSBtYWRlLlxuXG4gICAgLy8gU2hvdyB0aGUgdXNlciBhbiBlcnJvciBpZiB0aGV5IGRvIG5vdCBoYXZlIGFuIGFwcHJvcHJpYXRlIGxpbnRlciBiYXNlXG4gICAgLy8gIHBhY2thZ2UgaW5zdGFsbGVkIGZyb20gQXRvbSBQYWNrYWdlIE1hbmFnZXIuIFRoaXMgd2lsbCBub3QgYmUgYW4gaXNzdWVzXG4gICAgLy8gIGFmdGVyIGEgYmFzZSBsaW50ZXIgcGFja2FnZSBpcyBpbnRlZ3JhdGVkIGludG8gQXRvbSwgaW4gdGhlIGNvbW1pbmdcbiAgICAvLyAgbW9udGhzLlxuICAgIC8vIFRPRE86IFJlbW92ZSB3aGVuIExpbnRlciBCYXNlIGlzIGludGVncmF0ZWQgaW50byBBdG9tLlxuICAgIGlmKCFhdG9tLnBhY2thZ2VzLmdldExvYWRlZFBhY2thZ2VzKFwibGludGVyXCIpKSB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoXG4gICAgICAgIFwiTGludGVyIHBhY2thZ2Ugbm90IGZvdW5kLlwiLFxuICAgICAgICB7XG4gICAgICAgICAgZGV0YWlsOiBcIlBsZWFzZSBpbnN0YWxsIHRoZSBgbGludGVyYCBwYWNrYWdlIGluIHlvdXIgU2V0dGluZ3Mgdmlldy5cIlxuICAgICAgICB9XG4gICAgICApO1xuICAgIH1cbiAgfSxcblxuICBwcm92aWRlTGludGVyOiAoKSA9PiB7XG4gICAgY29uc3QgaGVscGVycyA9IHJlcXVpcmUoXCJhdG9tLWxpbnRlclwiKTtcbiAgICBjb25zdCBwYXRoID0gcmVxdWlyZShcInBhdGhcIik7XG4gICAgY29uc3QgcmVnZXggPSBcIig/PGZpbGU+LispOig/PGxpbmU+XFxcXGQrKTpcXFxccyooPzx0eXBlPltcXFxcd1xcXFxzXFxcXC1dKylbOixdP1xcXFxzKig/PG1lc3NhZ2U+LispXCI7XG4gICAgcmV0dXJuIHtcbiAgICAgIGdyYW1tYXJTY29wZXM6IFtcInNvdXJjZS5ydWJ5XCIsIFwic291cmNlLnJ1YnkucmFpbHNcIiwgXCJzb3VyY2UucnVieS5yc3BlY1wiXSxcbiAgICAgIHNjb3BlOiBcImZpbGVcIixcbiAgICAgIGxpbnRPbkZseTogdHJ1ZSxcbiAgICAgIGxpbnQ6IChhY3RpdmVFZGl0b3IpID0+IHtcbiAgICAgICAgY29uc3QgY29tbWFuZCA9IGF0b20uY29uZmlnLmdldChcImxpbnRlci1ydWJ5LnJ1YnlFeGVjdXRhYmxlUGF0aFwiKTtcbiAgICAgICAgY29uc3QgZmlsZSA9IGFjdGl2ZUVkaXRvci5nZXRQYXRoKCk7XG4gICAgICAgIGNvbnN0IGN3ZCA9IHBhdGguZGlybmFtZShmaWxlKTtcbiAgICAgICAgY29uc3QgYXJncyA9IFtcIi13Y1wiLCBmaWxlXTtcbiAgICAgICAgcmV0dXJuIGhlbHBlcnMuZXhlYyhjb21tYW5kLCBhcmdzLCB7c3RyZWFtOiBcInN0ZGVyclwiLCBjd2Q6IGN3ZH0pLnRoZW4ob3V0cHV0ID0+XG4gICAgICAgICAgaGVscGVycy5wYXJzZShvdXRwdXQsIHJlZ2V4KVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn07XG4iXX0=