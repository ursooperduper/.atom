(function() {
  describe('Message Element', function() {
    var Message, filePath, getMessage, visibleText;
    Message = require('../../lib/ui/message-element').Message;
    filePath = __dirname + '/fixtures/file.txt';
    getMessage = function(type) {
      return {
        type: type,
        text: 'Some Message',
        filePath: filePath
      };
    };
    visibleText = function(element) {
      var cloned;
      cloned = element.cloneNode(true);
      Array.prototype.forEach.call(cloned.querySelectorAll('[hidden]'), function(item) {
        return item.remove();
      });
      return cloned.textContent;
    };
    it('works', function() {
      var message, messageElement;
      message = getMessage('Error');
      messageElement = Message.fromMessage(message, 'Project');
      messageElement.attachedCallback();
      expect(visibleText(messageElement).indexOf(filePath) !== -1).toBe(true);
      messageElement.updateVisibility('Line');
      expect(messageElement.hasAttribute('hidden')).toBe(true);
      message.currentLine = true;
      messageElement.updateVisibility('Line');
      return expect(visibleText(messageElement).indexOf(filePath) === -1).toBe(true);
    });
    return it('plays nice with class attribute', function() {
      var message, messageElement;
      message = getMessage('Error');
      message["class"] = 'Well Hello';
      messageElement = Message.fromMessage(message, 'Project');
      messageElement.attachedCallback();
      expect(messageElement.querySelector('.Well') instanceof Element).toBe(true);
      expect(messageElement.querySelector('.Hello') instanceof Element).toBe(true);
      return expect(messageElement.querySelector('.haha')).toBe(null);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL3VpL21lc3NhZ2UtZWxlbWVudC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxRQUFBLENBQVMsaUJBQVQsRUFBNEIsU0FBQSxHQUFBO0FBQzFCLFFBQUEsMENBQUE7QUFBQSxJQUFDLFVBQVcsT0FBQSxDQUFRLDhCQUFSLEVBQVgsT0FBRCxDQUFBO0FBQUEsSUFDQSxRQUFBLEdBQVcsU0FBQSxHQUFZLG9CQUR2QixDQUFBO0FBQUEsSUFHQSxVQUFBLEdBQWEsU0FBQyxJQUFELEdBQUE7QUFDWCxhQUFPO0FBQUEsUUFBQyxNQUFBLElBQUQ7QUFBQSxRQUFPLElBQUEsRUFBTSxjQUFiO0FBQUEsUUFBNkIsVUFBQSxRQUE3QjtPQUFQLENBRFc7SUFBQSxDQUhiLENBQUE7QUFBQSxJQUtBLFdBQUEsR0FBYyxTQUFDLE9BQUQsR0FBQTtBQUNaLFVBQUEsTUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLE9BQU8sQ0FBQyxTQUFSLENBQWtCLElBQWxCLENBQVQsQ0FBQTtBQUFBLE1BQ0EsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBeEIsQ0FBNkIsTUFBTSxDQUFDLGdCQUFQLENBQXdCLFVBQXhCLENBQTdCLEVBQWtFLFNBQUMsSUFBRCxHQUFBO2VBQ2hFLElBQUksQ0FBQyxNQUFMLENBQUEsRUFEZ0U7TUFBQSxDQUFsRSxDQURBLENBQUE7QUFJQSxhQUFPLE1BQU0sQ0FBQyxXQUFkLENBTFk7SUFBQSxDQUxkLENBQUE7QUFBQSxJQVlBLEVBQUEsQ0FBRyxPQUFILEVBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSx1QkFBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLFVBQUEsQ0FBVyxPQUFYLENBQVYsQ0FBQTtBQUFBLE1BQ0EsY0FBQSxHQUFpQixPQUFPLENBQUMsV0FBUixDQUFvQixPQUFwQixFQUE2QixTQUE3QixDQURqQixDQUFBO0FBQUEsTUFFQSxjQUFjLENBQUMsZ0JBQWYsQ0FBQSxDQUZBLENBQUE7QUFBQSxNQUlBLE1BQUEsQ0FBTyxXQUFBLENBQVksY0FBWixDQUEyQixDQUFDLE9BQTVCLENBQW9DLFFBQXBDLENBQUEsS0FBbUQsQ0FBQSxDQUExRCxDQUE2RCxDQUFDLElBQTlELENBQW1FLElBQW5FLENBSkEsQ0FBQTtBQUFBLE1BTUEsY0FBYyxDQUFDLGdCQUFmLENBQWdDLE1BQWhDLENBTkEsQ0FBQTtBQUFBLE1BT0EsTUFBQSxDQUFPLGNBQWMsQ0FBQyxZQUFmLENBQTRCLFFBQTVCLENBQVAsQ0FBNkMsQ0FBQyxJQUE5QyxDQUFtRCxJQUFuRCxDQVBBLENBQUE7QUFBQSxNQVFBLE9BQU8sQ0FBQyxXQUFSLEdBQXNCLElBUnRCLENBQUE7QUFBQSxNQVNBLGNBQWMsQ0FBQyxnQkFBZixDQUFnQyxNQUFoQyxDQVRBLENBQUE7YUFVQSxNQUFBLENBQU8sV0FBQSxDQUFZLGNBQVosQ0FBMkIsQ0FBQyxPQUE1QixDQUFvQyxRQUFwQyxDQUFBLEtBQWlELENBQUEsQ0FBeEQsQ0FBMkQsQ0FBQyxJQUE1RCxDQUFpRSxJQUFqRSxFQVhVO0lBQUEsQ0FBWixDQVpBLENBQUE7V0F5QkEsRUFBQSxDQUFHLGlDQUFILEVBQXNDLFNBQUEsR0FBQTtBQUNwQyxVQUFBLHVCQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsVUFBQSxDQUFXLE9BQVgsQ0FBVixDQUFBO0FBQUEsTUFDQSxPQUFPLENBQUMsT0FBRCxDQUFQLEdBQWdCLFlBRGhCLENBQUE7QUFBQSxNQUVBLGNBQUEsR0FBaUIsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsT0FBcEIsRUFBNkIsU0FBN0IsQ0FGakIsQ0FBQTtBQUFBLE1BR0EsY0FBYyxDQUFDLGdCQUFmLENBQUEsQ0FIQSxDQUFBO0FBQUEsTUFLQSxNQUFBLENBQU8sY0FBYyxDQUFDLGFBQWYsQ0FBNkIsT0FBN0IsQ0FBQSxZQUFpRCxPQUF4RCxDQUFnRSxDQUFDLElBQWpFLENBQXNFLElBQXRFLENBTEEsQ0FBQTtBQUFBLE1BTUEsTUFBQSxDQUFPLGNBQWMsQ0FBQyxhQUFmLENBQTZCLFFBQTdCLENBQUEsWUFBa0QsT0FBekQsQ0FBaUUsQ0FBQyxJQUFsRSxDQUF1RSxJQUF2RSxDQU5BLENBQUE7YUFPQSxNQUFBLENBQU8sY0FBYyxDQUFDLGFBQWYsQ0FBNkIsT0FBN0IsQ0FBUCxDQUE2QyxDQUFDLElBQTlDLENBQW1ELElBQW5ELEVBUm9DO0lBQUEsQ0FBdEMsRUExQjBCO0VBQUEsQ0FBNUIsQ0FBQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/sarah/.atom/packages/linter/spec/ui/message-element-spec.coffee
