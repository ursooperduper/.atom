(function() {
  var BufferedNodeProcess, BufferedProcess, Helpers, TextEditor, XRegExp, fs, path, tmp, xcache, _ref;

  _ref = require('atom'), BufferedProcess = _ref.BufferedProcess, BufferedNodeProcess = _ref.BufferedNodeProcess, TextEditor = _ref.TextEditor;

  path = require('path');

  fs = require('fs');

  path = require('path');

  tmp = require('tmp');

  xcache = new Map;

  XRegExp = null;

  module.exports = Helpers = {
    exec: function(command, args, options) {
      if (args == null) {
        args = [];
      }
      if (options == null) {
        options = {};
      }
      if (!arguments.length) {
        throw new Error("Nothing to execute.");
      }
      return this._exec(command, args, options, false);
    },
    execNode: function(filePath, args, options) {
      if (args == null) {
        args = [];
      }
      if (options == null) {
        options = {};
      }
      if (!arguments.length) {
        throw new Error("Nothing to execute.");
      }
      return this._exec(filePath, args, options, true);
    },
    _exec: function(command, args, options, isNodeExecutable) {
      if (args == null) {
        args = [];
      }
      if (options == null) {
        options = {};
      }
      if (isNodeExecutable == null) {
        isNodeExecutable = false;
      }
      if (options.stream == null) {
        options.stream = 'stdout';
      }
      if (options.throwOnStdErr == null) {
        options.throwOnStdErr = true;
      }
      return new Promise(function(resolve, reject) {
        var data, exit, prop, spawnedProcess, stderr, stdout, value, _ref1;
        data = {
          stdout: [],
          stderr: []
        };
        stdout = function(output) {
          return data.stdout.push(output.toString());
        };
        stderr = function(output) {
          return data.stderr.push(output.toString());
        };
        exit = function() {
          if (options.stream === 'stdout') {
            if (data.stderr.length && options.throwOnStdErr) {
              return reject(new Error(data.stderr.join('')));
            } else {
              return resolve(data.stdout.join(''));
            }
          } else if (options.stream === 'both') {
            return resolve({
              stdout: data.stdout.join(''),
              stderr: data.stderr.join('')
            });
          } else {
            return resolve(data.stderr.join(''));
          }
        };
        if (isNodeExecutable) {
          if (options.env == null) {
            options.env = {};
          }
          _ref1 = process.env;
          for (prop in _ref1) {
            value = _ref1[prop];
            if (prop !== 'OS') {
              options.env[prop] = value;
            }
          }
          spawnedProcess = new BufferedNodeProcess({
            command: command,
            args: args,
            options: options,
            stdout: stdout,
            stderr: stderr,
            exit: exit
          });
        } else {
          spawnedProcess = new BufferedProcess({
            command: command,
            args: args,
            options: options,
            stdout: stdout,
            stderr: stderr,
            exit: exit
          });
        }
        spawnedProcess.onWillThrowError(reject);
        if (options.stdin) {
          spawnedProcess.process.stdin.write(options.stdin.toString());
          return spawnedProcess.process.stdin.end();
        }
      });
    },
    rangeFromLineNumber: function(textEditor, lineNumber, colStart) {
      if (!(textEditor instanceof TextEditor)) {
        throw new Error('Provided text editor is invalid');
      }
      if (typeof lineNumber === 'undefined') {
        throw new Error('Invalid lineNumber provided');
      }
      if (typeof colStart !== 'number') {
        colStart = textEditor.indentationForBufferRow(lineNumber) * textEditor.getTabLength();
      }
      return [[lineNumber, colStart], [lineNumber, textEditor.getBuffer().lineLengthForRow(lineNumber)]];
    },
    parse: function(data, rawRegex, options) {
      var colEnd, colStart, filePath, line, lineEnd, lineStart, match, regex, toReturn, _i, _len, _ref1;
      if (options == null) {
        options = {
          baseReduction: 1
        };
      }
      if (!arguments.length) {
        throw new Error("Nothing to parse");
      }
      if (XRegExp == null) {
        XRegExp = require('xregexp').XRegExp;
      }
      toReturn = [];
      if (xcache.has(rawRegex)) {
        regex = xcache.get(rawRegex);
      } else {
        xcache.set(rawRegex, regex = XRegExp(rawRegex));
      }
      if (typeof data !== 'string') {
        throw new Error("Input must be a string");
      }
      _ref1 = data.split(/\r?\n/);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        line = _ref1[_i];
        match = XRegExp.exec(line, regex);
        if (match) {
          if (!options.baseReduction) {
            options.baseReduction = 1;
          }
          lineStart = 0;
          if (match.line) {
            lineStart = match.line - options.baseReduction;
          }
          if (match.lineStart) {
            lineStart = match.lineStart - options.baseReduction;
          }
          colStart = 0;
          if (match.col) {
            colStart = match.col - options.baseReduction;
          }
          if (match.colStart) {
            colStart = match.colStart - options.baseReduction;
          }
          lineEnd = 0;
          if (match.line) {
            lineEnd = match.line - options.baseReduction;
          }
          if (match.lineEnd) {
            lineEnd = match.lineEnd - options.baseReduction;
          }
          colEnd = 0;
          if (match.col) {
            colEnd = match.col - options.baseReduction;
          }
          if (match.colEnd) {
            colEnd = match.colEnd - options.baseReduction;
          }
          filePath = match.file;
          if (options.filePath) {
            filePath = options.filePath;
          }
          toReturn.push({
            type: match.type,
            text: match.message,
            filePath: filePath,
            range: [[lineStart, colStart], [lineEnd, colEnd]]
          });
        }
      }
      return toReturn;
    },
    findFile: function(startDir, names) {
      var currentDir, filePath, name, _i, _len;
      if (!arguments.length) {
        throw new Error("Specify a filename to find");
      }
      if (!(names instanceof Array)) {
        names = [names];
      }
      startDir = startDir.split(path.sep);
      while (startDir.length && startDir.join(path.sep)) {
        currentDir = startDir.join(path.sep);
        for (_i = 0, _len = names.length; _i < _len; _i++) {
          name = names[_i];
          filePath = path.join(currentDir, name);
          try {
            fs.accessSync(filePath, fs.R_OK);
            return filePath;
          } catch (_error) {}
        }
        startDir.pop();
      }
      return null;
    },
    tempFile: function(fileName, fileContents, callback) {
      if (typeof fileName !== 'string') {
        throw new Error('Invalid fileName provided');
      }
      if (typeof fileContents !== 'string') {
        throw new Error('Invalid fileContent provided');
      }
      if (typeof callback !== 'function') {
        throw new Error('Invalid Callback provided');
      }
      return new Promise(function(resolve, reject) {
        return tmp.dir({
          prefix: 'atom-linter_'
        }, function(err, dirPath, cleanupCallback) {
          var filePath;
          if (err) {
            return reject(err);
          }
          filePath = path.join(dirPath, fileName);
          return fs.writeFile(filePath, fileContents, function(err) {
            if (err) {
              cleanupCallback();
              return reject(err);
            }
            return (new Promise(function(resolve) {
              return resolve(callback(filePath));
            })).then(function(result) {
              fs.unlink(filePath, function() {
                return fs.rmdir(dirPath);
              });
              return result;
            }).then(resolve, reject);
          });
        });
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1qc2hpbnQvbm9kZV9tb2R1bGVzL2F0b20tbGludGVyL2xpYi9oZWxwZXJzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrRkFBQTs7QUFBQSxFQUFBLE9BQXFELE9BQUEsQ0FBUSxNQUFSLENBQXJELEVBQUMsdUJBQUEsZUFBRCxFQUFrQiwyQkFBQSxtQkFBbEIsRUFBdUMsa0JBQUEsVUFBdkMsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FGTCxDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUlBLEdBQUEsR0FBTSxPQUFBLENBQVEsS0FBUixDQUpOLENBQUE7O0FBQUEsRUFNQSxNQUFBLEdBQVMsR0FBQSxDQUFBLEdBTlQsQ0FBQTs7QUFBQSxFQU9BLE9BQUEsR0FBVSxJQVBWLENBQUE7O0FBQUEsRUFTQSxNQUFNLENBQUMsT0FBUCxHQUFpQixPQUFBLEdBSWY7QUFBQSxJQUFBLElBQUEsRUFBTSxTQUFDLE9BQUQsRUFBVSxJQUFWLEVBQXFCLE9BQXJCLEdBQUE7O1FBQVUsT0FBTztPQUNyQjs7UUFEeUIsVUFBVTtPQUNuQztBQUFBLE1BQUEsSUFBQSxDQUFBLFNBQXNELENBQUMsTUFBdkQ7QUFBQSxjQUFVLElBQUEsS0FBQSxDQUFNLHFCQUFOLENBQVYsQ0FBQTtPQUFBO0FBQ0EsYUFBTyxJQUFDLENBQUEsS0FBRCxDQUFPLE9BQVAsRUFBZ0IsSUFBaEIsRUFBc0IsT0FBdEIsRUFBK0IsS0FBL0IsQ0FBUCxDQUZJO0lBQUEsQ0FBTjtBQUFBLElBSUEsUUFBQSxFQUFVLFNBQUMsUUFBRCxFQUFXLElBQVgsRUFBc0IsT0FBdEIsR0FBQTs7UUFBVyxPQUFPO09BQzFCOztRQUQ4QixVQUFVO09BQ3hDO0FBQUEsTUFBQSxJQUFBLENBQUEsU0FBc0QsQ0FBQyxNQUF2RDtBQUFBLGNBQVUsSUFBQSxLQUFBLENBQU0scUJBQU4sQ0FBVixDQUFBO09BQUE7QUFDQSxhQUFPLElBQUMsQ0FBQSxLQUFELENBQU8sUUFBUCxFQUFpQixJQUFqQixFQUF1QixPQUF2QixFQUFnQyxJQUFoQyxDQUFQLENBRlE7SUFBQSxDQUpWO0FBQUEsSUFRQSxLQUFBLEVBQU8sU0FBQyxPQUFELEVBQVUsSUFBVixFQUFxQixPQUFyQixFQUFtQyxnQkFBbkMsR0FBQTs7UUFBVSxPQUFPO09BQ3RCOztRQUQwQixVQUFVO09BQ3BDOztRQUR3QyxtQkFBbUI7T0FDM0Q7O1FBQUEsT0FBTyxDQUFDLFNBQVU7T0FBbEI7O1FBQ0EsT0FBTyxDQUFDLGdCQUFpQjtPQUR6QjtBQUVBLGFBQVcsSUFBQSxPQUFBLENBQVEsU0FBQyxPQUFELEVBQVUsTUFBVixHQUFBO0FBQ2pCLFlBQUEsOERBQUE7QUFBQSxRQUFBLElBQUEsR0FBTztBQUFBLFVBQUEsTUFBQSxFQUFRLEVBQVI7QUFBQSxVQUFZLE1BQUEsRUFBUSxFQUFwQjtTQUFQLENBQUE7QUFBQSxRQUNBLE1BQUEsR0FBUyxTQUFDLE1BQUQsR0FBQTtpQkFBWSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQVosQ0FBaUIsTUFBTSxDQUFDLFFBQVAsQ0FBQSxDQUFqQixFQUFaO1FBQUEsQ0FEVCxDQUFBO0FBQUEsUUFFQSxNQUFBLEdBQVMsU0FBQyxNQUFELEdBQUE7aUJBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFaLENBQWlCLE1BQU0sQ0FBQyxRQUFQLENBQUEsQ0FBakIsRUFBWjtRQUFBLENBRlQsQ0FBQTtBQUFBLFFBR0EsSUFBQSxHQUFPLFNBQUEsR0FBQTtBQUNMLFVBQUEsSUFBRyxPQUFPLENBQUMsTUFBUixLQUFrQixRQUFyQjtBQUNFLFlBQUEsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQVosSUFBdUIsT0FBTyxDQUFDLGFBQWxDO3FCQUNFLE1BQUEsQ0FBVyxJQUFBLEtBQUEsQ0FBTSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQVosQ0FBaUIsRUFBakIsQ0FBTixDQUFYLEVBREY7YUFBQSxNQUFBO3FCQUdFLE9BQUEsQ0FBUSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQVosQ0FBaUIsRUFBakIsQ0FBUixFQUhGO2FBREY7V0FBQSxNQUtLLElBQUcsT0FBTyxDQUFDLE1BQVIsS0FBa0IsTUFBckI7bUJBQ0gsT0FBQSxDQUFRO0FBQUEsY0FBQSxNQUFBLEVBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFaLENBQWlCLEVBQWpCLENBQVI7QUFBQSxjQUE4QixNQUFBLEVBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFaLENBQWlCLEVBQWpCLENBQXRDO2FBQVIsRUFERztXQUFBLE1BQUE7bUJBR0gsT0FBQSxDQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBWixDQUFpQixFQUFqQixDQUFSLEVBSEc7V0FOQTtRQUFBLENBSFAsQ0FBQTtBQWFBLFFBQUEsSUFBRyxnQkFBSDs7WUFDRSxPQUFPLENBQUMsTUFBTztXQUFmO0FBQ0E7QUFBQSxlQUFBLGFBQUE7Z0NBQUE7QUFDRSxZQUFBLElBQWlDLElBQUEsS0FBUSxJQUF6QztBQUFBLGNBQUEsT0FBTyxDQUFDLEdBQUksQ0FBQSxJQUFBLENBQVosR0FBb0IsS0FBcEIsQ0FBQTthQURGO0FBQUEsV0FEQTtBQUFBLFVBR0EsY0FBQSxHQUFxQixJQUFBLG1CQUFBLENBQW9CO0FBQUEsWUFBQyxTQUFBLE9BQUQ7QUFBQSxZQUFVLE1BQUEsSUFBVjtBQUFBLFlBQWdCLFNBQUEsT0FBaEI7QUFBQSxZQUF5QixRQUFBLE1BQXpCO0FBQUEsWUFBaUMsUUFBQSxNQUFqQztBQUFBLFlBQXlDLE1BQUEsSUFBekM7V0FBcEIsQ0FIckIsQ0FERjtTQUFBLE1BQUE7QUFNRSxVQUFBLGNBQUEsR0FBcUIsSUFBQSxlQUFBLENBQWdCO0FBQUEsWUFBQyxTQUFBLE9BQUQ7QUFBQSxZQUFVLE1BQUEsSUFBVjtBQUFBLFlBQWdCLFNBQUEsT0FBaEI7QUFBQSxZQUF5QixRQUFBLE1BQXpCO0FBQUEsWUFBaUMsUUFBQSxNQUFqQztBQUFBLFlBQXlDLE1BQUEsSUFBekM7V0FBaEIsQ0FBckIsQ0FORjtTQWJBO0FBQUEsUUFvQkEsY0FBYyxDQUFDLGdCQUFmLENBQWdDLE1BQWhDLENBcEJBLENBQUE7QUFxQkEsUUFBQSxJQUFHLE9BQU8sQ0FBQyxLQUFYO0FBQ0UsVUFBQSxjQUFjLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUE3QixDQUFtQyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQWQsQ0FBQSxDQUFuQyxDQUFBLENBQUE7aUJBQ0EsY0FBYyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBN0IsQ0FBQSxFQUZGO1NBdEJpQjtNQUFBLENBQVIsQ0FBWCxDQUhLO0lBQUEsQ0FSUDtBQUFBLElBcUNBLG1CQUFBLEVBQXFCLFNBQUMsVUFBRCxFQUFhLFVBQWIsRUFBeUIsUUFBekIsR0FBQTtBQUNuQixNQUFBLElBQUEsQ0FBQSxDQUEwRCxVQUFBLFlBQXNCLFVBQWhGLENBQUE7QUFBQSxjQUFVLElBQUEsS0FBQSxDQUFNLGlDQUFOLENBQVYsQ0FBQTtPQUFBO0FBQ0EsTUFBQSxJQUFrRCxNQUFBLENBQUEsVUFBQSxLQUFxQixXQUF2RTtBQUFBLGNBQVUsSUFBQSxLQUFBLENBQU0sNkJBQU4sQ0FBVixDQUFBO09BREE7QUFFQSxNQUFBLElBQU8sTUFBQSxDQUFBLFFBQUEsS0FBbUIsUUFBMUI7QUFDRSxRQUFBLFFBQUEsR0FBWSxVQUFVLENBQUMsdUJBQVgsQ0FBbUMsVUFBbkMsQ0FBQSxHQUFpRCxVQUFVLENBQUMsWUFBWCxDQUFBLENBQTdELENBREY7T0FGQTtBQUlBLGFBQU8sQ0FDTCxDQUFDLFVBQUQsRUFBYSxRQUFiLENBREssRUFFTCxDQUFDLFVBQUQsRUFBYSxVQUFVLENBQUMsU0FBWCxDQUFBLENBQXNCLENBQUMsZ0JBQXZCLENBQXdDLFVBQXhDLENBQWIsQ0FGSyxDQUFQLENBTG1CO0lBQUEsQ0FyQ3JCO0FBQUEsSUFnRUEsS0FBQSxFQUFPLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakIsR0FBQTtBQUNMLFVBQUEsNkZBQUE7O1FBRHNCLFVBQVU7QUFBQSxVQUFDLGFBQUEsRUFBZSxDQUFoQjs7T0FDaEM7QUFBQSxNQUFBLElBQUEsQ0FBQSxTQUFtRCxDQUFDLE1BQXBEO0FBQUEsY0FBVSxJQUFBLEtBQUEsQ0FBTSxrQkFBTixDQUFWLENBQUE7T0FBQTs7UUFDQSxVQUFXLE9BQUEsQ0FBUSxTQUFSLENBQWtCLENBQUM7T0FEOUI7QUFBQSxNQUVBLFFBQUEsR0FBVyxFQUZYLENBQUE7QUFHQSxNQUFBLElBQUcsTUFBTSxDQUFDLEdBQVAsQ0FBVyxRQUFYLENBQUg7QUFDRSxRQUFBLEtBQUEsR0FBUSxNQUFNLENBQUMsR0FBUCxDQUFXLFFBQVgsQ0FBUixDQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsTUFBTSxDQUFDLEdBQVAsQ0FBVyxRQUFYLEVBQXFCLEtBQUEsR0FBUSxPQUFBLENBQVEsUUFBUixDQUE3QixDQUFBLENBSEY7T0FIQTtBQU9BLE1BQUEsSUFBaUQsTUFBQSxDQUFBLElBQUEsS0FBZSxRQUFoRTtBQUFBLGNBQVUsSUFBQSxLQUFBLENBQU0sd0JBQU4sQ0FBVixDQUFBO09BUEE7QUFRQTtBQUFBLFdBQUEsNENBQUE7eUJBQUE7QUFDRSxRQUFBLEtBQUEsR0FBUSxPQUFPLENBQUMsSUFBUixDQUFhLElBQWIsRUFBbUIsS0FBbkIsQ0FBUixDQUFBO0FBQ0EsUUFBQSxJQUFHLEtBQUg7QUFDRSxVQUFBLElBQUEsQ0FBQSxPQUF3QyxDQUFDLGFBQXpDO0FBQUEsWUFBQSxPQUFPLENBQUMsYUFBUixHQUF3QixDQUF4QixDQUFBO1dBQUE7QUFBQSxVQUNBLFNBQUEsR0FBWSxDQURaLENBQUE7QUFFQSxVQUFBLElBQWtELEtBQUssQ0FBQyxJQUF4RDtBQUFBLFlBQUEsU0FBQSxHQUFZLEtBQUssQ0FBQyxJQUFOLEdBQWEsT0FBTyxDQUFDLGFBQWpDLENBQUE7V0FGQTtBQUdBLFVBQUEsSUFBdUQsS0FBSyxDQUFDLFNBQTdEO0FBQUEsWUFBQSxTQUFBLEdBQVksS0FBSyxDQUFDLFNBQU4sR0FBa0IsT0FBTyxDQUFDLGFBQXRDLENBQUE7V0FIQTtBQUFBLFVBSUEsUUFBQSxHQUFXLENBSlgsQ0FBQTtBQUtBLFVBQUEsSUFBZ0QsS0FBSyxDQUFDLEdBQXREO0FBQUEsWUFBQSxRQUFBLEdBQVcsS0FBSyxDQUFDLEdBQU4sR0FBWSxPQUFPLENBQUMsYUFBL0IsQ0FBQTtXQUxBO0FBTUEsVUFBQSxJQUFxRCxLQUFLLENBQUMsUUFBM0Q7QUFBQSxZQUFBLFFBQUEsR0FBVyxLQUFLLENBQUMsUUFBTixHQUFpQixPQUFPLENBQUMsYUFBcEMsQ0FBQTtXQU5BO0FBQUEsVUFPQSxPQUFBLEdBQVUsQ0FQVixDQUFBO0FBUUEsVUFBQSxJQUFnRCxLQUFLLENBQUMsSUFBdEQ7QUFBQSxZQUFBLE9BQUEsR0FBVSxLQUFLLENBQUMsSUFBTixHQUFhLE9BQU8sQ0FBQyxhQUEvQixDQUFBO1dBUkE7QUFTQSxVQUFBLElBQW1ELEtBQUssQ0FBQyxPQUF6RDtBQUFBLFlBQUEsT0FBQSxHQUFVLEtBQUssQ0FBQyxPQUFOLEdBQWdCLE9BQU8sQ0FBQyxhQUFsQyxDQUFBO1dBVEE7QUFBQSxVQVVBLE1BQUEsR0FBUyxDQVZULENBQUE7QUFXQSxVQUFBLElBQThDLEtBQUssQ0FBQyxHQUFwRDtBQUFBLFlBQUEsTUFBQSxHQUFTLEtBQUssQ0FBQyxHQUFOLEdBQVksT0FBTyxDQUFDLGFBQTdCLENBQUE7V0FYQTtBQVlBLFVBQUEsSUFBaUQsS0FBSyxDQUFDLE1BQXZEO0FBQUEsWUFBQSxNQUFBLEdBQVMsS0FBSyxDQUFDLE1BQU4sR0FBZSxPQUFPLENBQUMsYUFBaEMsQ0FBQTtXQVpBO0FBQUEsVUFhQSxRQUFBLEdBQVcsS0FBSyxDQUFDLElBYmpCLENBQUE7QUFjQSxVQUFBLElBQStCLE9BQU8sQ0FBQyxRQUF2QztBQUFBLFlBQUEsUUFBQSxHQUFXLE9BQU8sQ0FBQyxRQUFuQixDQUFBO1dBZEE7QUFBQSxVQWVBLFFBQVEsQ0FBQyxJQUFULENBQ0U7QUFBQSxZQUFBLElBQUEsRUFBTSxLQUFLLENBQUMsSUFBWjtBQUFBLFlBQ0EsSUFBQSxFQUFNLEtBQUssQ0FBQyxPQURaO0FBQUEsWUFFQSxRQUFBLEVBQVUsUUFGVjtBQUFBLFlBR0EsS0FBQSxFQUFPLENBQUMsQ0FBQyxTQUFELEVBQVksUUFBWixDQUFELEVBQXdCLENBQUMsT0FBRCxFQUFVLE1BQVYsQ0FBeEIsQ0FIUDtXQURGLENBZkEsQ0FERjtTQUZGO0FBQUEsT0FSQTtBQWdDQSxhQUFPLFFBQVAsQ0FqQ0s7SUFBQSxDQWhFUDtBQUFBLElBa0dBLFFBQUEsRUFBVSxTQUFDLFFBQUQsRUFBVyxLQUFYLEdBQUE7QUFDUixVQUFBLG9DQUFBO0FBQUEsTUFBQSxJQUFBLENBQUEsU0FBNkQsQ0FBQyxNQUE5RDtBQUFBLGNBQVUsSUFBQSxLQUFBLENBQU0sNEJBQU4sQ0FBVixDQUFBO09BQUE7QUFDQSxNQUFBLElBQUEsQ0FBQSxDQUFPLEtBQUEsWUFBaUIsS0FBeEIsQ0FBQTtBQUNFLFFBQUEsS0FBQSxHQUFRLENBQUMsS0FBRCxDQUFSLENBREY7T0FEQTtBQUFBLE1BR0EsUUFBQSxHQUFXLFFBQVEsQ0FBQyxLQUFULENBQWUsSUFBSSxDQUFDLEdBQXBCLENBSFgsQ0FBQTtBQUlBLGFBQU0sUUFBUSxDQUFDLE1BQVQsSUFBbUIsUUFBUSxDQUFDLElBQVQsQ0FBYyxJQUFJLENBQUMsR0FBbkIsQ0FBekIsR0FBQTtBQUNFLFFBQUEsVUFBQSxHQUFhLFFBQVEsQ0FBQyxJQUFULENBQWMsSUFBSSxDQUFDLEdBQW5CLENBQWIsQ0FBQTtBQUNBLGFBQUEsNENBQUE7MkJBQUE7QUFDRSxVQUFBLFFBQUEsR0FBVyxJQUFJLENBQUMsSUFBTCxDQUFVLFVBQVYsRUFBc0IsSUFBdEIsQ0FBWCxDQUFBO0FBQ0E7QUFDRSxZQUFBLEVBQUUsQ0FBQyxVQUFILENBQWMsUUFBZCxFQUF3QixFQUFFLENBQUMsSUFBM0IsQ0FBQSxDQUFBO0FBQ0EsbUJBQU8sUUFBUCxDQUZGO1dBQUEsa0JBRkY7QUFBQSxTQURBO0FBQUEsUUFNQSxRQUFRLENBQUMsR0FBVCxDQUFBLENBTkEsQ0FERjtNQUFBLENBSkE7QUFZQSxhQUFPLElBQVAsQ0FiUTtJQUFBLENBbEdWO0FBQUEsSUFnSEEsUUFBQSxFQUFVLFNBQUMsUUFBRCxFQUFXLFlBQVgsRUFBeUIsUUFBekIsR0FBQTtBQUNSLE1BQUEsSUFBb0QsTUFBQSxDQUFBLFFBQUEsS0FBbUIsUUFBdkU7QUFBQSxjQUFVLElBQUEsS0FBQSxDQUFNLDJCQUFOLENBQVYsQ0FBQTtPQUFBO0FBQ0EsTUFBQSxJQUF1RCxNQUFBLENBQUEsWUFBQSxLQUF1QixRQUE5RTtBQUFBLGNBQVUsSUFBQSxLQUFBLENBQU0sOEJBQU4sQ0FBVixDQUFBO09BREE7QUFFQSxNQUFBLElBQW9ELE1BQUEsQ0FBQSxRQUFBLEtBQW1CLFVBQXZFO0FBQUEsY0FBVSxJQUFBLEtBQUEsQ0FBTSwyQkFBTixDQUFWLENBQUE7T0FGQTtBQUlBLGFBQVcsSUFBQSxPQUFBLENBQVEsU0FBQyxPQUFELEVBQVUsTUFBVixHQUFBO2VBQ2pCLEdBQUcsQ0FBQyxHQUFKLENBQVE7QUFBQSxVQUFDLE1BQUEsRUFBUSxjQUFUO1NBQVIsRUFBa0MsU0FBQyxHQUFELEVBQU0sT0FBTixFQUFlLGVBQWYsR0FBQTtBQUNoQyxjQUFBLFFBQUE7QUFBQSxVQUFBLElBQXNCLEdBQXRCO0FBQUEsbUJBQU8sTUFBQSxDQUFPLEdBQVAsQ0FBUCxDQUFBO1dBQUE7QUFBQSxVQUNBLFFBQUEsR0FBVyxJQUFJLENBQUMsSUFBTCxDQUFVLE9BQVYsRUFBbUIsUUFBbkIsQ0FEWCxDQUFBO2lCQUVBLEVBQUUsQ0FBQyxTQUFILENBQWEsUUFBYixFQUF1QixZQUF2QixFQUFxQyxTQUFDLEdBQUQsR0FBQTtBQUNuQyxZQUFBLElBQUcsR0FBSDtBQUNFLGNBQUEsZUFBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLHFCQUFPLE1BQUEsQ0FBTyxHQUFQLENBQVAsQ0FGRjthQUFBO21CQUdBLENBQ00sSUFBQSxPQUFBLENBQVEsU0FBQyxPQUFELEdBQUE7cUJBQ1YsT0FBQSxDQUFRLFFBQUEsQ0FBUyxRQUFULENBQVIsRUFEVTtZQUFBLENBQVIsQ0FETixDQUdDLENBQUMsSUFIRixDQUdPLFNBQUMsTUFBRCxHQUFBO0FBQ0wsY0FBQSxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsU0FBQSxHQUFBO3VCQUNsQixFQUFFLENBQUMsS0FBSCxDQUFTLE9BQVQsRUFEa0I7Y0FBQSxDQUFwQixDQUFBLENBQUE7QUFHQSxxQkFBTyxNQUFQLENBSks7WUFBQSxDQUhQLENBUUMsQ0FBQyxJQVJGLENBUU8sT0FSUCxFQVFnQixNQVJoQixFQUptQztVQUFBLENBQXJDLEVBSGdDO1FBQUEsQ0FBbEMsRUFEaUI7TUFBQSxDQUFSLENBQVgsQ0FMUTtJQUFBLENBaEhWO0dBYkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/sarah/.atom/packages/linter-jshint/node_modules/atom-linter/lib/helpers.coffee
