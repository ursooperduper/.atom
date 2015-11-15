(function() {
  var FormatText, LIST_OL_REGEX, config, utils;

  config = require("../config");

  utils = require("../utils");

  LIST_OL_REGEX = /^(\s*)(\d+)\.\s*(.*)$/;

  module.exports = FormatText = (function() {
    function FormatText(action) {
      this.action = action;
      this.editor = atom.workspace.getActiveTextEditor();
    }

    FormatText.prototype.trigger = function(e) {
      var fn;
      fn = this.action.replace(/-[a-z]/ig, function(s) {
        return s[1].toUpperCase();
      });
      return this.editor.transact((function(_this) {
        return function() {
          var formattedText, paragraphRange, range, text;
          paragraphRange = _this.editor.getCurrentParagraphBufferRange();
          range = _this.editor.getSelectedBufferRange();
          if (paragraphRange) {
            range = paragraphRange.union(range);
          }
          text = _this.editor.getTextInBufferRange(range);
          if (range.start.row === range.end.row || text.trim() === "") {
            return;
          }
          formattedText = _this[fn](e, range, text.split("\n"));
          if (formattedText) {
            return _this.editor.setTextInBufferRange(range, formattedText);
          }
        };
      })(this));
    };

    FormatText.prototype.correctOrderListNumbers = function(e, range, lines) {
      var correctedLines, idx, indent, indentStack, line, matches, orderStack, _i, _len;
      correctedLines = [];
      indentStack = [];
      orderStack = [];
      for (idx = _i = 0, _len = lines.length; _i < _len; idx = ++_i) {
        line = lines[idx];
        if (matches = LIST_OL_REGEX.exec(line)) {
          indent = matches[1];
          if (indentStack.length === 0 || indent.length > indentStack[0].length) {
            indentStack.unshift(indent);
            orderStack.unshift(1);
          } else if (indent.length < indentStack[0].length) {
            indentStack.shift();
            orderStack.shift();
            orderStack.unshift(orderStack.shift() + 1);
          } else {
            orderStack.unshift(orderStack.shift() + 1);
          }
          correctedLines[idx] = "" + indentStack[0] + orderStack[0] + ". " + matches[3];
        } else {
          correctedLines[idx] = line;
        }
      }
      return correctedLines.join("\n");
    };

    FormatText.prototype.formatTable = function(e, range, lines) {
      var options, row, rows, table, _i, _len, _ref, _ref1;
      if (lines.some(function(line) {
        return line.trim() !== "" && !utils.isTableRow(line);
      })) {
        return;
      }
      _ref = this._parseTable(lines), rows = _ref.rows, options = _ref.options;
      table = [];
      table.push(utils.createTableRow(rows[0], options).trimRight());
      table.push(utils.createTableSeparator(options));
      _ref1 = rows.slice(1);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        row = _ref1[_i];
        table.push(utils.createTableRow(row, options).trimRight());
      }
      return table.join("\n");
    };

    FormatText.prototype._parseTable = function(lines) {
      var columnWidth, i, line, options, row, rows, separator, _i, _j, _len, _len1, _ref;
      rows = [];
      options = {
        numOfColumns: 1,
        extraPipes: config.get("tableExtraPipes"),
        columnWidth: 1,
        columnWidths: [],
        alignment: config.get("tableAlignment"),
        alignments: []
      };
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        line = lines[_i];
        if (line.trim() === "") {
          continue;
        } else if (utils.isTableSeparator(line)) {
          separator = utils.parseTableSeparator(line);
          options.extraPipes = options.extraPipes || separator.extraPipes;
          options.alignments = separator.alignments;
          options.numOfColumns = Math.max(options.numOfColumns, separator.columns.length);
        } else {
          row = utils.parseTableRow(line);
          rows.push(row.columns);
          options.numOfColumns = Math.max(options.numOfColumns, row.columns.length);
          _ref = row.columnWidths;
          for (i = _j = 0, _len1 = _ref.length; _j < _len1; i = ++_j) {
            columnWidth = _ref[i];
            options.columnWidths[i] = Math.max(options.columnWidths[i] || 0, columnWidth);
          }
        }
      }
      return {
        rows: rows,
        options: options
      };
    };

    return FormatText;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvY29tbWFuZHMvZm9ybWF0LXRleHQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdDQUFBOztBQUFBLEVBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxXQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUNBLEtBQUEsR0FBUSxPQUFBLENBQVEsVUFBUixDQURSLENBQUE7O0FBQUEsRUFHQSxhQUFBLEdBQWdCLHVCQUhoQixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVTLElBQUEsb0JBQUMsTUFBRCxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLE1BQVYsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FEVixDQURXO0lBQUEsQ0FBYjs7QUFBQSx5QkFJQSxPQUFBLEdBQVMsU0FBQyxDQUFELEdBQUE7QUFDUCxVQUFBLEVBQUE7QUFBQSxNQUFBLEVBQUEsR0FBSyxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBZ0IsVUFBaEIsRUFBNEIsU0FBQyxDQUFELEdBQUE7ZUFBTyxDQUFFLENBQUEsQ0FBQSxDQUFFLENBQUMsV0FBTCxDQUFBLEVBQVA7TUFBQSxDQUE1QixDQUFMLENBQUE7YUFFQSxJQUFDLENBQUEsTUFBTSxDQUFDLFFBQVIsQ0FBaUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUVmLGNBQUEsMENBQUE7QUFBQSxVQUFBLGNBQUEsR0FBaUIsS0FBQyxDQUFBLE1BQU0sQ0FBQyw4QkFBUixDQUFBLENBQWpCLENBQUE7QUFBQSxVQUVBLEtBQUEsR0FBUSxLQUFDLENBQUEsTUFBTSxDQUFDLHNCQUFS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

//# sourceURL=/Users/sarah/.atom/packages/markdown-writer/lib/commands/format-text.coffee
