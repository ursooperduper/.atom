(function() {
  describe('Linter Config', function() {
    var CP, FS, Helpers, getLinter, getMessage, linter, _ref;
    linter = null;
    _ref = require('./common'), getLinter = _ref.getLinter, getMessage = _ref.getMessage;
    CP = require('child_process');
    FS = require('fs');
    Helpers = require('../lib/helpers');
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.packages.activatePackage('linter').then(function() {
          return linter = atom.packages.getActivePackage('linter').mainModule.instance;
        });
      });
    });
    describe('ignoredMessageTypes', function() {
      return it('ignores certain types of messages', function() {
        var linterProvider;
        linterProvider = getLinter();
        expect(linter.messages.publicMessages.length).toBe(0);
        linter.messages.set({
          linter: linterProvider,
          messages: [getMessage('Error'), getMessage('Warning')]
        });
        linter.messages.updatePublic();
        expect(linter.messages.publicMessages.length).toBe(2);
        atom.config.set('linter.ignoredMessageTypes', ['Error']);
        linter.messages.set({
          linter: linterProvider,
          messages: [getMessage('Error'), getMessage('Warning')]
        });
        linter.messages.updatePublic();
        return expect(linter.messages.publicMessages.length).toBe(1);
      });
    });
    describe('statusIconScope', function() {
      return it('only shows messages of the current scope', function() {
        var linterProvider;
        linterProvider = getLinter();
        expect(linter.views.bottomContainer.status.count).toBe(0);
        linter.messages.set({
          linter: linterProvider,
          messages: [getMessage('Error', '/tmp/test.coffee')]
        });
        linter.messages.updatePublic();
        expect(linter.views.bottomContainer.status.count).toBe(1);
        atom.config.set('linter.statusIconScope', 'File');
        expect(linter.views.bottomContainer.status.count).toBe(0);
        atom.config.set('linter.statusIconScope', 'Project');
        return expect(linter.views.bottomContainer.status.count).toBe(1);
      });
    });
    return describe('ignoreVCSIgnoredFiles', function() {
      return it('ignores the file if its ignored by the VCS', function() {
        var filePath, linterProvider;
        filePath = "/tmp/linter_test_file";
        FS.writeFileSync(filePath, "'use strict'\n");
        atom.config.set('linter.ignoreVCSIgnoredFiles', true);
        linterProvider = getLinter();
        spyOn(linterProvider, 'lint');
        spyOn(Helpers, 'isPathIgnored').andCallFake(function() {
          return true;
        });
        linter.addLinter(linterProvider);
        return waitsForPromise(function() {
          return atom.workspace.open(filePath).then(function() {
            var editor;
            editor = atom.workspace.getActiveTextEditor();
            editor.insertText("a");
            editor.save();
            expect(linterProvider.lint).not.toHaveBeenCalled();
            atom.config.set('linter.ignoreVCSIgnoredFiles', false);
            editor.insertText("a");
            editor.save();
            expect(linterProvider.lint).toHaveBeenCalled();
            return CP.execSync("rm -f " + filePath);
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL2NvbmZpZy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxRQUFBLENBQVMsZUFBVCxFQUEwQixTQUFBLEdBQUE7QUFDeEIsUUFBQSxvREFBQTtBQUFBLElBQUEsTUFBQSxHQUFTLElBQVQsQ0FBQTtBQUFBLElBQ0EsT0FBMEIsT0FBQSxDQUFRLFVBQVIsQ0FBMUIsRUFBQyxpQkFBQSxTQUFELEVBQVksa0JBQUEsVUFEWixDQUFBO0FBQUEsSUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLGVBQVIsQ0FGTCxDQUFBO0FBQUEsSUFHQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FITCxDQUFBO0FBQUEsSUFJQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGdCQUFSLENBSlYsQ0FBQTtBQUFBLElBS0EsVUFBQSxDQUFXLFNBQUEsR0FBQTthQUNULGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFFBQTlCLENBQXVDLENBQUMsSUFBeEMsQ0FBNkMsU0FBQSxHQUFBO2lCQUMzQyxNQUFBLEdBQVMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQixRQUEvQixDQUF3QyxDQUFDLFVBQVUsQ0FBQyxTQURsQjtRQUFBLENBQTdDLEVBRGM7TUFBQSxDQUFoQixFQURTO0lBQUEsQ0FBWCxDQUxBLENBQUE7QUFBQSxJQVVBLFFBQUEsQ0FBUyxxQkFBVCxFQUFnQyxTQUFBLEdBQUE7YUFDOUIsRUFBQSxDQUFHLG1DQUFILEVBQXdDLFNBQUEsR0FBQTtBQUN0QyxZQUFBLGNBQUE7QUFBQSxRQUFBLGNBQUEsR0FBaUIsU0FBQSxDQUFBLENBQWpCLENBQUE7QUFBQSxRQUNBLE1BQUEsQ0FBTyxNQUFNLENB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

//# sourceURL=/Users/sarah/.atom/packages/linter/spec/config-spec.coffee