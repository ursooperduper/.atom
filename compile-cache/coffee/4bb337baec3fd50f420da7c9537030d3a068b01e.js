(function() {
  var $, $$, fs, path, _ref;

  path = require('path');

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$;

  fs = require('fs-plus');

  describe('Jekyll Toolbar View', function() {
    var activationPromise, editor, editorView, toolbar, _ref1;
    _ref1 = [], activationPromise = _ref1[0], editor = _ref1[1], editorView = _ref1[2], toolbar = _ref1[3];
    beforeEach(function() {
      var workspaceElement;
      expect(atom.packages.isPackageActive('jekyll')).toBe(false);
      atom.project.setPaths([path.join(__dirname, 'sample')]);
      workspaceElement = atom.views.getView(atom.workspace);
      waitsForPromise(function() {
        return atom.workspace.open('index.html');
      });
      return runs(function() {
        jasmine.attachToDOM(workspaceElement);
        editor = atom.workspace.getActiveTextEditor();
        editorView = atom.views.getView(editor);
        activationPromise = atom.packages.activatePackage('jekyll');
        return activationPromise.fail(function(reason) {
          throw reason;
        });
      });
    });
    return describe('The View', function() {
      beforeEach(function() {
        atom.commands.dispatch(editorView, 'jekyll:toolbar');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          return toolbar = $(atom.workspace.getBottomPanels()[0].getItem()).view();
        });
      });
      return it('should attach itself to the bottom', function() {
        return expect(toolbar).toExist();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2pla3lsbC9zcGVjL3Rvb2xiYXItc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEscUJBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsT0FBVSxPQUFBLENBQVEsc0JBQVIsQ0FBVixFQUFDLFNBQUEsQ0FBRCxFQUFJLFVBQUEsRUFESixDQUFBOztBQUFBLEVBRUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBRkwsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsQ0FBUyxxQkFBVCxFQUFnQyxTQUFBLEdBQUE7QUFDOUIsUUFBQSxxREFBQTtBQUFBLElBQUEsUUFBbUQsRUFBbkQsRUFBQyw0QkFBRCxFQUFvQixpQkFBcEIsRUFBNEIscUJBQTVCLEVBQXdDLGtCQUF4QyxDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxnQkFBQTtBQUFBLE1BQUEsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixRQUE5QixDQUFQLENBQStDLENBQUMsSUFBaEQsQ0FBcUQsS0FBckQsQ0FBQSxDQUFBO0FBQUEsTUFFQSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBc0IsQ0FBQyxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsUUFBckIsQ0FBRCxDQUF0QixDQUZBLENBQUE7QUFBQSxNQUlBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FKbkIsQ0FBQTtBQUFBLE1BTUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsWUFBcEIsRUFEYztNQUFBLENBQWhCLENBTkEsQ0FBQTthQVNBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxRQUFBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLGdCQUFwQixDQUFBLENBQUE7QUFBQSxRQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FEVCxDQUFBO0FBQUEsUUFFQSxVQUFBLEdBQWEsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5CLENBRmIsQ0FBQTtBQUFBLFFBS0EsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFFBQTlCLENBTHBCLENBQUE7ZUFNQSxpQkFBaUIsQ0FBQyxJQUFsQixDQUF1QixTQUFDLE1BQUQsR0FBQTtBQUNyQixnQkFBTSxNQUFOLENBRHFCO1FBQUEsQ0FBdkIsRUFQRztNQUFBLENBQUwsRUFWUztJQUFBLENBQVgsQ0FGQSxDQUFBO1dBc0JBLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUEsR0FBQTtBQUNuQixNQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxRQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixVQUF2QixFQUFtQyxnQkFBbkMsQ0FBQSxDQUFBO0FBQUEsUUFFQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFDZCxrQkFEYztRQUFBLENBQWhCLENBRkEsQ0FBQTtlQUtBLElBQUEsQ0FBSyxTQUFBLEdBQUE7aUJBQ0gsT0FBQSxHQUFVLENBQUEsQ0FBRSxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWYsQ0FBQSxDQUFpQyxDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQXBDLENBQUEsQ0FBRixDQUFnRCxDQUFDLElBQWpELENBQUEsRUFEUDtRQUFBLENBQUwsRUFOUztNQUFBLENBQVgsQ0FBQSxDQUFBO2FBU0EsRUFBQSxDQUFHLG9DQUFILEVBQXlDLFNBQUEsR0FBQTtlQUN2QyxNQUFBLENBQU8sT0FBUCxDQUFlLENBQUMsT0FBaEIsQ0FBQSxFQUR1QztNQUFBLENBQXpDLEVBVm1CO0lBQUEsQ0FBckIsRUF2QjhCO0VBQUEsQ0FBaEMsQ0FKQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/sarah/.atom/packages/jekyll/spec/toolbar-spec.coffee
