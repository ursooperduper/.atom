(function() {
  var Processing;

  Processing = require('../lib/processing');

  describe("Processing", function() {
    var activationPromise, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return activationPromise = atom.packages.activatePackage('processing');
    });
    return describe("when the processing:toggle event is triggered", function() {
      it("hides and shows the modal panel", function() {
        expect(workspaceElement.querySelector('.processing')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'processing:run');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var processingElement, processingPanel;
          expect(workspaceElement.querySelector('.processing')).toExist();
          processingElement = workspaceElement.querySelector('.processing');
          expect(processingElement).toExist();
          processingPanel = atom.workspace.panelForItem(processingElement);
          expect(processingPanel.isVisible()).toBe(true);
          atom.commands.dispatch(workspaceElement, 'processing:run');
          return expect(processingPanel.isVisible()).toBe(false);
        });
      });
      return it("hides and shows the view", function() {
        jasmine.attachToDOM(workspaceElement);
        expect(workspaceElement.querySelector('.processing')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'processing:run');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var processingElement;
          processingElement = workspaceElement.querySelector('.processing');
          expect(processingElement).toBeVisible();
          atom.commands.dispatch(workspaceElement, 'processing:run');
          return expect(processingElement).not.toBeVisible();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL3Byb2Nlc3Npbmcvc3BlYy9wcm9jZXNzaW5nLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFVBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLG1CQUFSLENBQWIsQ0FBQTs7QUFBQSxFQU9BLFFBQUEsQ0FBUyxZQUFULEVBQXVCLFNBQUEsR0FBQTtBQUNyQixRQUFBLHlDQUFBO0FBQUEsSUFBQSxPQUF3QyxFQUF4QyxFQUFDLDBCQUFELEVBQW1CLDJCQUFuQixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQW5CLENBQUE7YUFDQSxpQkFBQSxHQUFvQixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsWUFBOUIsRUFGWDtJQUFBLENBQVgsQ0FGQSxDQUFBO1dBTUEsUUFBQSxDQUFTLCtDQUFULEVBQTBELFNBQUEsR0FBQTtBQUN4RCxNQUFBLEVBQUEsQ0FBRyxpQ0FBSCxFQUFzQyxTQUFBLEdBQUE7QUFHcEMsUUFBQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0IsYUFBL0IsQ0FBUCxDQUFxRCxDQUFDLEdBQUcsQ0FBQyxPQUExRCxDQUFBLENBQUEsQ0FBQTtBQUFBLFFBSUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5QyxnQkFBekMsQ0FKQSxDQUFBO0FBQUEsUUFNQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFDZCxrQkFEYztRQUFBLENBQWhCLENBTkEsQ0FBQTtlQVNBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxjQUFBLGtDQUFBO0FBQUEsVUFBQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0IsYUFBL0IsQ0FBUCxDQUFxRCxDQUFDLE9BQXRELENBQUEsQ0FBQSxDQUFBO0FBQUEsVUFFQSxpQkFBQSxHQUFvQixnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixhQUEvQixDQUZwQixDQUFBO0FBQUEsVUFHQSxNQUFBLENBQU8saUJBQVAsQ0FBeUIsQ0FBQyxPQUExQixDQUFBLENBSEEsQ0FBQTtBQUFBLFVBS0EsZUFBQSxHQUFrQixJQUFJLENBQUMsU0FBUyxDQUFDLFlBQWYsQ0FBNEIsaUJBQTVCLENBTGxCLENBQUE7QUFBQSxVQU1BLE1BQUEsQ0FBTyxlQUFlLENBQUMsU0FBaEIsQ0FBQSxDQUFQLENBQW1DLENBQUMsSUFBcEMsQ0FBeUMsSUFBekMsQ0FOQSxDQUFBO0FBQUEsVUFPQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLGdCQUF6QyxDQVBBLENBQUE7aUJBUUEsTUFBQSxDQUFPLGVBQWUsQ0FBQyxTQUFoQixDQUFBLENBQVAsQ0FBbUMsQ0FBQyxJQUFwQyxDQUF5QyxLQUF6QyxFQVRHO1FBQUEsQ0FBTCxFQVpvQztNQUFBLENBQXRDLENBQUEsQ0FBQTthQXVCQSxFQUFBLENBQUcsMEJBQUgsRUFBK0IsU0FBQSxHQUFBO0FBTzdCLFFBQUEsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsZ0JBQXBCLENBQUEsQ0FBQTtBQUFBLFFBRUEsTUFBQSxDQUFPLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLGFBQS9CLENBQVAsQ0FBcUQsQ0FBQyxHQUFHLENBQUMsT0FBMUQsQ0FBQSxDQUZBLENBQUE7QUFBQSxRQU1BLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsZ0JBQXpDLENBTkEsQ0FBQTtBQUFBLFFBUUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQ2Qsa0JBRGM7UUFBQSxDQUFoQixDQVJBLENBQUE7ZUFXQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBRUgsY0FBQSxpQkFBQTtBQUFBLFVBQUEsaUJBQUEsR0FBb0IsZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0IsYUFBL0IsQ0FBcEIsQ0FBQTtBQUFBLFVBQ0EsTUFBQSxDQUFPLGlCQUFQLENBQXlCLENBQUMsV0FBMUIsQ0FBQSxDQURBLENBQUE7QUFBQSxVQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsZ0JBQXpDLENBRkEsQ0FBQTtpQkFHQSxNQUFBLENBQU8saUJBQVAsQ0FBeUIsQ0FBQyxHQUFHLENBQUMsV0FBOUIsQ0FBQSxFQUxHO1FBQUEsQ0FBTCxFQWxCNkI7TUFBQSxDQUEvQixFQXhCd0Q7SUFBQSxDQUExRCxFQVBxQjtFQUFBLENBQXZCLENBUEEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/sarah/.atom/packages/processing/spec/processing-spec.coffee
