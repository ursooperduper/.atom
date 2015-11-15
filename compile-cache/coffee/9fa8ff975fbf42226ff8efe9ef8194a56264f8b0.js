(function() {
  var JekyllSnippets;

  JekyllSnippets = require('../lib/jekyll-snippets');

  describe("JekyllSnippets", function() {
    var activationPromise, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      activationPromise = atom.packages.activatePackage('jekyll-snippets');
      activationPromise.fail(function(reason) {
        throw reason;
      });
      return jasmine.attachToDOM(workspaceElement);
    });
    return describe("when the jekyll-snippets:toggle event is triggered", function() {
      return it("attaches and then detaches the view", function() {
        expect(workspaceElement.querySelector('.jekyll-snippets')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'jekyll-snippets:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          expect(atom.packages.isPackageActive('jekyll-snippets')).toBe(true);
          atom.commands.dispatch(workspaceElement, 'jekyll-snippets:toggle');
          return expect(workspaceElement.querySelector('.jekyll-snippets')).not.toExist();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2pla3lsbC1zbmlwcGV0cy9zcGVjL2pla3lsbC1zbmlwcGV0cy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxjQUFBOztBQUFBLEVBQUEsY0FBQSxHQUFpQixPQUFBLENBQVEsd0JBQVIsQ0FBakIsQ0FBQTs7QUFBQSxFQVFBLFFBQUEsQ0FBUyxnQkFBVCxFQUEyQixTQUFBLEdBQUE7QUFDekIsUUFBQSx5Q0FBQTtBQUFBLElBQUEsT0FBd0MsRUFBeEMsRUFBQywwQkFBRCxFQUFtQiwyQkFBbkIsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFuQixDQUFBO0FBQUEsTUFDQSxpQkFBQSxHQUFvQixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsaUJBQTlCLENBRHBCLENBQUE7QUFBQSxNQUVBLGlCQUFpQixDQUFDLElBQWxCLENBQXVCLFNBQUMsTUFBRCxHQUFBO0FBQ3JCLGNBQU0sTUFBTixDQURxQjtNQUFBLENBQXZCLENBRkEsQ0FBQTthQUtBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLGdCQUFwQixFQU5TO0lBQUEsQ0FBWCxDQUZBLENBQUE7V0FVQSxRQUFBLENBQVMsb0RBQVQsRUFBK0QsU0FBQSxHQUFBO2FBQzdELEVBQUEsQ0FBRyxxQ0FBSCxFQUEwQyxTQUFBLEdBQUE7QUFDeEMsUUFBQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0Isa0JBQS9CLENBQVAsQ0FBMEQsQ0FBQyxHQUFHLENBQUMsT0FBL0QsQ0FBQSxDQUFBLENBQUE7QUFBQSxRQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsd0JBQXpDLENBRkEsQ0FBQTtBQUFBLFFBSUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQ2Qsa0JBRGM7UUFBQSxDQUFoQixDQUpBLENBQUE7ZUFPQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsVUFBQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGlCQUE5QixDQUFQLENBQXdELENBQUMsSUFBekQsQ0FBOEQsSUFBOUQsQ0FBQSxDQUFBO0FBQUEsVUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLHdCQUF6QyxDQURBLENBQUE7aUJBRUEsTUFBQSxDQUFPLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLGtCQUEvQixDQUFQLENBQTBELENBQUMsR0FBRyxDQUFDLE9BQS9ELENBQUEsRUFIRztRQUFBLENBQUwsRUFSd0M7TUFBQSxDQUExQyxFQUQ2RDtJQUFBLENBQS9ELEVBWHlCO0VBQUEsQ0FBM0IsQ0FSQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/sarah/.atom/packages/jekyll-snippets/spec/jekyll-snippets-spec.coffee
