(function() {
  describe('autocomplete provider', function() {
    var autocompleteMain, autocompleteManager, completionDelay, editor, editorView, jasmineContent, pigments, project, _ref;
    _ref = [], completionDelay = _ref[0], editor = _ref[1], editorView = _ref[2], pigments = _ref[3], autocompleteMain = _ref[4], autocompleteManager = _ref[5], jasmineContent = _ref[6], project = _ref[7];
    beforeEach(function() {
      runs(function() {
        var workspaceElement;
        jasmineContent = document.body.querySelector('#jasmine-content');
        atom.config.set('pigments.autocompleteScopes', ['*']);
        atom.config.set('pigments.sourceNames', ['**/*.styl', '**/*.less']);
        atom.config.set('autocomplete-plus.enableAutoActivation', true);
        completionDelay = 100;
        atom.config.set('autocomplete-plus.autoActivationDelay', completionDelay);
        completionDelay += 100;
        workspaceElement = atom.views.getView(atom.workspace);
        jasmineContent.appendChild(workspaceElement);
        autocompleteMain = atom.packages.loadPackage('autocomplete-plus').mainModule;
        spyOn(autocompleteMain, 'consumeProvider').andCallThrough();
        pigments = atom.packages.loadPackage('pigments').mainModule;
        return spyOn(pigments, 'provideAutocomplete').andCallThrough();
      });
      waitsForPromise(function() {
        return atom.workspace.open('sample.styl').then(function(e) {
          editor = e;
          return editorView = atom.views.getView(editor);
        });
      });
      waitsForPromise(function() {
        return Promise.all([atom.packages.activatePackage('autocomplete-plus'), atom.packages.activatePackage('pigments')]);
      });
      waitsForPromise(function() {
        project = pigments.getProject();
        return project.initialize();
      });
      waitsFor(function() {
        var _ref1;
        return ((_ref1 = autocompleteMain.autocompleteManager) != null ? _ref1.ready : void 0) && pigments.provideAutocomplete.calls.length === 1 && autocompleteMain.consumeProvider.calls.length === 1;
      });
      return runs(function() {
        autocompleteManager = autocompleteMain.autocompleteManager;
        spyOn(autocompleteManager, 'findSuggestions').andCallThrough();
        return spyOn(autocompleteManager, 'displaySuggestions').andCallThrough();
      });
    });
    describe('writing the name of a color', function() {
      it('returns suggestions for the matching colors', function() {
        runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.moveToBottom();
          editor.insertText('b');
          editor.insertText('a');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 1;
        });
        waitsFor(function() {
          return editorView.querySelector('.autocomplete-plus li') != null;
        });
        return runs(function() {
          var popup, preview;
          popup = editorView.querySelector('.autocomplete-plus');
          expect(popup).toExist();
          expect(popup.querySelector('span.word').textContent).toEqual('base-color');
          preview = popup.querySelector('.color-suggestion-preview');
          expect(preview).toExist();
          return expect(preview.style.background).toEqual('rgb(255, 255, 255)');
        });
      });
      it('replaces the prefix even when it contains a @', function() {
        runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.moveToBottom();
          editor.insertText('@');
          editor.insertText('b');
          editor.insertText('a');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 1;
        });
        waitsFor(function() {
          return editorView.querySelector('.autocomplete-plus li') != null;
        });
        return runs(function() {
          atom.commands.dispatch(editorView, 'autocomplete-plus:confirm');
          return expect(editor.getText()).not.toContain('@@');
        });
      });
      return it('replaces the prefix even when it contains a $', function() {
        runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.moveToBottom();
          editor.insertText('$');
          editor.insertText('o');
          editor.insertText('t');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 1;
        });
        waitsFor(function() {
          return editorView.querySelector('.autocomplete-plus li') != null;
        });
        return runs(function() {
          atom.commands.dispatch(editorView, 'autocomplete-plus:confirm');
          expect(editor.getText()).toContain('$other-color');
          return expect(editor.getText()).not.toContain('$$');
        });
      });
    });
    describe('writing the name of a non-color variable', function() {
      return it('returns suggestions for the matching variable', function() {
        atom.config.set('pigments.extendAutocompleteToVariables', false);
        runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.moveToBottom();
          editor.insertText('f');
          editor.insertText('o');
          editor.insertText('o');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 1;
        });
        return runs(function() {
          return expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
        });
      });
    });
    return describe('when extendAutocompleteToVariables is true', function() {
      beforeEach(function() {
        return atom.config.set('pigments.extendAutocompleteToVariables', true);
      });
      return describe('writing the name of a non-color variable', function() {
        return it('returns suggestions for the matching variable', function() {
          runs(function() {
            expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
            editor.moveToBottom();
            editor.insertText('b');
            editor.insertText('u');
            editor.insertText('t');
            editor.insertText('t');
            editor.insertText('o');
            editor.insertText('n');
            editor.insertText('-');
            editor.insertText('p');
            return advanceClock(completionDelay);
          });
          waitsFor(function() {
            return autocompleteManager.displaySuggestions.calls.length === 1;
          });
          waitsFor(function() {
            return editorView.querySelector('.autocomplete-plus li') != null;
          });
          return runs(function() {
            var popup;
            popup = editorView.querySelector('.autocomplete-plus');
            expect(popup).toExist();
            expect(popup.querySelector('span.word').textContent).toEqual('button-padding');
            return expect(popup.querySelector('span.right-label').textContent).toEqual('6px 8px');
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL3NwZWMvcGlnbWVudHMtcHJvdmlkZXItc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLEVBQUEsUUFBQSxDQUFTLHVCQUFULEVBQWtDLFNBQUEsR0FBQTtBQUNoQyxRQUFBLG1IQUFBO0FBQUEsSUFBQSxPQUFrSCxFQUFsSCxFQUFDLHlCQUFELEVBQWtCLGdCQUFsQixFQUEwQixvQkFBMUIsRUFBc0Msa0JBQXRDLEVBQWdELDBCQUFoRCxFQUFrRSw2QkFBbEUsRUFBdUYsd0JBQXZGLEVBQXVHLGlCQUF2RyxDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsWUFBQSxnQkFBQTtBQUFBLFFBQUEsY0FBQSxHQUFpQixRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWQsQ0FBNEIsa0JBQTVCLENBQWpCLENBQUE7QUFBQSxRQUVBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw2QkFBaEIsRUFBK0MsQ0FBQyxHQUFELENBQS9DLENBRkEsQ0FBQTtBQUFBLFFBR0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNCQUFoQixFQUF3QyxDQUN0QyxXQURzQyxFQUV0QyxXQUZzQyxDQUF4QyxDQUhBLENBQUE7QUFBQSxRQVNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3Q0FBaEIsRUFBMEQsSUFBMUQsQ0FUQSxDQUFBO0FBQUEsUUFXQSxlQUFBLEdBQWtCLEdBWGxCLENBQUE7QUFBQSxRQVlBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1Q0FBaEIsRUFBeUQsZUFBekQsQ0FaQSxDQUFBO0FBQUEsUUFhQSxlQUFBLElBQW1CLEdBYm5CLENBQUE7QUFBQSxRQWNBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FkbkIsQ0FBQTtBQUFBLFFBZ0JBLGNBQWMsQ0FBQyxXQUFmLENBQTJCLGdCQUEzQixDQWhCQSxDQUFBO0FBQUEsUUFrQkEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFkLENBQTBCLG1CQUExQixDQUE4QyxDQUFDLFVBbEJsRSxDQUFBO0FBQUEsUUFtQkEsS0FBQSxDQUFNLGdCQUFOLEVBQXdCLGlCQUF4QixDQUEwQyxDQUFDLGNBQTNDLENBQUEsQ0FuQkEsQ0FBQTtBQUFBLFFBb0JBLFFBQUEsR0FBVyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQWQsQ0FBMEIsVUFBMUIsQ0FBcUMsQ0FBQyxVQXBCakQsQ0FBQTtlQXFCQSxLQUFBLENBQU0sUUFBTixFQUFnQixxQkFBaEIsQ0FBc0MsQ0FBQyxjQUF2QyxDQUFBLEVBdEJHO01BQUEsQ0FBTCxDQUFBLENBQUE7QUFBQSxNQXdCQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixhQUFwQixDQUFrQyxDQUFDLElBQW5DLENBQXdDLFNBQUMsQ0FBRCxHQUFBO0FBQ3RDLFVBQUEsTUFBQSxHQUFTLENBQVQsQ0FBQTtpQkFDQSxVQUFBLEdBQWEsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5CLEVBRnlCO1FBQUEsQ0FBeEMsRUFEYztNQUFBLENBQWhCLENBeEJBLENBQUE7QUFBQSxNQTZCQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLE9BQU8sQ0FBQyxHQUFSLENBQVksQ0FDVixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsbUJBQTlCLENBRFUsRUFFVixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsVUFBOUIsQ0FGVSxDQUFaLEVBRGM7TUFBQSxDQUFoQixDQTdCQSxDQUFBO0FBQUEsTUFtQ0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7QUFDZCxRQUFBLE9BQUEsR0FBVSxRQUFRLENBQUMsVUFBVCxDQUFBLENBQVYsQ0FBQTtlQUNBLE9BQU8sQ0FBQyxVQUFSLENBQUEsRUFGYztNQUFBLENBQWhCLENBbkNBLENBQUE7QUFBQSxNQXVDQSxRQUFBLENBQVMsU0FBQSxHQUFBO0FBQ1AsWUFBQSxLQUFBOzhFQUFvQyxDQUFFLGVBQXRDLElBQ0UsUUFBUSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxNQUFuQyxLQUE2QyxDQUQvQyxJQUVFLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsTUFBdkMsS0FBaUQsRUFINUM7TUFBQSxDQUFULENBdkNBLENBQUE7YUE0Q0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILFFBQUEsbUJBQUEsR0FBc0IsZ0JBQWdCLENBQUMsbUJBQXZDLENBQUE7QUFBQSxRQUNBLEtBQUEsQ0FBTSxtQkFBTixFQUEyQixpQkFBM0IsQ0FBNkMsQ0FBQyxjQUE5QyxDQUFBLENBREEsQ0FBQTtlQUVBLEtBQUEsQ0FBTSxtQkFBTixFQUEyQixvQkFBM0IsQ0FBZ0QsQ0FBQyxjQUFqRCxDQUFBLEVBSEc7TUFBQSxDQUFMLEVBN0NTO0lBQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxJQW9EQSxRQUFBLENBQVMsNkJBQVQsRUFBd0MsU0FBQSxHQUFBO0FBQ3RDLE1BQUEsRUFBQSxDQUFHLDZDQUFILEVBQWtELFNBQUEsR0FBQTtBQUNoRCxRQUFBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxVQUFBLE1BQUEsQ0FBTyxVQUFVLENBQUMsYUFBWCxDQUF5QixvQkFBekIsQ0FBUCxDQUFzRCxDQUFDLEdBQUcsQ0FBQyxPQUEzRCxDQUFBLENBQUEsQ0FBQTtBQUFBLFVBRUEsTUFBTSxDQUFDLFlBQVAsQ0FBQSxDQUZBLENBQUE7QUFBQSxVQUdBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEdBQWxCLENBSEEsQ0FBQTtBQUFBLFVBSUEsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsR0FBbEIsQ0FKQSxDQUFBO2lCQU1BLFlBQUEsQ0FBYSxlQUFiLEVBUEc7UUFBQSxDQUFMLENBQUEsQ0FBQTtBQUFBLFFBU0EsUUFBQSxDQUFTLFNBQUEsR0FBQTtpQkFDUCxtQkFBbUIsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsTUFBN0MsS0FBdUQsRUFEaEQ7UUFBQSxDQUFULENBVEEsQ0FBQTtBQUFBLFFBWUEsUUFBQSxDQUFTLFNBQUEsR0FBQTtpQkFBRywwREFBSDtRQUFBLENBQVQsQ0FaQSxDQUFBO2VBY0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILGNBQUEsY0FBQTtBQUFBLFVBQUEsS0FBQSxHQUFRLFVBQVUsQ0FBQyxhQUFYLENBQXlCLG9CQUF6QixDQUFSLENBQUE7QUFBQSxVQUNBLE1BQUEsQ0FBTyxLQUFQLENBQWEsQ0FBQyxPQUFkLENBQUEsQ0FEQSxDQUFBO0FBQUEsVUFFQSxNQUFBLENBQU8sS0FBSyxDQUFDLGFBQU4sQ0FBb0IsV0FBcEIsQ0FBZ0MsQ0FBQyxXQUF4QyxDQUFvRCxDQUFDLE9BQXJELENBQTZELFlBQTdELENBRkEsQ0FBQTtBQUFBLFVBSUEsT0FBQSxHQUFVLEtBQUssQ0FBQyxhQUFOLENBQW9CLDJCQUFwQixDQUpWLENBQUE7QUFBQSxVQUtBLE1BQUEsQ0FBTyxPQUFQLENBQWUsQ0FBQyxPQUFoQixDQUFBLENBTEEsQ0FBQTtpQkFNQSxNQUFBLENBQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxVQUFyQixDQUFnQyxDQUFDLE9BQWpDLENBQXlDLG9CQUF6QyxFQVBHO1FBQUEsQ0FBTCxFQWZnRDtNQUFBLENBQWxELENBQUEsQ0FBQTtBQUFBLE1Bd0JBLEVBQUEsQ0FBRywrQ0FBSCxFQUFvRCxTQUFBLEdBQUE7QUFDbEQsUUFBQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsVUFBQSxNQUFBLENBQU8sVUFBVSxDQUFDLGFBQVgsQ0FBeUIsb0JBQXpCLENBQVAsQ0FBc0QsQ0FBQyxHQUFHLENBQUMsT0FBM0QsQ0FBQSxDQUFBLENBQUE7QUFBQSxVQUVBLE1BQU0sQ0FBQyxZQUFQLENBQUEsQ0FGQSxDQUFBO0FBQUEsVUFHQSxNQUFNLENBQUMsVUFBUCxDQUFrQixHQUFsQixDQUhBLENBQUE7QUFBQSxVQUlBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEdBQWxCLENBSkEsQ0FBQTtBQUFBLFVBS0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsR0FBbEIsQ0FMQSxDQUFBO2lCQU9BLFlBQUEsQ0FBYSxlQUFiLEVBUkc7UUFBQSxDQUFMLENBQUEsQ0FBQTtBQUFBLFFBVUEsUUFBQSxDQUFTLFNBQUEsR0FBQTtpQkFDUCxtQkFBbUIsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsTUFBN0MsS0FBdUQsRUFEaEQ7UUFBQSxDQUFULENBVkEsQ0FBQTtBQUFBLFFBYUEsUUFBQSxDQUFTLFNBQUEsR0FBQTtpQkFBRywwREFBSDtRQUFBLENBQVQsQ0FiQSxDQUFBO2VBZUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILFVBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLFVBQXZCLEVBQW1DLDJCQUFuQyxDQUFBLENBQUE7aUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLEdBQUcsQ0FBQyxTQUE3QixDQUF1QyxJQUF2QyxFQUZHO1FBQUEsQ0FBTCxFQWhCa0Q7TUFBQSxDQUFwRCxDQXhCQSxDQUFBO2FBNENBLEVBQUEsQ0FBRywrQ0FBSCxFQUFvRCxTQUFBLEdBQUE7QUFDbEQsUUFBQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsVUFBQSxNQUFBLENBQU8sVUFBVSxDQUFDLGFBQVgsQ0FBeUIsb0JBQXpCLENBQVAsQ0FBc0QsQ0FBQyxHQUFHLENBQUMsT0FBM0QsQ0FBQSxDQUFBLENBQUE7QUFBQSxVQUVBLE1BQU0sQ0FBQyxZQUFQLENBQUEsQ0FGQSxDQUFBO0FBQUEsVUFHQSxNQUFNLENBQUMsVUFBUCxDQUFrQixHQUFsQixDQUhBLENBQUE7QUFBQSxVQUlBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEdBQWxCLENBSkEsQ0FBQTtBQUFBLFVBS0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsR0FBbEIsQ0FMQSxDQUFBO2lCQU9BLFlBQUEsQ0FBYSxlQUFiLEVBUkc7UUFBQSxDQUFMLENBQUEsQ0FBQTtBQUFBLFFBVUEsUUFBQSxDQUFTLFNBQUEsR0FBQTtpQkFDUCxtQkFBbUIsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsTUFBN0MsS0FBdUQsRUFEaEQ7UUFBQSxDQUFULENBVkEsQ0FBQTtBQUFBLFFBYUEsUUFBQSxDQUFTLFNBQUEsR0FBQTtpQkFBRywwREFBSDtRQUFBLENBQVQsQ0FiQSxDQUFBO2VBZUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILFVBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLFVBQXZCLEVBQW1DLDJCQUFuQyxDQUFBLENBQUE7QUFBQSxVQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxTQUF6QixDQUFtQyxjQUFuQyxDQURBLENBQUE7aUJBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLEdBQUcsQ0FBQyxTQUE3QixDQUF1QyxJQUF2QyxFQUhHO1FBQUEsQ0FBTCxFQWhCa0Q7TUFBQSxDQUFwRCxFQTdDc0M7SUFBQSxDQUF4QyxDQXBEQSxDQUFBO0FBQUEsSUFzSEEsUUFBQSxDQUFTLDBDQUFULEVBQXFELFNBQUEsR0FBQTthQUNuRCxFQUFBLENBQUcsK0NBQUgsRUFBb0QsU0FBQSxHQUFBO0FBQ2xELFFBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHdDQUFoQixFQUEwRCxLQUExRCxDQUFBLENBQUE7QUFBQSxRQUNBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxVQUFBLE1BQUEsQ0FBTyxVQUFVLENBQUMsYUFBWCxDQUF5QixvQkFBekIsQ0FBUCxDQUFzRCxDQUFDLEdBQUcsQ0FBQyxPQUEzRCxDQUFBLENBQUEsQ0FBQTtBQUFBLFVBRUEsTUFBTSxDQUFDLFlBQVAsQ0FBQSxDQUZBLENBQUE7QUFBQSxVQUdBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEdBQWxCLENBSEEsQ0FBQTtBQUFBLFVBSUEsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsR0FBbEIsQ0FKQSxDQUFBO0FBQUEsVUFLQSxNQUFNLENBQUMsVUFBUCxDQUFrQixHQUFsQixDQUxBLENBQUE7aUJBT0EsWUFBQSxDQUFhLGVBQWIsRUFSRztRQUFBLENBQUwsQ0FEQSxDQUFBO0FBQUEsUUFXQSxRQUFBLENBQVMsU0FBQSxHQUFBO2lCQUNQLG1CQUFtQixDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxNQUE3QyxLQUF1RCxFQURoRDtRQUFBLENBQVQsQ0FYQSxDQUFBO2VBY0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtpQkFDSCxNQUFBLENBQU8sVUFBVSxDQUFDLGFBQVgsQ0FBeUIsb0JBQXpCLENBQVAsQ0FBc0QsQ0FBQyxHQUFHLENBQUMsT0FBM0QsQ0FBQSxFQURHO1FBQUEsQ0FBTCxFQWZrRDtNQUFBLENBQXBELEVBRG1EO0lBQUEsQ0FBckQsQ0F0SEEsQ0FBQTtXQXlJQSxRQUFBLENBQVMsNENBQVQsRUFBdUQsU0FBQSxHQUFBO0FBQ3JELE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtlQUNULElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3Q0FBaEIsRUFBMEQsSUFBMUQsRUFEUztNQUFBLENBQVgsQ0FBQSxDQUFBO2FBR0EsUUFBQSxDQUFTLDBDQUFULEVBQXFELFNBQUEsR0FBQTtlQUNuRCxFQUFBLENBQUcsK0NBQUgsRUFBb0QsU0FBQSxHQUFBO0FBQ2xELFVBQUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILFlBQUEsTUFBQSxDQUFPLFVBQVUsQ0FBQyxhQUFYLENBQXlCLG9CQUF6QixDQUFQLENBQXNELENBQUMsR0FBRyxDQUFDLE9BQTNELENBQUEsQ0FBQSxDQUFBO0FBQUEsWUFFQSxNQUFNLENBQUMsWUFBUCxDQUFBLENBRkEsQ0FBQTtBQUFBLFlBR0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsR0FBbEIsQ0FIQSxDQUFBO0FBQUEsWUFJQSxNQUFNLENBQUMsVUFBUCxDQUFrQixHQUFsQixDQUpBLENBQUE7QUFBQSxZQUtBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEdBQWxCLENBTEEsQ0FBQTtBQUFBLFlBTUEsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsR0FBbEIsQ0FOQSxDQUFBO0FBQUEsWUFPQSxNQUFNLENBQUMsVUFBUCxDQUFrQixHQUFsQixDQVBBLENBQUE7QUFBQSxZQVFBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEdBQWxCLENBUkEsQ0FBQTtBQUFBLFlBU0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsR0FBbEIsQ0FUQSxDQUFBO0FBQUEsWUFVQSxNQUFNLENBQUMsVUFBUCxDQUFrQixHQUFsQixDQVZBLENBQUE7bUJBWUEsWUFBQSxDQUFhLGVBQWIsRUFiRztVQUFBLENBQUwsQ0FBQSxDQUFBO0FBQUEsVUFlQSxRQUFBLENBQVMsU0FBQSxHQUFBO21CQUNQLG1CQUFtQixDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxNQUE3QyxLQUF1RCxFQURoRDtVQUFBLENBQVQsQ0FmQSxDQUFBO0FBQUEsVUFrQkEsUUFBQSxDQUFTLFNBQUEsR0FBQTttQkFBRywwREFBSDtVQUFBLENBQVQsQ0FsQkEsQ0FBQTtpQkFvQkEsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILGdCQUFBLEtBQUE7QUFBQSxZQUFBLEtBQUEsR0FBUSxVQUFVLENBQUMsYUFBWCxDQUF5QixvQkFBekIsQ0FBUixDQUFBO0FBQUEsWUFDQSxNQUFBLENBQU8sS0FBUCxDQUFhLENBQUMsT0FBZCxDQUFBLENBREEsQ0FBQTtBQUFBLFlBRUEsTUFBQSxDQUFPLEtBQUssQ0FBQyxhQUFOLENBQW9CLFdBQXBCLENBQWdDLENBQUMsV0FBeEMsQ0FBb0QsQ0FBQyxPQUFyRCxDQUE2RCxnQkFBN0QsQ0FGQSxDQUFBO21CQUlBLE1BQUEsQ0FBTyxLQUFLLENBQUMsYUFBTixDQUFvQixrQkFBcEIsQ0FBdUMsQ0FBQyxXQUEvQyxDQUEyRCxDQUFDLE9BQTVELENBQW9FLFNBQXBFLEVBTEc7VUFBQSxDQUFMLEVBckJrRDtRQUFBLENBQXBELEVBRG1EO01BQUEsQ0FBckQsRUFKcUQ7SUFBQSxDQUF2RCxFQTFJZ0M7RUFBQSxDQUFsQyxDQUFBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/sarah/.atom/packages/pigments/spec/pigments-provider-spec.coffee
