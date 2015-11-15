(function() {
  var OpenCheatSheet, utils;

  utils = require("../utils");

  module.exports = OpenCheatSheet = (function() {
    function OpenCheatSheet() {}

    OpenCheatSheet.prototype.trigger = function(e) {
      if (!this.hasPreview()) {
        e.abortKeyBinding();
      }
      return atom.workspace.open(this.cheatsheetURL(), {
        split: 'right',
        searchAllPanes: true
      });
    };

    OpenCheatSheet.prototype.hasPreview = function() {
      return !!atom.packages.activePackages['markdown-preview'];
    };

    OpenCheatSheet.prototype.cheatsheetURL = function() {
      var cheatsheet;
      cheatsheet = utils.getPackagePath("CHEATSHEET.md");
      return "markdown-preview://" + (encodeURI(cheatsheet));
    };

    return OpenCheatSheet;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvY29tbWFuZHMvb3Blbi1jaGVhdC1zaGVldC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEscUJBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFVBQVIsQ0FBUixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtnQ0FDSjs7QUFBQSw2QkFBQSxPQUFBLEdBQVMsU0FBQyxDQUFELEdBQUE7QUFDUCxNQUFBLElBQUEsQ0FBQSxJQUE0QixDQUFBLFVBQUQsQ0FBQSxDQUEzQjtBQUFBLFFBQUEsQ0FBQyxDQUFDLGVBQUYsQ0FBQSxDQUFBLENBQUE7T0FBQTthQUVBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixJQUFDLENBQUEsYUFBRCxDQUFBLENBQXBCLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxPQUFQO0FBQUEsUUFBZ0IsY0FBQSxFQUFnQixJQUFoQztPQURGLEVBSE87SUFBQSxDQUFULENBQUE7O0FBQUEsNkJBTUEsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUNWLENBQUEsQ0FBQyxJQUFLLENBQUMsUUFBUSxDQUFDLGNBQWUsQ0FBQSxrQkFBQSxFQURyQjtJQUFBLENBTlosQ0FBQTs7QUFBQSw2QkFTQSxhQUFBLEdBQWUsU0FBQSxHQUFBO0FBQ2IsVUFBQSxVQUFBO0FBQUEsTUFBQSxVQUFBLEdBQWEsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsZUFBckIsQ0FBYixDQUFBO2FBQ0MscUJBQUEsR0FBb0IsQ0FBQyxTQUFBLENBQVUsVUFBVixDQUFELEVBRlI7SUFBQSxDQVRmLENBQUE7OzBCQUFBOztNQUpGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/sarah/.atom/packages/markdown-writer/lib/commands/open-cheat-sheet.coffee
