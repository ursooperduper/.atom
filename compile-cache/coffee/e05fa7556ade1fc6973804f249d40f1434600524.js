(function() {
  describe('BottomPanel', function() {
    var BottomPanel, bottomPanel, getMessage, linter;
    BottomPanel = require('../../lib/ui/bottom-panel').BottomPanel;
    linter = null;
    bottomPanel = null;
    beforeEach(function() {
      if (bottomPanel != null) {
        bottomPanel.dispose();
      }
      bottomPanel = new BottomPanel('File');
      return waitsForPromise(function() {
        return atom.packages.activatePackage('linter').then(function() {
          return linter = atom.packages.getActivePackage('linter').mainModule.instance;
        });
      });
    });
    getMessage = function(type, filePath) {
      return {
        type: type,
        text: 'Some Message',
        filePath: filePath
      };
    };
    it('is not visible when there are no errors', function() {
      return expect(linter.views.panel.getVisibility()).toBe(false);
    });
    it('hides on config change', function() {
      linter.views.panel.scope = 'Project';
      linter.views.panel.setMessages({
        added: [getMessage('Error')],
        removed: []
      });
      expect(linter.views.panel.getVisibility()).toBe(true);
      atom.config.set('linter.showErrorPanel', false);
      expect(linter.views.panel.getVisibility()).toBe(false);
      atom.config.set('linter.showErrorPanel', true);
      return expect(linter.views.panel.getVisibility()).toBe(true);
    });
    return describe('{set, remove}Messages', function() {
      return it('works as expected', function() {
        var messages;
        messages = [getMessage('Error'), getMessage('Warning')];
        bottomPanel.setMessages({
          added: messages,
          removed: []
        });
        expect(bottomPanel.element.childNodes[0].childNodes.length).toBe(2);
        bottomPanel.setMessages({
          added: [],
          removed: messages
        });
        expect(bottomPanel.element.childNodes[0].childNodes.length).toBe(0);
        bottomPanel.setMessages({
          added: messages,
          removed: []
        });
        expect(bottomPanel.element.childNodes[0].childNodes.length).toBe(2);
        bottomPanel.removeMessages(messages);
        return expect(bottomPanel.element.childNodes[0].childNodes.length).toBe(0);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL3VpL2JvdHRvbS1wYW5lbC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxRQUFBLENBQVMsYUFBVCxFQUF3QixTQUFBLEdBQUE7QUFDdEIsUUFBQSw0Q0FBQTtBQUFBLElBQUMsY0FBZSxPQUFBLENBQVEsMkJBQVIsRUFBZixXQUFELENBQUE7QUFBQSxJQUNBLE1BQUEsR0FBUyxJQURULENBQUE7QUFBQSxJQUVBLFdBQUEsR0FBYyxJQUZkLENBQUE7QUFBQSxJQUdBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7O1FBQ1QsV0FBVyxDQUFFLE9BQWIsQ0FBQTtPQUFBO0FBQUEsTUFDQSxXQUFBLEdBQWtCLElBQUEsV0FBQSxDQUFZLE1BQVosQ0FEbEIsQ0FBQTthQUVBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFFBQTlCLENBQXVDLENBQUMsSUFBeEMsQ0FBNkMsU0FBQSxHQUFBO2lCQUMzQyxNQUFBLEdBQVMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQixRQUEvQixDQUF3QyxDQUFDLFVBQVUsQ0FBQyxTQURsQjtRQUFBLENBQTdDLEVBRGM7TUFBQSxDQUFoQixFQUhTO0lBQUEsQ0FBWCxDQUhBLENBQUE7QUFBQSxJQVVBLFVBQUEsR0FBYSxTQUFDLElBQUQsRUFBTyxRQUFQLEdBQUE7QUFDWCxhQUFPO0FBQUEsUUFBQyxNQUFBLElBQUQ7QUFBQSxRQUFPLElBQUEsRUFBTSxjQUFiO0FBQUEsUUFBNkIsVUFBQSxRQUE3QjtPQUFQLENBRFc7SUFBQSxDQVZiLENBQUE7QUFBQSxJQWFBLEVBQUEsQ0FBRyx5Q0FBSCxFQUE4QyxTQUFBLEdBQUE7YUFDNUMsTUFBQSxDQUFPLE1B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

//# sourceURL=/Users/sarah/.atom/packages/linter/spec/ui/bottom-panel-spec.coffee
