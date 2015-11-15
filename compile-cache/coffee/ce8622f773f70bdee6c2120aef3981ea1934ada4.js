(function() {
  var AutocompleteClang, WorkspaceView;

  WorkspaceView = require('atom').WorkspaceView;

  AutocompleteClang = require('../lib/autocomplete-clang');

  describe("AutocompleteClang", function() {
    var activationPromise;
    activationPromise = null;
    beforeEach(function() {
      atom.workspaceView = new WorkspaceView;
      return activationPromise = atom.packages.activatePackage('autocomplete-clang');
    });
    return describe("when the autocomplete-clang:toggle event is triggered", function() {
      return it("attaches and then detaches the view", function() {
        expect(atom.workspaceView.find('.autocomplete-clang')).not.toExist();
        atom.workspaceView.trigger('autocomplete-clang:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          expect(atom.workspaceView.find('.autocomplete-clang')).toExist();
          atom.workspaceView.trigger('autocomplete-clang:toggle');
          return expect(atom.workspaceView.find('.autocomplete-clang')).not.toExist();
        });
      });
    });
  });

}).call(this);
