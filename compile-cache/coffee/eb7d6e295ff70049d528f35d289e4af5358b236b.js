(function() {
  var StyleText, config, scopeSelectors, utils;

  config = require("../config");

  utils = require("../utils");

  scopeSelectors = {
    code: ".raw",
    bold: ".bold",
    italic: ".italic",
    strikethrough: ".strike"
  };

  module.exports = StyleText = (function() {
    function StyleText(style) {
      var _base, _base1;
      this.styleName = style;
      this.style = config.get("textStyles." + style);
      if ((_base = this.style).before == null) {
        _base.before = "";
      }
      if ((_base1 = this.style).after == null) {
        _base1.after = "";
      }
    }

    StyleText.prototype.trigger = function(e) {
      this.editor = atom.workspace.getActiveTextEditor();
      return this.editor.transact((function(_this) {
        return function() {
          return _this.editor.getSelections().forEach(function(selection) {
            var text;
            _this.normalizeSelection(selection);
            if (text = selection.getText()) {
              return _this.toggleStyle(selection, text);
            } else {
              return _this.insertEmptyStyle(selection);
            }
          });
        };
      })(this));
    };

    StyleText.prototype.normalizeSelection = function(selection) {
      var range, scopeSelector;
      scopeSelector = scopeSelectors[this.styleName];
      if (!scopeSelector) {
        return;
      }
      range = utils.getTextBufferRange(this.editor, scopeSelector, selection);
      return selection.setBufferRange(range);
    };

    StyleText.prototype.toggleStyle = function(selection, text) {
      if (this.isStyleOn(text)) {
        text = this.removeStyle(text);
      } else {
        text = this.addStyle(text);
      }
      return selection.insertText(text);
    };

    StyleText.prototype.insertEmptyStyle = function(selection) {
      var position;
      selection.insertText(this.style.before);
      position = selection.cursor.getBufferPosition();
      selection.insertText(this.style.after);
      return selection.cursor.setBufferPosition(position);
    };

    StyleText.prototype.isStyleOn = function(text) {
      if (text) {
        return this.getStylePattern().test(text);
      }
    };

    StyleText.prototype.addStyle = function(text) {
      return "" + this.style.before + text + this.style.after;
    };

    StyleText.prototype.removeStyle = function(text) {
      var matches;
      while (matches = this.getStylePattern().exec(text)) {
        text = matches.slice(1).join("");
      }
      return text;
    };

    StyleText.prototype.getStylePattern = function() {
      var after, before;
      before = this.style.regexBefore || utils.regexpEscape(this.style.before);
      after = this.style.regexAfter || utils.regexpEscape(this.style.after);
      return RegExp("^([\\s\\S]*?)" + before + "([\\s\\S]*?)" + after + "([\\s\\S]*?)$", "gm");
    };

    return StyleText;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvY29tbWFuZHMvc3R5bGUtdGV4dC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0NBQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFdBQVIsQ0FBVCxDQUFBOztBQUFBLEVBQ0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxVQUFSLENBRFIsQ0FBQTs7QUFBQSxFQUlBLGNBQUEsR0FDRTtBQUFBLElBQUEsSUFBQSxFQUFNLE1BQU47QUFBQSxJQUNBLElBQUEsRUFBTSxPQUROO0FBQUEsSUFFQSxNQUFBLEVBQVEsU0FGUjtBQUFBLElBR0EsYUFBQSxFQUFlLFNBSGY7R0FMRixDQUFBOztBQUFBLEVBVUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQVFTLElBQUEsbUJBQUMsS0FBRCxHQUFBO0FBQ1gsVUFBQSxhQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsU0FBRCxHQUFhLEtBQWIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLEtBQUQsR0FBUyxNQUFNLENBQUMsR0FBUCxDQUFZLGFBQUEsR0FBYSxLQUF6QixDQURULENBQUE7O2FBR00sQ0FBQyxTQUFVO09BSGpCOztjQUlNLENBQUMsUUFBUztPQUxMO0lBQUEsQ0FBYjs7QUFBQSx3QkFPQSxPQUFBLEdBQVMsU0FBQyxDQUFELEdBQUE7QUFDUCxNQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVYsQ0FBQTthQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixDQUFpQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNmLEtBQUMsQ0FBQSxNQUFNLENBQUMsYUFBUixDQUFBLENBQXVCLENBQUMsT0FBeEIs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

//# sourceURL=/Users/sarah/.atom/packages/markdown-writer/lib/commands/style-text.coffee
