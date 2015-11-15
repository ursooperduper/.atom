(function() {
  var AtomProcessing;

  AtomProcessing = require('../lib/atom-processing');

  describe("AtomProcessing", function() {
    var activationPromise, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return activationPromise = atom.packages.activatePackage('atom-processing');
    });
    return describe("when the atom-processing:toggle event is triggered", function() {
      it("hides and shows the modal panel", function() {
        expect(workspaceElement.querySelector('.atom-processing')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'atom-processing:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var atomProcessingElement, atomProcessingPanel;
          expect(workspaceElement.querySelector('.atom-processing')).toExist();
          atomProcessingElement = workspaceElement.querySelector('.atom-processing');
          expect(atomProcessingElement).toExist();
          atomProcessingPanel = atom.workspace.panelForItem(atomProcessingElement);
          expect(atomProcessingPanel.isVisible()).toBe(true);
          atom.commands.dispatch(workspaceElement, 'atom-processing:toggle');
          return expect(atomProcessingPanel.isVisible()).toBe(false);
        });
      });
      return it("hides and shows the view", function() {
        jasmine.attachToDOM(workspaceElement);
        expect(workspaceElement.querySelector('.atom-processing')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'atom-processing:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var atomProcessingElement;
          atomProcessingElement = workspaceElement.querySelector('.atom-processing');
          expect(atomProcessingElement).toBeVisible();
          atom.commands.dispatch(workspaceElement, 'atom-processing:toggle');
          return expect(atomProcessingElement).not.toBeVisible();
        });
      });
    });
  });

}).call(this);
