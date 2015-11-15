(function() {
  var BufferedProcess, CompositeDisposable, Processing, fs, path, _ref;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, BufferedProcess = _ref.BufferedProcess;

  fs = require('fs');

  path = require('path');

  module.exports = Processing = {
    config: {
      'processing-executable': {
        type: "string",
        "default": "processing-java"
      }
    },
    activate: function(state) {
      return atom.commands.add('atom-workspace', {
        'processing:run': (function(_this) {
          return function() {
            return _this.runSketch();
          };
        })(this)
      });
    },
    saveSketch: function() {
      var dir, editor, file, num;
      editor = atom.workspace.getActivePaneItem();
      file = editor != null ? editor.buffer.file : void 0;
      if (file != null ? file.existsSync() : void 0) {
        return editor.save();
      } else {
        num = Math.floor(Math.random() * 10000);
        dir = fs.mkdirSync("/tmp/sketch_" + num + "/");
        return editor.saveAs("/tmp/sketch_" + num + "/sketch_" + num + ".pde");
      }
    },
    buildSketch: function() {
      var args, build_dir, command, editor, exit, file, folder, options, process, stderr, stdout;
      console.log("build and run time");
      editor = atom.workspace.getActivePaneItem();
      file = editor != null ? editor.buffer.file : void 0;
      folder = file.getParent().getPath();
      build_dir = path.join(folder, "build");
      command = path.normalize(atom.config.get("processing.processing-executable"));
      args = ["--sketch=" + folder, "--output=" + build_dir, "--run", "--force"];
      options = {};
      console.log("Running command " + command + " " + (args.join(" ")));
      stdout = function(output) {
        return console.log(output);
      };
      stderr = function(output) {
        return console.error(output);
      };
      exit = function(code) {
        return console.log("Error code: " + code);
      };
      return process = new BufferedProcess({
        command: command,
        args: args,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
    },
    runSketch: function() {
      this.saveSketch();
      return this.buildSketch();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL3Byb2Nlc3NpbmcvbGliL3Byb2Nlc3NpbmcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdFQUFBOztBQUFBLEVBQUEsT0FBeUMsT0FBQSxDQUFRLE1BQVIsQ0FBekMsRUFBQywyQkFBQSxtQkFBRCxFQUFzQix1QkFBQSxlQUF0QixDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUFpQixVQUFBLEdBQ2Y7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsdUJBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFLLFFBQUw7QUFBQSxRQUNBLFNBQUEsRUFBUSxpQkFEUjtPQURGO0tBREY7QUFBQSxJQUtBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTthQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7QUFBQSxRQUFBLGdCQUFBLEVBQWtCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUNwRCxLQUFDLENBQUEsU0FBRCxDQUFBLEVBRG9EO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEI7T0FBcEMsRUFEUTtJQUFBLENBTFY7QUFBQSxJQVNBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixVQUFBLHNCQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBZixDQUFBLENBQVQsQ0FBQTtBQUFBLE1BQ0EsSUFBQSxvQkFBTyxNQUFNLENBQUUsTUFBTSxDQUFDLGFBRHRCLENBQUE7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

//# sourceURL=/Users/sarah/.atom/packages/processing/lib/processing.coffee
