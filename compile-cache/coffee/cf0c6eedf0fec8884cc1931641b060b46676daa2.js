(function() {
  var BufferedProcess, fs;

  BufferedProcess = require('atom').BufferedProcess;

  fs = require('fs');

  module.exports = {
    activate: function() {
      return atom.workspaceView.command("swift-playground:execute", (function(_this) {
        return function() {
          return _this.execute();
        };
      })(this));
    },
    execute: function() {
      var inputFilePath, outputDir, outputFilePath, stderr, stdout;
      outputDir = "" + (atom.getConfigDirPath()) + "/.swift-playground";
      if (!fs.existsSync(outputDir)) {
        fs.mkdir(outputDir);
      }
      inputFilePath = "" + outputDir + "/input.swift";
      outputFilePath = "" + outputDir + "/Swift Output";
      fs.writeFile(inputFilePath, atom.workspace.getActiveEditor().getText());
      stdout = (function(_this) {
        return function(output) {
          return fs.writeFile(outputFilePath, output, function(error) {
            var activePane;
            if (error) {
              throw error;
            }
            activePane = atom.workspace.getActivePane();
            return atom.workspace.open(outputFilePath, {
              split: 'right',
              activatePane: false
            }).done(function(newEditor) {
              return activePane.activate();
            });
          });
        };
      })(this);
      stderr = stdout;
      return new BufferedProcess({
        command: "xcrun",
        args: ["swift", inputFilePath],
        stdout: stdout,
        stderr: stderr
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBOztBQUFBLEVBQUMsa0JBQW1CLE9BQUEsQ0FBUSxNQUFSLEVBQW5CLGVBQUQsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQURMLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQiwwQkFBM0IsRUFBdUQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsT0FBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF2RCxFQURRO0lBQUEsQ0FBVjtBQUFBLElBR0EsT0FBQSxFQUFTLFNBQUEsR0FBQTtBQUNQLFVBQUEsd0RBQUE7QUFBQSxNQUFBLFNBQUEsR0FBWSxFQUFBLEdBQUUsQ0FBQSxJQUFJLENBQUMsZ0JBQUwsQ0FBQSxDQUFBLENBQUYsR0FBMkIsb0JBQXZDLENBQUE7QUFDQSxNQUFBLElBQXNCLENBQUEsRUFBTSxDQUFDLFVBQUgsQ0FBYyxTQUFkLENBQTFCO0FBQUEsUUFBQSxFQUFFLENBQUMsS0FBSCxDQUFTLFNBQVQsQ0FBQSxDQUFBO09BREE7QUFBQSxNQUVBLGFBQUEsR0FBZ0IsRUFBQSxHQUFFLFNBQUYsR0FBYSxjQUY3QixDQUFBO0FBQUEsTUFHQSxjQUFBLEdBQWlCLEVBQUEsR0FBRSxTQUFGLEdBQWEsZUFIOUIsQ0FBQTtBQUFBLE1BSUEsRUFBRSxDQUFDLFNBQUgsQ0FBYSxhQUFiLEVBQTRCLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZixDQUFBLENBQWdDLENBQUMsT0FBakMsQ0FBQSxDQUE1QixDQUpBLENBQUE7QUFBQSxNQUtBLE1BQUEsR0FBUyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxNQUFELEdBQUE7aUJBQ1AsRUFBRSxDQUFDLFNBQUgsQ0FBYSxjQUFiLEVBQTZCLE1BQTdCLEVBQXFDLFNBQUMsS0FBRCxHQUFBO0FBQ25DLGdCQUFBLFVBQUE7QUFBQSxZQUFBLElBQWUsS0FBZjtBQUFBLG9CQUFNLEtBQU4sQ0FBQTthQUFBO0FBQUEsWUFDQSxVQUFBLEdBQWEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FEYixDQUFBO21CQUVBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixjQUFwQixFQUFvQztBQUFBLGNBQUMsS0FBQSxFQUFPLE9BQVI7QUFBQSxjQUFpQixZQUFBLEVBQWMsS0FBL0I7YUFBcEMsQ0FBdUUsQ0FBQyxJQUF4RSxDQUE2RSxTQUFDLFNBQUQsR0FBQTtxQkFBZSxVQUFVLENBQUMsUUFBWCxDQUFBLEVBQWY7WUFBQSxDQUE3RSxFQUhtQztVQUFBLENBQXJDLEVBRE87UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUxULENBQUE7QUFBQSxNQVVBLE1BQUEsR0FBUyxNQVZULENBQUE7YUFXSSxJQUFBLGVBQUEsQ0FBZ0I7QUFBQSxRQUNsQixPQUFBLEVBQVMsT0FEUztBQUFBLFFBRWxCLElBQUEsRUFBTSxDQUFDLE9BQUQsRUFBVSxhQUFWLENBRlk7QUFBQSxRQUdsQixRQUFBLE1BSGtCO0FBQUEsUUFJbEIsUUFBQSxNQUprQjtPQUFoQixFQVpHO0lBQUEsQ0FIVDtHQUpGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/sarah/.atom/packages/swift-playground/lib/swift_playground.coffee