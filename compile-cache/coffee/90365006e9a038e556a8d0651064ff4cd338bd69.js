(function() {
  var Tabularize, _;

  _ = require('underscore');

  module.exports = Tabularize = (function() {
    function Tabularize() {}

    Tabularize.tabularize = function(separator, editor) {
      _(editor.getSelections()).each(function(selection) {
        var first_row, last_column, last_row, range;
        range = selection.getBufferRange();
        first_row = range.start.row;
        last_row = range.end.row;
        last_column = range.end.column;
        selection.setBufferRange([[first_row, 0], [last_row, last_column]]);
        if (!selection.isReversed()) {
          return selection.selectToEndOfLine();
        }
      });
      return editor.mutateSelectedText(function(selection, index) {
        var i, lines, matches, num_columns, padded_columns, padded_lines, result, separator_regex, stripped_lines;
        separator_regex = RegExp(separator, 'g');
        lines = selection.getText().split("\n");
        matches = [];
        lines = _(lines).map(function(line) {
          matches.push(line.match(separator_regex) || "");
          return line.split(separator_regex);
        });
        stripped_lines = Tabularize.stripSpaces(lines);
        num_columns = _.chain(stripped_lines).map(function(cells) {
          return cells.length;
        }).max().value();
        padded_columns = (function() {
          var _i, _ref, _results;
          _results = [];
          for (i = _i = 0, _ref = num_columns - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
            _results.push(Tabularize.paddingColumn(i, stripped_lines));
          }
          return _results;
        })();
        padded_lines = (function() {
          var _i, _ref, _results;
          _results = [];
          for (i = _i = 0, _ref = lines.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
            _results.push(Tabularize.paddedLine(i, padded_columns));
          }
          return _results;
        })();
        result = _.chain(padded_lines).zip(matches).map(function(e) {
          var line;
          line = _(e).first();
          matches = _(e).last();
          line = _.chain(line).zip(matches).flatten().compact().value().join(' ');
          return Tabularize.stripTrailingWhitespace(line);
        }).value().join("\n");
        return selection.insertText(result);
      });
    };

    Tabularize.leftAlign = function(string, fieldWidth) {
      var right, spaces;
      spaces = fieldWidth - string.length;
      right = spaces;
      return "" + string + (Tabularize.repeatPadding(right));
    };

    Tabularize.stripTrailingWhitespace = function(text) {
      return text.replace(/\s+$/g, "");
    };

    Tabularize.repeatPadding = function(size) {
      return Array(size + 1).join(' ');
    };

    Tabularize.paddingColumn = function(col_index, matrix) {
      var cell, cell_size, column, _i, _len, _results;
      cell_size = 0;
      column = _(matrix).map(function(line) {
        if (line.length > col_index) {
          if (cell_size < line[col_index].length) {
            cell_size = line[col_index].length;
          }
          return line[col_index];
        } else {
          return "";
        }
      });
      _results = [];
      for (_i = 0, _len = column.length; _i < _len; _i++) {
        cell = column[_i];
        _results.push(Tabularize.leftAlign(cell, cell_size));
      }
      return _results;
    };

    Tabularize.paddedLine = function(line_index, columns) {
      return _.chain(columns).map(function(column) {
        return column[line_index];
      }).compact().value();
    };

    Tabularize.stripSpaces = function(lines) {
      return _.map(lines, function(cells) {
        return cells = _.map(cells, function(cell, i) {
          if (i === 0) {
            return Tabularize.stripTrailingWhitespace(cell);
          } else {
            return cell.trim();
          }
        });
      });
    };

    return Tabularize;

  })();

}).call(this);
