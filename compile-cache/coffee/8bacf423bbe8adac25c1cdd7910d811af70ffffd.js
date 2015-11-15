(function() {
  var CreateDefaultKeymaps, fs, path, utils;

  fs = require("fs-plus");

  path = require("path");

  utils = require("../utils");

  module.exports = CreateDefaultKeymaps = (function() {
    function CreateDefaultKeymaps() {}

    CreateDefaultKeymaps.prototype.trigger = function() {
      var keymaps, userKeymapFile;
      keymaps = fs.readFileSync(this.sampleKeymapFile());
      userKeymapFile = this.userKeymapFile();
      return fs.appendFile(userKeymapFile, keymaps, function(err) {
        if (!err) {
          return atom.workspace.open(userKeymapFile);
        }
      });
    };

    CreateDefaultKeymaps.prototype.userKeymapFile = function() {
      return path.join(atom.getConfigDirPath(), "keymap.cson");
    };

    CreateDefaultKeymaps.prototype.sampleKeymapFile = function() {
      return utils.getPackagePath("keymaps", this._sampleFilename());
    };

    CreateDefaultKeymaps.prototype._sampleFilename = function() {
      return {
        "darwin": "sample-osx.cson",
        "linux": "sample-linux.cson",
        "win32": "sample-win32.cson"
      }[process.platform] || "sample-osx.cson";
    };

    return CreateDefaultKeymaps;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvY29tbWFuZHMvY3JlYXRlLWRlZmF1bHQta2V5bWFwcy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEscUNBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUdBLEtBQUEsR0FBUSxPQUFBLENBQVEsVUFBUixDQUhSLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO3NDQUNKOztBQUFBLG1DQUFBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxVQUFBLHVCQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsSUFBQyxDQUFBLGdCQUFELENBQUEsQ0FBaEIsQ0FBVixDQUFBO0FBQUEsTUFFQSxjQUFBLEdBQWlCLElBQUMsQ0FBQSxjQUFELENBQUEsQ0FGakIsQ0FBQTthQUdBLEVBQUUsQ0FBQyxVQUFILENBQWMsY0FBZCxFQUE4QixPQUE5QixFQUF1QyxTQUFDLEdBQUQsR0FBQTtBQUNyQyxRQUFBLElBQUEsQ0FBQSxHQUFBO2lCQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixjQUFwQixFQUFBO1NBRHFDO01BQUEsQ0FBdkMsRUFKTztJQUFBLENBQVQsQ0FBQTs7QUFBQSxtQ0FPQSxjQUFBLEdBQWdCLFNBQUEsR0FBQTthQUNkLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLGdCQUFMLENBQUEsQ0FBVixFQUFtQyxhQUFuQyxFQURjO0lBQUEsQ0FQaEIsQ0FBQTs7QUFBQSxtQ0FVQSxnQkFBQSxHQUFrQixTQUFBLEdBQUE7YUFDaEIsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsU0FBckIsRUFBZ0MsSUFBQyxDQUFBLGVBQUQsQ0FBQSxDQUFoQyxFQURnQjtJQUFBLENBVmxCLENBQUE7O0FBQUEsbUNBYUEsZUFBQSxHQUFpQixTQUFBLEdBQUE7YUFDZjtBQUFBLFFBQ0UsUUFBQSxFQUFVLGlCQURaO0FBQUEsUUFFRSxPQUFBLEVBQVUsbUJBRlo7QUFBQSxRQUdFLE9BQUEsRUFBVSxtQkFIWjtPQUlFLENBQUEsT0FBTyxDQUFDLFFBQVIsQ0FKRixJQUl1QixrQkFMUjtJQUFBLENBYmpCLENBQUE7O2dDQUFBOztNQVBGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/sarah/.atom/packages/markdown-writer/lib/commands/create-default-keymaps.coffee
