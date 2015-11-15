(function() {
  var Provider, deprecate,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  deprecate = require('grim').deprecate;

  module.exports = Provider = (function() {
    Provider.prototype.wordRegex = /\b\w*[a-zA-Z_-]+\w*\b/g;

    function Provider() {
      this.buildSuggestionsShim = __bind(this.buildSuggestionsShim, this);
      deprecate('`Provider` is no longer supported. Please define your own object (a class or anonymous object)\ninstead of extending `Provider`. Example\n  ```\n  # Example:\n  provider =\n    requestHandler: (options) ->\n      # Build your suggestions here...\n\n      # Return your suggestions as an array of anonymous objects\n      [{\n        word: \'ohai\',\n        prefix: \'ohai\',\n        label: \'<span style=\'color: red\'>ohai</span>\',\n        renderLabelAsHtml: true,\n        className: \'ohai\'\n      }]\n    selector: \'.source.js,.source.coffee\' # This provider will be run on JavaScript and Coffee files\n    dispose: ->\n      # Your dispose logic here\n  ```');
      this.initialize.apply(this, arguments);
    }

    Provider.prototype.initialize = function() {};

    Provider.prototype.exclusive = false;

    Provider.prototype.buildSuggestionsShim = function(options) {
      if ((options != null ? options.editor : void 0) == null) {
        return;
      }
      this.editor = options.editor;
      return this.buildSuggestions.apply(this, arguments);
    };

    Provider.prototype.buildSuggestions = function() {
      throw new Error('Subclass must implement a buildSuggestions(options) method');
    };

    Provider.prototype.confirm = function(suggestion) {
      return true;
    };

    Provider.prototype.prefixOfSelection = function(selection) {
      var lineRange, prefix, selectionRange;
      selectionRange = selection.getBufferRange();
      lineRange = [[selectionRange.start.row, 0], [selectionRange.end.row, this.editor.lineTextForBufferRow(selectionRange.end.row).length]];
      prefix = '';
      this.editor.getBuffer().scanInRange(this.wordRegex, lineRange, function(_arg) {
        var match, prefixOffset, range, stop;
        match = _arg.match, range = _arg.range, stop = _arg.stop;
        if (range.start.isGreaterThan(selectionRange.end)) {
          stop();
        }
        if (range.intersectsWith(selectionRange)) {
          prefixOffset = selectionRange.start.column - range.start.column;
          if (range.start.isLessThan(selectionRange.start)) {
            return prefix = match[0].slice(0, prefixOffset);
          }
        }
      });
      return prefix;
    };

    return Provider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQyxZQUFhLE9BQUEsQ0FBUSxNQUFSLEVBQWIsU0FBRCxDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHVCQUFBLFNBQUEsR0FBVyx3QkFBWCxDQUFBOztBQUVhLElBQUEsa0JBQUEsR0FBQTtBQUNYLHlFQUFBLENBQUE7QUFBQSxNQUFBLFNBQUEsQ0FBVSwrcEJBQVYsQ0FBQSxDQUFBO0FBQUEsTUFzQkEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxLQUFaLENBQWtCLElBQWxCLEVBQXdCLFNBQXhCLENBdEJBLENBRFc7SUFBQSxDQUZiOztBQUFBLHVCQTRCQSxVQUFBLEdBQVksU0FBQSxHQUFBLENBNUJaLENBQUE7O0FBQUEsdUJBaUNBLFNBQUEsR0FBVyxLQWpDWCxDQUFBOztBQUFBLHVCQW1DQSxvQkFBQSxHQUFzQixTQUFDLE9BQUQsR0FBQTtBQUNwQixNQUFBLElBQWMsbURBQWQ7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVSxPQUFPLENBQUMsTUFEbEIsQ0FBQTthQUVBLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxLQUFsQixDQUF3QixJQUF4QixFQUE4QixTQUE5QixFQUhvQjtJQUFBLENBbkN0QixDQUFBOztBQUFBLHVCQTZDQSxnQkFBQSxHQUFrQixTQUFBLEdBQUE7QUFDaEIsWUFBVSxJQUFBLEtBQUEsQ0FBTSw0REFBTixDQUFWLENBRGdCO0lBQUEsQ0E3Q2xCLENBQUE7O0FBQUEsdUJBdURBLE9BQUEsR0FBUyxTQUFDLFVBQUQsR0FBQTtBQUNQLGFBQU8sSUFBUCxDQURPO0lBQUEsQ0F2RFQsQ0FBQTs7QUFBQSx1QkErREEsaUJBQUEsR0FBbUIsU0FBQyxTQUFELEdBQUE7QUFDakIsVUFBQSxpQ0FBQTtBQUFBLE1BQUEsY0FBQSxHQUFpQixTQUFTLENBQUMsY0FBVixDQUFBLENBQWpCLENBQUE7QUFBQSxNQUNBLFNBQUEsR0FBWSxDQUFDLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUF0QixFQUEyQixDQUEzQixDQUFELEVBQWdDLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxHQUFwQixFQUF5QixJQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFSLENBQTZCLGNBQWMsQ0FBQyxHQUFHLENBQUMsR0FBaEQsQ0FBb0QsQ0FBQyxNQUE5RSxDQUFoQyxDQURaLENBQUE7QUFBQSxNQUVBLE1BQUEsR0FBUyxFQUZULENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUixDQUFBLENBQW1CLENBQUMsV0FBcEIsQ0FBZ0MsSUFBQyxDQUFBLFNBQWpDLEVBQTRDLFNBQTVDLEVBQXVELFNBQUMsSUFBRCxHQUFBO0FBQ3JELFlBQUEsZ0NBQUE7QUFBQSxRQUR1RCxhQUFBLE9BQU8sYUFBQSxPQUFPLFlBQUEsSUFDckUsQ0FBQTtBQUFBLFFBQUEsSUFBVSxLQUFLLENBQUMsS0FBSyxDQUFDLGFBQVosQ0FBMEIsY0FBYyxDQUFDLEdBQXpDLENBQVY7QUFBQSxVQUFBLElBQUEsQ0FBQSxDQUFBLENBQUE7U0FBQTtBQUVBLFFBQUEsSUFBRyxLQUFLLENBQUMsY0FBTixDQUFxQixjQUFyQixDQUFIO0FBQ0UsVUFBQSxZQUFBLEdBQWUsY0FBYyxDQUFDLEtBQUssQ0FBQyxNQUFyQixHQUE4QixLQUFLLENBQUMsS0FBSyxDQUFDLE1BQXpELENBQUE7QUFDQSxVQUFBLElBQXVDLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBWixDQUF1QixjQUFjLENBQUMsS0FBdEMsQ0FBdkM7bUJBQUEsTUFBQSxHQUFTLEtBQU0sQ0FBQSxDQUFBLENBQUcsd0JBQWxCO1dBRkY7U0FIcUQ7TUFBQSxDQUF2RCxDQUhBLENBQUE7QUFVQSxhQUFPLE1BQVAsQ0FYaUI7SUFBQSxDQS9EbkIsQ0FBQTs7b0JBQUE7O01BUEYsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/sarah/.atom/packages/autocomplete-plus/lib/provider.coffee