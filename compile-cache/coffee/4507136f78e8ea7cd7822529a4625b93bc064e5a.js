(function() {
  var OpenCheatSheet;

  OpenCheatSheet = require("../../lib/commands/open-cheat-sheet");

  describe("OpenCheatSheet", function() {
    return it("returns correct cheatsheetURL", function() {
      var cmd;
      cmd = new OpenCheatSheet();
      expect(cmd.cheatsheetURL()).toMatch("markdown-preview://");
      return expect(cmd.cheatsheetURL()).toMatch("CHEATSHEET.md");
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9zcGVjL2NvbW1hbmRzL29wZW4tY2hlYXQtc2hlZXQtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsY0FBQTs7QUFBQSxFQUFBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLHFDQUFSLENBQWpCLENBQUE7O0FBQUEsRUFFQSxRQUFBLENBQVMsZ0JBQVQsRUFBMkIsU0FBQSxHQUFBO1dBQ3pCLEVBQUEsQ0FBRywrQkFBSCxFQUFvQyxTQUFBLEdBQUE7QUFDbEMsVUFBQSxHQUFBO0FBQUEsTUFBQSxHQUFBLEdBQVUsSUFBQSxjQUFBLENBQUEsQ0FBVixDQUFBO0FBQUEsTUFDQSxNQUFBLENBQU8sR0FBRyxDQUFDLGFBQUosQ0FBQSxDQUFQLENBQTJCLENBQUMsT0FBNUIsQ0FBb0MscUJBQXBDLENBREEsQ0FBQTthQUVBLE1BQUEsQ0FBTyxHQUFHLENBQUMsYUFBSixDQUFBLENBQVAsQ0FBMkIsQ0FBQyxPQUE1QixDQUFvQyxlQUFwQyxFQUhrQztJQUFBLENBQXBDLEVBRHlCO0VBQUEsQ0FBM0IsQ0FGQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/sarah/.atom/packages/markdown-writer/spec/commands/open-cheat-sheet-spec.coffee
