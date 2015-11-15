(function() {
  var EditLine, LineMeta, MAX_SKIP_EMPTY_LINE_ALLOWED, config;

  config = require("../config");

  LineMeta = require("../helpers/line-meta");

  MAX_SKIP_EMPTY_LINE_ALLOWED = 5;

  module.exports = EditLine = (function() {
    function EditLine(action) {
      this.action = action;
      this.editor = atom.workspace.getActiveTextEditor();
    }

    EditLine.prototype.trigger = function(e) {
      var fn;
      fn = this.action.replace(/-[a-z]/ig, function(s) {
        return s[1].toUpperCase();
      });
      return this.editor.transact((function(_this) {
        return function() {
          return _this.editor.getSelections().forEach(function(selection) {
            return _this[fn](e, selection);
          });
        };
      })(this));
    };

    EditLine.prototype.insertNewLine = function(e, selection) {
      var cursor, line, lineMeta;
      if (this._isRangeSelection(selection)) {
        return this.editor.insertNewline();
      }
      cursor = selection.getHeadBufferPosition();
      line = this.editor.lineTextForBufferRow(cursor.row);
      if (cursor.column < line.length && !config.get("inlineNewLineContinuation")) {
        return this.editor.insertNewline();
      }
      lineMeta = new LineMeta(line);
      if (lineMeta.isContinuous()) {
        if (lineMeta.isEmptyBody()) {
          return this._insertNewlineWithoutContinuation(cursor);
        } else {
          return this._insertNewlineWithContinuation(lineMeta.nextLine);
        }
      } else {
        return this.editor.insertNewline();
      }
    };

    EditLine.prototype._insertNewlineWithContinuation = function(nextLine) {
      return this.editor.insertText("\n" + nextLine);
    };

    EditLine.prototype._insertNewlineWithoutContinuation = function(cursor) {
      var currentIndentation, emptyLineSkipped, indentation, line, nextLine, row, _i, _ref;
      nextLine = "\n";
      currentIndentation = this.editor.indentationForBufferRow(cursor.row);
      if (currentIndentation > 0 && cursor.row > 1) {
        emptyLineSkipped = 0;
        for (row = _i = _ref = cursor.row - 1; _ref <= 0 ? _i <= 0 : _i >= 0; row = _ref <= 0 ? ++_i : --_i) {
          line = this.editor.lineTextForBufferRow(row);
          if (line.trim() === "") {
            if (emptyLineSkipped > MAX_SKIP_EMPTY_LINE_ALLOWED) {
              break;
            }
            emptyLineSkipped += 1;
          } else {
            indentation = this.editor.indentationForBufferRow(row);
            if (indentation >= currentIndentation) {
              continue;
            }
            if (indentation === currentIndentation - 1 && LineMeta.isList(line)) {
              nextLine = new LineMeta(line).nextLine;
            }
            break;
          }
        }
      }
      this.editor.selectToBeginningOfLine();
      return this.editor.insertText(nextLine);
    };

    EditLine.prototype.indentListLine = function(e, selection) {
      var cursor, line;
      if (this._isRangeSelection(selection)) {
        return selection.indentSelectedRows();
      }
      cursor = selection.getHeadBufferPosition();
      line = this.editor.lineTextForBufferRow(cursor.row);
      if (LineMeta.isList(line)) {
        return selection.indentSelectedRows();
      } else if (this._isAtLineBeginning(line, cursor.column)) {
        return selection.indent();
      } else {
        return selection.insertText(" ");
      }
    };

    EditLine.prototype._isAtLineBeginning = function(line, col) {
      return col === 0 || line.substring(0, col).trim() === "";
    };

    EditLine.prototype._isRangeSelection = function(selection) {
      var head, tail;
      head = selection.getHeadBufferPosition();
      tail = selection.getTailBufferPosition();
      return head.row !== tail.row || head.column !== tail.column;
    };

    return EditLine;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvY29tbWFuZHMvZWRpdC1saW5lLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1REFBQTs7QUFBQSxFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsV0FBUixDQUFULENBQUE7O0FBQUEsRUFDQSxRQUFBLEdBQVcsT0FBQSxDQUFRLHNCQUFSLENBRFgsQ0FBQTs7QUFBQSxFQUdBLDJCQUFBLEdBQThCLENBSDlCLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRVMsSUFBQSxrQkFBQyxNQUFELEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsTUFBVixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQURWLENBRFc7SUFBQSxDQUFiOztBQUFBLHVCQUlBLE9BQUEsR0FBUyxTQUFDLENBQUQsR0FBQTtBQUNQLFVBQUEsRUFBQTtBQUFBLE1BQUEsRUFBQSxHQUFLLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFnQixVQUFoQixFQUE0QixTQUFDLENBQUQsR0FBQTtlQUFPLENBQUUsQ0FBQSxDQUFBLENBQUUsQ0FBQyxXQUFMLENBQUEsRUFBUDtNQUFBLENBQTVCLENBQUwsQ0FBQTthQUVBLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixDQUFpQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNmLEtBQUMsQ0FBQSxNQUFNLENBQUMsYUFBUixDQUFBLENBQXVCLENBQUMsT0FBeEIsQ0FBZ0MsU0FBQyxTQUFELEdBQUE7bUJBQzlCLEtBQUUsQ0FBQSxFQUFBLENBQUYsQ0FBTSxDQUFOLEVBQVMsU0FBVCxFQUQ4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

//# sourceURL=/Users/sarah/.atom/packages/markdown-writer/lib/commands/edit-line.coffee
