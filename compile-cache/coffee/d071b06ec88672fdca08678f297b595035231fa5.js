(function() {
  var path;

  path = require('path');

  describe('Jekyll-Atom', function() {
    var activationPromise, editor, editorView, getStatusText, getToolbar, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], editor = _ref[1], editorView = _ref[2], activationPromise = _ref[3];
    getToolbar = function() {
      return workspaceElement.querySelector('.jekyll-manager-panel');
    };
    getStatusText = function() {
      return workspaceElement.querySelector('.jekyll-status-text');
    };
    beforeEach(function() {
      expect(atom.packages.isPackageActive('jekyll')).toBe(false);
      atom.project.setPaths([path.join(__dirname, 'sample')]);
      workspaceElement = atom.views.getView(atom.workspace);
      waitsForPromise(function() {
        return atom.workspace.open('index.html');
      });
      return runs(function() {
        editor = atom.workspace.getActiveTextEditor();
        editorView = atom.views.getView(editor);
        activationPromise = atom.packages.activatePackage('jekyll');
        return activationPromise.fail(function(reason) {
          throw reason;
        });
      });
    });
    describe('Before Activation', function() {
      return it('should not be active', function() {
        return expect(atom.packages.isPackageActive('jekyll')).toBe(false);
      });
    });
    return describe('Buffer Functions', function() {
      beforeEach(function() {
        return atom.project.setPaths([path.join(__dirname, 'sample')]);
      });
      return it('should open a layout', function() {
        waitsForPromise(function() {
          return atom.workspace.open('index.html');
        });
        return runs(function() {
          var relativePath;
          relativePath = atom.workspace.getActiveTextEditor().buffer.file.path.replace(path.join(__dirname, 'sample'), '');
          console.dir(relativePath);
          expect(relativePath.replace('\\', '/')).toBe('/index.html');
          expect(atom.workspace.getTextEditors().length).toBe(1);
          atom.commands.dispatch(editorView, 'jekyll:open-layout');
          waitsForPromise(function() {
            return activationPromise;
          });
          return runs(function() {
            waitsFor(function() {
              return atom.workspace.getTextEditors().length === 2;
            });
            return runs(function() {
              relativePath = atom.workspace.getActiveTextEditor().buffer.file.path.replace(path.join(__dirname, 'sample'), '');
              expect(relativePath.replace(/\\/g, '/')).toBe('/_layouts/default.html');
              return expect(atom.workspace.getTextEditors().length).toBe(2);
            });
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2pla3lsbC9zcGVjL2pla3lsbC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxJQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsQ0FBUyxhQUFULEVBQXdCLFNBQUEsR0FBQTtBQUN0QixRQUFBLHdGQUFBO0FBQUEsSUFBQSxPQUE0RCxFQUE1RCxFQUFDLDBCQUFELEVBQW1CLGdCQUFuQixFQUEyQixvQkFBM0IsRUFBdUMsMkJBQXZDLENBQUE7QUFBQSxJQUVBLFVBQUEsR0FBYSxTQUFBLEdBQUE7YUFDWCxnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQix1QkFBL0IsRUFEVztJQUFBLENBRmIsQ0FBQTtBQUFBLElBS0EsYUFBQSxHQUFnQixTQUFBLEdBQUE7YUFDZCxnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixxQkFBL0IsRUFEYztJQUFBLENBTGhCLENBQUE7QUFBQSxJQVFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsUUFBOUIsQ0FBUCxDQUErQyxDQUFDLElBQWhELENBQXFELEtBQXJELENBQUEsQ0FBQTtBQUFBLE1BRUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQXNCLENBQUMsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLFFBQXJCLENBQUQsQ0FBdEIsQ0FGQSxDQUFBO0FBQUEsTUFJQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBSm5CLENBQUE7QUFBQSxNQU9BLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxD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

//# sourceURL=/Users/sarah/.atom/packages/jekyll/spec/jekyll-spec.coffee
