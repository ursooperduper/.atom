(function() {
  var BufferedProcess, Linter, Point, Range, XRegExp, fs, log, path, warn, _, _ref, _ref1;

  fs = require('fs');

  path = require('path');

  _ref = require('atom'), Range = _ref.Range, Point = _ref.Point, BufferedProcess = _ref.BufferedProcess;

  _ = require('lodash');

  XRegExp = require('xregexp').XRegExp;

  _ref1 = require('./utils'), log = _ref1.log, warn = _ref1.warn;

  Linter = (function() {
    Linter.syntax = '';

    Linter.prototype.cmd = '';

    Linter.prototype.regex = '';

    Linter.prototype.regexFlags = '';

    Linter.prototype.cwd = null;

    Linter.prototype.defaultLevel = 'error';

    Linter.prototype.linterName = null;

    Linter.prototype.executablePath = null;

    Linter.prototype.isNodeExecutable = false;

    Linter.prototype.errorStream = 'stdout';

    function Linter(editor) {
      this.editor = editor;
      this.cwd = path.dirname(this.editor.getUri());
    }

    Linter.prototype._cachedStatSync = _.memoize(function(path) {
      return fs.statSync(path);
    });

    Linter.prototype.getCmdAndArgs = function(filePath) {
      var cmd, cmd_list, stats;
      cmd = this.cmd;
      cmd_list = Array.isArray(cmd) ? cmd.slice() : cmd.split(' ');
      cmd_list.push(filePath);
      if (this.executablePath) {
        stats = this._cachedStatSync(this.executablePath);
        if (stats.isDirectory()) {
          cmd_list[0] = path.join(this.executablePath, cmd_list[0]);
        } else {
          cmd_list[0] = this.executablePath;
        }
      }
      if (this.isNodeExecutable) {
        cmd_list.unshift(this.getNodeExecutablePath());
      }
      cmd_list = cmd_list.map(function(cmd_item) {
        if (/@filename/i.test(cmd_item)) {
          return cmd_item.replace(/@filename/gi, filePath);
        }
        if (/@tempdir/i.test(cmd_item)) {
          return cmd_item.replace(/@tempdir/gi, path.dirname(filePath));
        } else {
          return cmd_item;
        }
      });
      log('command and arguments', cmd_list);
      return {
        command: cmd_list[0],
        args: cmd_list.slice(1)
      };
    };

    Linter.prototype.getReportFilePath = function(filePath) {
      return path.join(path.dirname(filePath), this.reportFilePath);
    };

    Linter.prototype.getNodeExecutablePath = function() {
      return path.join(atom.packages.apmPath, '..', 'node');
    };

    Linter.prototype.lintFile = function(filePath, callback) {
      var args, command, dataStderr, dataStdout, exit, exited, options, process, stderr, stdout, timeout_s, _ref2;
      _ref2 = this.getCmdAndArgs(filePath), command = _ref2.command, args = _ref2.args;
      log('is node executable: ' + this.isNodeExecutable);
      options = {
        cwd: this.cwd
      };
      dataStdout = [];
      dataStderr = [];
      exited = false;
      stdout = function(output) {
        log('stdout', output);
        return dataStdout += output;
      };
      stderr = function(output) {
        warn('stderr', output);
        return dataStderr += output;
      };
      exit = (function(_this) {
        return function() {
          var data, reportFilePath;
          exited = true;
          switch (_this.errorStream) {
            case 'file':
              reportFilePath = _this.getReportFilePath(filePath);
              if (fs.existsSync(reportFilePath)) {
                data = fs.readFileSync(reportFilePath);
              }
              break;
            case 'stdout':
              data = dataStdout;
              break;
            default:
              data = dataStderr;
          }
          return _this.processMessage(data, callback);
        };
      })(this);
      process = new BufferedProcess({
        command: command,
        args: args,
        options: options,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
      timeout_s = 5;
      return setTimeout(function() {
        if (exited) {
          return;
        }
        process.kill();
        return warn("command `" + command + "` timed out after " + timeout_s + "s");
      }, timeout_s * 1000);
    };

    Linter.prototype.processMessage = function(message, callback) {
      var messages, regex;
      messages = [];
      regex = XRegExp(this.regex, this.regexFlags);
      XRegExp.forEach(message, regex, (function(_this) {
        return function(match, i) {
          var msg;
          msg = _this.createMessage(match);
          if (msg.range != null) {
            return messages.push(msg);
          }
        };
      })(this), this);
      return callback(messages);
    };

    Linter.prototype.createMessage = function(match) {
      var level;
      if (match.error) {
        level = 'error';
      } else if (match.warning) {
        level = 'warning';
      } else {
        level = this.defaultLevel;
      }
      if (match.line == null) {
        match.line = 0;
      }
      if (match.col == null) {
        match.col = 0;
      }
      return {
        line: match.line,
        col: match.col,
        level: level,
        message: this.formatMessage(match),
        linter: this.linterName,
        range: this.computeRange(match)
      };
    };

    Linter.prototype.formatMessage = function(match) {
      return match.message;
    };

    Linter.prototype.lineLengthForRow = function(row) {
      var text;
      text = this.editor.lineTextForBufferRow(row);
      return (text != null ? text.length : void 0) || 0;
    };

    Linter.prototype.getEditorScopesForPosition = function(position) {
      try {
        return _.clone(this.editor.displayBuffer.tokenizedBuffer.scopesForPosition(position));
      } catch (_error) {
        return [];
      }
    };

    Linter.prototype.getGetRangeForScopeAtPosition = function(innerMostScope, position) {
      return this.editor.displayBuffer.tokenizedBuffer.bufferRangeForScopeAtPosition(innerMostScope, position);
    };

    Linter.prototype.computeRange = function(match) {
      var colEnd, colStart, decrementParse, innerMostScope, position, range, rowEnd, rowStart, scopes, _ref2, _ref3, _ref4;
      decrementParse = function(x) {
        return Math.max(0, parseInt(x) - 1);
      };
      rowStart = decrementParse((_ref2 = match.lineStart) != null ? _ref2 : match.line);
      rowEnd = decrementParse((_ref3 = (_ref4 = match.lineEnd) != null ? _ref4 : match.line) != null ? _ref3 : rowStart);
      if (rowEnd >= this.editor.getLineCount()) {
        log("ignoring " + match + " - it's longer than the buffer");
        return null;
      }
      if (!match.colStart) {
        position = new Point(rowStart, match.col);
        scopes = this.getEditorScopesForPosition(position);
        while (innerMostScope = scopes.pop()) {
          range = this.getGetRangeForScopeAtPosition(innerMostScope, position);
          if (range != null) {
            return range;
          }
        }
      }
      if (match.colStart == null) {
        match.colStart = match.col;
      }
      colStart = decrementParse(match.colStart);
      colEnd = match.colEnd != null ? decrementParse(match.colEnd) : parseInt(this.lineLengthForRow(rowEnd));
      if (colStart === colEnd) {
        colStart = decrementParse(colStart);
      }
      return new Range([rowStart, colStart], [rowEnd, colEnd]);
    };

    return Linter;

  })();

  module.exports = Linter;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1GQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxPQUFrQyxPQUFBLENBQVEsTUFBUixDQUFsQyxFQUFDLGFBQUEsS0FBRCxFQUFRLGFBQUEsS0FBUixFQUFlLHVCQUFBLGVBRmYsQ0FBQTs7QUFBQSxFQUdBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQUhKLENBQUE7O0FBQUEsRUFJQyxVQUFXLE9BQUEsQ0FBUSxTQUFSLEVBQVgsT0FKRCxDQUFBOztBQUFBLEVBS0EsUUFBYyxPQUFBLENBQVEsU0FBUixDQUFkLEVBQUMsWUFBQSxHQUFELEVBQU0sYUFBQSxJQUxOLENBQUE7O0FBQUEsRUFTTTtBQUlKLElBQUEsTUFBQyxDQUFBLE1BQUQsR0FBUyxFQUFULENBQUE7O0FBQUEscUJBSUEsR0FBQSxHQUFLLEVBSkwsQ0FBQTs7QUFBQSxxQkFpQkEsS0FBQSxHQUFPLEVBakJQLENBQUE7O0FBQUEscUJBbUJBLFVBQUEsR0FBWSxFQW5CWixDQUFBOztBQUFBLHFCQXNCQSxHQUFBLEdBQUssSUF0QkwsQ0FBQTs7QUFBQSxxQkF3QkEsWUFBQSxHQUFjLE9BeEJkLENBQUE7O0FBQUEscUJBMEJBLFVBQUEsR0FBWSxJQTFCWixDQUFBOztBQUFBLHFCQTRCQSxjQUFBLEdBQWdCLElBNUJoQixDQUFBOztBQUFBLHFCQThCQSxnQkFBQSxHQUFrQixLQTlCbEIsQ0FBQTs7QUFBQSxxQkFpQ0EsV0FBQSxHQUFhLFFBakNiLENBQUE7O0FBb0NhLElBQUEsZ0JBQUUsTUFBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsU0FBQSxNQUNiLENBQUE7QUFB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
//# sourceURL=/Users/sarah/.atom/packages/linter/lib/linter.coffee