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
      messageElement.updateVisibility('File');
      expect(messageElement.hasAttribute('hidden')).toBe(true);
      message.currentFile = true;
      messageElement.updateVisibility('File');
      expect(messageElement.hasAttribute('hidden')).toBe(false);
      expect(visibleText(messageElement).indexOf(filePath) === -1).toBe(true);
      messageElement.updateVisibility('Line');
      expect(messageElement.hasAttribute('hidden')).toBe(true);
      message.currentLine = true;
      messageElement.updateVisibility('Line');
      expect(messageElement.hasAttribute('hidden')).toBe(false);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL3VpL21lc3NhZ2UtZWxlbWVudC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxRQUFBLENBQVMsaUJBQVQsRUFBNEIsU0FBQSxHQUFBO0FBQzFCLFFBQUEsMENBQUE7QUFBQSxJQUFDLFVBQVcsT0FBQSxDQUFRLDhCQUFSLEVBQVgsT0FBRCxDQUFBO0FBQUEsSUFDQSxRQUFBLEdBQVcsU0FBQSxHQUFZLG9CQUR2QixDQUFBO0FBQUEsSUFHQSxVQUFBLEdBQWEsU0FBQyxJQUFELEdBQUE7QUFDWCxhQUFPO0FBQUEsUUFBQyxNQUFBLElBQUQ7QUFBQSxRQUFPLElBQUEsRUFBTSxjQUFiO0FBQUEsUUFBNkIsVUFBQSxRQUE3QjtPQUFQLENBRFc7SUFBQSxDQUhiLENBQUE7QUFBQSxJQUtBLFdBQUEsR0FBYyxTQUFDLE9BQUQsR0FBQTtBQUNaLFVBQUEsTUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLE9BQU8sQ0FBQyxTQUFSLENBQWtCLElBQWxCLENBQVQsQ0FBQTtBQUFBLE1BQ0EsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBeEIsQ0FBNkIsTUFBTSxDQUFDLGdCQUFQLENBQXdCLFVBQXhCLENBQTdCLEVBQWtFLFNBQUMsSUFBRCxHQUFBO2VBQ2hFLElBQUksQ0FBQyxNQUFMLENBQUEsRUFEZ0U7TUFBQSxDQUFsRSxDQURBLENBQUE7QUFJQSxhQUFPLE1BQU0sQ0FBQyxXQUFkLENBTFk7SUFBQSxDQUxkLENBQUE7QUFBQSxJQVlBLEVBQUEsQ0FBRyxPQUFILEVBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSx1QkFBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLFVBQUEsQ0FBVyxPQUFYLENBQVYsQ0FBQTtBQUFBLE1BQ0EsY0FBQSxHQUFp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

//# sourceURL=/Users/sarah/.atom/packages/linter/spec/ui/message-element-spec.coffee
