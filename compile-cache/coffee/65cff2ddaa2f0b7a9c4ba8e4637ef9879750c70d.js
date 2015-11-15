(function() {
  var StyleLine, config, utils;

  config = require("../config");

  utils = require("../utils");

  module.exports = StyleLine = (function() {
    function StyleLine(style) {
      var _base, _base1, _base2, _base3, _base4, _base5;
      this.style = config.get("lineStyles." + style);
      if ((_base = this.style).before == null) {
        _base.before = "";
      }
      if ((_base1 = this.style).after == null) {
        _base1.after = "";
      }
      if ((_base2 = this.style).regexMatchBefore == null) {
        _base2.regexMatchBefore = this.style.regexBefore || this.style.before;
      }
      if ((_base3 = this.style).regexMatchAfter == null) {
        _base3.regexMatchAfter = this.style.regexAfter || this.style.after;
      }
      if (this.style.before) {
        if ((_base4 = this.style).regexBefore == null) {
          _base4.regexBefore = "" + this.style.before[0] + "+\\s";
        }
      }
      if (this.style.after) {
        if ((_base5 = this.style).regexAfter == null) {
          _base5.regexAfter = "\\s" + this.style.after[this.style.after.length - 1] + "*";
        }
      }
    }

    StyleLine.prototype.trigger = function(e) {
      this.editor = atom.workspace.getActiveTextEditor();
      return this.editor.transact((function(_this) {
        return function() {
          return _this.editor.getSelections().forEach(function(selection) {
            var line, range, row, rows, _i, _ref, _ref1;
            range = selection.getBufferRange();
            rows = selection.getBufferRowRange();
            for (row = _i = _ref = rows[0], _ref1 = rows[1]; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; row = _ref <= _ref1 ? ++_i : --_i) {
              selection.cursor.setBufferPosition([row, 0]);
              selection.selectToEndOfLine();
              if (line = selection.getText()) {
                _this.toggleStyle(selection, line);
              } else {
                _this.insertEmptyStyle(selection);
              }
            }
            if (rows[0] !== rows[1]) {
              return selection.setBufferRange(range);
            }
          });
        };
      })(this));
    };

    StyleLine.prototype.toggleStyle = function(selection, text) {
      if (this.isStyleOn(text)) {
        text = this.removeStyle(text);
      } else {
        text = this.addStyle(text);
      }
      return selection.insertText(text);
    };

    StyleLine.prototype.insertEmptyStyle = function(selection) {
      var position;
      selection.insertText(this.style.before);
      position = selection.cursor.getBufferPosition();
      selection.insertText(this.style.after);
      return selection.cursor.setBufferPosition(position);
    };

    StyleLine.prototype.isStyleOn = function(text) {
      return RegExp("^(\\s*)" + this.style.regexMatchBefore + "(.*?)" + this.style.regexMatchAfter + "(\\s*)$", "i").test(text);
    };

    StyleLine.prototype.addStyle = function(text) {
      var match;
      match = this.getStylePattern().exec(text);
      if (match) {
        return "" + match[1] + this.style.before + match[2] + this.style.after + match[3];
      } else {
        return "" + this.style.before + this.style.after;
      }
    };

    StyleLine.prototype.removeStyle = function(text) {
      var matches;
      matches = this.getStylePattern().exec(text);
      return matches.slice(1).join("");
    };

    StyleLine.prototype.getStylePattern = function() {
      var after, before;
      before = this.style.regexBefore || utils.regexpEscape(this.style.before);
      after = this.style.regexAfter || utils.regexpEscape(this.style.after);
      return RegExp("^(\\s*)(?:" + before + ")?(.*?)(?:" + after + ")?(\\s*)$", "i");
    };

    return StyleLine;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvY29tbWFuZHMvc3R5bGUtbGluZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0JBQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFdBQVIsQ0FBVCxDQUFBOztBQUFBLEVBQ0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxVQUFSLENBRFIsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFVUyxJQUFBLG1CQUFDLEtBQUQsR0FBQTtBQUNYLFVBQUEsNkNBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsTUFBTSxDQUFDLEdBQVAsQ0FBWSxhQUFBLEdBQWEsS0FBekIsQ0FBVCxDQUFBOzthQUVNLENBQUMsU0FBVTtPQUZqQjs7Y0FHTSxDQUFDLFFBQVM7T0FIaEI7O2NBS00sQ0FBQyxtQkFBb0IsSUFBQyxDQUFBLEtBQUssQ0FBQyxXQUFQLElBQXNCLElBQUMsQ0FBQSxLQUFLLENBQUM7T0FMeEQ7O2NBTU0sQ0FBQyxrQkFBbUIsSUFBQyxDQUFBLEtBQUssQ0FBQyxVQUFQLElBQXFCLElBQUMsQ0FBQSxLQUFLLENBQUM7T0FOdEQ7QUFRQSxNQUFBLElBQW1ELElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBMUQ7O2dCQUFNLENBQUMsY0FBZSxFQUFBLEdBQUcsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFPLENBQUEsQ0FBQSxDQUFqQixHQUFvQjtTQUExQztPQVJBO0FBU0EsTUFBQSxJQUF1RSxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQTlFOztnQkFBTSxDQUFDLGFBQWUsS0FBQSxHQUFLLElBQUMsQ0FBQSxLQUFLLENBQUMsS0FBTSxDQUFBLElBQUMsQ0FBQSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQWIs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

//# sourceURL=/Users/sarah/.atom/packages/markdown-writer/lib/commands/style-line.coffee
