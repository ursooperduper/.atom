(function() {
  var $, $$, fs, path, _ref;

  path = require('path');

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$;

  fs = require('fs-plus');

  describe('Jekyll New Post View', function() {
    var activationPromise, editor, editorView, _ref1;
    _ref1 = [], activationPromise = _ref1[0], editor = _ref1[1], editorView = _ref1[2];
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
    describe('the view', function() {
      it('should appear as a modal', function() {
        atom.commands.dispatch(editorView, 'jekyll:new-post');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var dialog;
          dialog = $(atom.workspace.getModalPanels()[0].getItem()).view();
          expect(dialog).toExist();
          expect(dialog.promptText).toExist();
          return expect(dialog.miniEditor).toHaveFocus();
        });
      });
      return it('should allow you to confirm the entry', function() {
        atom.commands.dispatch(editorView, 'jekyll:new-post');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var dialog, fileContents, fileName, pathToCreate, titleName, _ref2;
          dialog = $(atom.workspace.getModalPanels()[0].getItem()).view();
          titleName = dialog.generateFileName('Jekyll New Post');
          fileName = atom.config.get('jekyll.postsDir') + titleName + atom.config.get('jekyll.postsType');
          pathToCreate = (_ref2 = atom.project.getDirectories()[0]) != null ? _ref2.resolve(fileName) : void 0;
          if (fs.existsSync(pathToCreate)) {
            fs.unlinkSync(pathToCreate);
          }
          expect(fs.existsSync(pathToCreate)).toBe(false);
          dialog.miniEditor.setText('Jekyll New Post');
          expect(dialog.miniEditor.getText()).toBe('Jekyll New Post');
          atom.commands.dispatch(dialog.element, 'core:confirm');
          expect(fs.existsSync(pathToCreate)).toBe(true);
          if (fs.existsSync(pathToCreate)) {
            fileContents = fs.readFileSync(pathToCreate, {
              encoding: 'UTF-8'
            });
            expect(fileContents).toBe(dialog.fileContents('Jekyll New Post', dialog.generateDateString()));
            return fs.unlinkSync(pathToCreate);
          } else {
            throw 'file not created';
          }
        });
      });
    });
    return describe('the functions', function() {
      it('should generate a date string and file name', function() {
        atom.commands.dispatch(editorView, 'jekyll:new-post');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var dialog;
          dialog = $(atom.workspace.getModalPanels()[0].getItem()).view();
          expect(dialog.generateDateString(new Date(0))).toBe('1970-01-01');
          return expect(dialog.generateFileName('Jekyll New Post')).toBe(dialog.generateDateString() + '-jekyll-new-post');
        });
      });
      return it('should create a post', function() {
        atom.commands.dispatch(editorView, 'jekyll:new-post');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var dialog, fileContents, fileName, pathToCreate, titleName, _ref2;
          dialog = $(atom.workspace.getModalPanels()[0].getItem()).view();
          titleName = dialog.generateFileName('Jekyll New Post');
          fileName = atom.config.get('jekyll.postsDir') + titleName + atom.config.get('jekyll.postsType');
          pathToCreate = (_ref2 = atom.project.getDirectories()[0]) != null ? _ref2.resolve(fileName) : void 0;
          if (fs.existsSync(pathToCreate)) {
            fs.unlinkSync(pathToCreate);
          }
          expect(fs.existsSync(pathToCreate)).toBe(false);
          dialog.onConfirm('Jekyll New Post');
          expect(fs.existsSync(pathToCreate)).toBe(true);
          if (fs.existsSync(pathToCreate)) {
            fileContents = fs.readFileSync(pathToCreate, {
              encoding: 'UTF-8'
            });
            expect(fileContents).toBe(dialog.fileContents('Jekyll New Post', dialog.generateDateString()));
            return fs.unlinkSync(pathToCreate);
          } else {
            throw 'file not created';
          }
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2pla3lsbC9zcGVjL25ldy1wb3N0LXZpZXctc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEscUJBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsT0FBVSxPQUFBLENBQVEsc0JBQVIsQ0FBVixFQUFDLFNBQUEsQ0FBRCxFQUFJLFVBQUEsRUFESixDQUFBOztBQUFBLEVBRUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBRkwsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsQ0FBUyxzQkFBVCxFQUFpQyxTQUFBLEdBQUE7QUFDL0IsUUFBQSw0Q0FBQTtBQUFBLElBQUEsUUFBMEMsRUFBMUMsRUFBQyw0QkFBRCxFQUFvQixpQkFBcEIsRUFBNEIscUJBQTVCLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLGdCQUFBO0FBQUEsTUFBQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFFBQTlCLENBQVAsQ0FBK0MsQ0FBQyxJQUFoRCxDQUFxRCxLQUFyRCxDQUFBLENBQUE7QUFBQSxNQUVBLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFzQixDQUFDLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixRQUFyQixDQUFELENBQXRCLENBRkEsQ0FBQTtBQUFBLE1BSUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUpuQixDQUFBO0FBQUEsTUFNQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixZQUFwQixFQURjO01BQUEsQ0FB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

//# sourceURL=/Users/sarah/.atom/packages/jekyll/spec/new-post-view-spec.coffee
