(function() {
  var pkg;

  pkg = require("../package");

  describe("MarkdownWriter", function() {
    var activationPromise, ditor, editorView, workspaceView, _ref;
    _ref = [], workspaceView = _ref[0], ditor = _ref[1], editorView = _ref[2], activationPromise = _ref[3];
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open("test");
      });
      return runs(function() {
        var editor;
        workspaceView = atom.views.getView(atom.workspace);
        editor = atom.workspace.getActiveTextEditor();
        editorView = atom.views.getView(editor);
        return activationPromise = atom.packages.activatePackage("markdown-writer");
      });
    });
    pkg.activationCommands["atom-workspace"].forEach(function(cmd) {
      return xit("registered workspace commands " + cmd, function() {
        atom.config.set("markdown-writer.testMode", true);
        atom.commands.dispatch(workspaceView, cmd);
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          return expect(true).toBe(true);
        });
      });
    });
    return pkg.activationCommands["atom-text-editor"].forEach(function(cmd) {
      return xit("registered editor commands " + cmd, function() {
        atom.config.set("markdown-writer.testMode", true);
        atom.commands.dispatch(editorView, cmd);
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          return expect(true).toBe(true);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9zcGVjL21hcmtkb3duLXdyaXRlci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxHQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxZQUFSLENBQU4sQ0FBQTs7QUFBQSxFQU9BLFFBQUEsQ0FBUyxnQkFBVCxFQUEyQixTQUFBLEdBQUE7QUFDekIsUUFBQSx5REFBQTtBQUFBLElBQUEsT0FBd0QsRUFBeEQsRUFBQyx1QkFBRCxFQUFnQixlQUFoQixFQUF1QixvQkFBdkIsRUFBbUMsMkJBQW5DLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLE1BQXBCLEVBQUg7TUFBQSxDQUFoQixDQUFBLENBQUE7YUFDQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsWUFBQSxNQUFBO0FBQUEsUUFBQSxhQUFBLEdBQWdCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FBaEIsQ0FBQTtBQUFBLFFBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQURULENBQUE7QUFBQSxRQUVBLFVBQUEsR0FBYSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsTUFBbkIsQ0FGYixDQUFBO2VBR0EsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGlCQUE5QixFQUpqQjtNQUFBLENBQUwsRUFGUztJQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUFjQSxHQUFHLENBQUMsa0JBQW1CLENBQUEsZ0JBQUEsQ0FBaUIsQ0FBQyxPQUF6QyxDQUFpRCxTQUFDLEdBQUQsR0FBQTthQUMvQyxHQUFBLENBQUssZ0NBQUEsR0FBZ0MsR0FBckMsRUFBNEMsU0FBQSxHQUFBO0FBQzFDLFFBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDBCQUFoQixFQUE0QyxJQUE1QyxDQUFBLENBQUE7QUFBQSxRQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixhQUF2QixFQUFzQyxHQUF0QyxDQUZBLENBQUE7QUFBQSxRQUlBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUFHLGtCQUFIO1FBQUEsQ0FBaEIsQ0FKQSxDQUFBO2VBS0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtpQkFBRyxNQUFBLENBQU8sSUFBUCxDQUFZLENBQUMsSUFBYixDQUFrQixJQUFsQixFQUFIO1FBQUEsQ0FBTCxFQU4wQztNQUFBLENBQTVDLEVBRCtDO0lBQUEsQ0FBakQsQ0FkQSxDQUFBO1dBdUJBLEdBQUcsQ0FBQyxrQkFBbUIsQ0FBQSxrQkFBQSxDQUFtQixDQUFDLE9BQTNDLENBQW1ELFNBQUMsR0FBRCxHQUFBO2FBQ2pELEdBQUEsQ0FBSyw2QkFBQSxHQUE2QixHQUFsQyxFQUF5QyxTQUFBLEdBQUE7QUFDdkMsUUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMEJBQWhCLEVBQTRDLElBQTVDLENBQUEsQ0FBQTtBQUFBLFFBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLFVBQXZCLEVBQW1DLEdBQW5DLENBRkEsQ0FBQTtBQUFBLFFBSUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQUcsa0JBQUg7UUFBQSxDQUFoQixDQUpBLENBQUE7ZUFLQSxJQUFBLENBQUssU0FBQSxHQUFBO2lCQUFHLE1BQUEsQ0FBTyxJQUFQLENBQVksQ0FBQyxJQUFiLENBQWtCLElBQWxCLEVBQUg7UUFBQSxDQUFMLEVBTnVDO01BQUEsQ0FBekMsRUFEaUQ7SUFBQSxDQUFuRCxFQXhCeUI7RUFBQSxDQUEzQixDQVBBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/sarah/.atom/packages/markdown-writer/spec/markdown-writer-spec.coffee
