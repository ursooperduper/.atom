(function() {
  var BufferedProcess, ClangFlags, ClangProvider, CompositeDisposable, LanguageUtil, Point, Range, TextEditor, existsSync, path, _ref;

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range, BufferedProcess = _ref.BufferedProcess, TextEditor = _ref.TextEditor, CompositeDisposable = _ref.CompositeDisposable;

  path = require('path');

  existsSync = require('fs').existsSync;

  ClangFlags = require('clang-flags');

  module.exports = ClangProvider = (function() {
    function ClangProvider() {}

    ClangProvider.prototype.selector = '.source.cpp, .source.c, .source.objc, .source.objcpp';

    ClangProvider.prototype.inclusionPriority = 1;

    ClangProvider.prototype.excludeLowerPriority = true;

    ClangProvider.prototype.scopeSource = {
      'source.cpp': 'c++',
      'source.c': 'c',
      'source.objc': 'objective-c',
      'source.objcpp': 'objective-c++'
    };

    ClangProvider.prototype.getSuggestions = function(_arg) {
      var bufferPosition, editor, language, lastSymbol, prefix, scopeDescriptor, symbolPosition, _ref1;
      editor = _arg.editor, scopeDescriptor = _arg.scopeDescriptor, bufferPosition = _arg.bufferPosition;
      language = LanguageUtil.getSourceScopeLang(this.scopeSource, scopeDescriptor.getScopesArray());
      prefix = LanguageUtil.prefixAtPosition(editor, bufferPosition);
      _ref1 = LanguageUtil.nearestSymbolPosition(editor, bufferPosition), symbolPosition = _ref1[0], lastSymbol = _ref1[1];
      if (lastSymbol === ';') {
        return;
      }
      if (language != null) {
        return this.codeCompletionAt(editor, symbolPosition.row, symbolPosition.column, language).then((function(_this) {
          return function(suggestions) {
            return _this.filterForPrefix(suggestions, prefix);
          };
        })(this));
      }
    };

    ClangProvider.prototype.codeCompletionAt = function(editor, row, column, language) {
      var args, command, options;
      command = atom.config.get("autocomplete-clang.clangCommand");
      args = this.buildClangArgs(editor, row, column, language);
      options = {
        cwd: path.dirname(editor.getPath()),
        input: editor.getText()
      };
      return new Promise((function(_this) {
        return function(resolve) {
          var allOutput, bufferedProcess, exit, stderr, stdout;
          allOutput = [];
          stdout = function(output) {
            return allOutput.push(output);
          };
          stderr = function(output) {
            return console.log(output);
          };
          exit = function(code) {
            return resolve(_this.handleCompletionResult(allOutput.join('\n'), code));
          };
          bufferedProcess = new BufferedProcess({
            command: command,
            args: args,
            options: options,
            stdout: stdout,
            stderr: stderr,
            exit: exit
          });
          bufferedProcess.process.stdin.setEncoding = 'utf-8';
          bufferedProcess.process.stdin.write(editor.getText());
          return bufferedProcess.process.stdin.end();
        };
      })(this));
    };

    ClangProvider.prototype.filterForPrefix = function(suggestions, prefix) {
      var res, suggestion, _i, _len;
      res = [];
      for (_i = 0, _len = suggestions.length; _i < _len; _i++) {
        suggestion = suggestions[_i];
        if ((suggestion.snippet || suggestion.text).startsWith(prefix)) {
          suggestion.replacementPrefix = prefix;
          res.push(suggestion);
        }
      }
      return res;
    };

    ClangProvider.prototype.lineRe = /COMPLETION: (.+) : (.+)$/;

    ClangProvider.prototype.returnTypeRe = /\[#([^#]+)#\]/ig;

    ClangProvider.prototype.argumentRe = /\<#([^#]+)#\>/ig;

    ClangProvider.prototype.convertCompletionLine = function(s) {
      var completion, index, line, match, pattern, patternNoType, replacement, returnType, suggestion;
      match = s.match(this.lineRe);
      if (match != null) {
        line = match[0], completion = match[1], pattern = match[2];
        returnType = null;
        patternNoType = pattern.replace(this.returnTypeRe, function(match, type) {
          returnType = type;
          return '';
        });
        index = 0;
        replacement = patternNoType.replace(this.argumentRe, function(match, arg) {
          index++;
          return "${" + index + ":" + arg + "}";
        });
        suggestion = {
          rightLabel: "returns " + returnType
        };
        if (index > 0) {
          suggestion.snippet = replacement;
        } else {
          suggestion.text = replacement;
        }
        return suggestion;
      }
    };

    ClangProvider.prototype.handleCompletionResult = function(result, returnCode) {
      var completion, completions, i, outputLines, s, _i, _len, _results;
      if (returnCode === !0) {
        if (!atom.config.get("autocomplete-clang.ignoreClangErrors")) {
          return;
        }
      }
      outputLines = result.trim().split('\n');
      completions = (function() {
        var _i, _len, _results;
        _results = [];
        for (i = _i = 0, _len = outputLines.length; _i < _len; i = ++_i) {
          s = outputLines[i];
          if (i < 1000) {
            _results.push(this.convertCompletionLine(s));
          }
        }
        return _results;
      }).call(this);
      _results = [];
      for (_i = 0, _len = completions.length; _i < _len; _i++) {
        completion = completions[_i];
        if (completion != null) {
          _results.push(completion);
        }
      }
      return _results;
    };

    ClangProvider.prototype.buildClangArgs = function(editor, row, column, language) {
      var args, clangflags, error, i, location, pch, pchPath, std;
      pch = [atom.config.get("autocomplete-clang.pchFilePrefix"), language, "pch"].join('.');
      args = ["-fsyntax-only", "-x" + language, "-Xclang"];
      location = "-:" + (row + 1) + ":" + (column + 1);
      args.push("-code-completion-at=" + location);
      pchPath = path.join(path.dirname(editor.getPath()), 'test.pch');
      if (existsSync(pchPath)) {
        args = args.concat(["-include-pch", pchPath]);
      }
      std = atom.config.get("autocomplete-clang.std." + language);
      if (std) {
        args = args.concat(["-std=" + std]);
      }
      args = args.concat((function() {
        var _i, _len, _ref1, _results;
        _ref1 = atom.config.get("autocomplete-clang.includePaths");
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          i = _ref1[_i];
          _results.push("-I" + i);
        }
        return _results;
      })());
      try {
        clangflags = ClangFlags.getClangFlags(editor.getPath());
        if (clangflags) {
          args = args.concat(clangflags);
        }
      } catch (_error) {
        error = _error;
        console.log(error);
      }
      args.push("-");
      return args;
    };

    return ClangProvider;

  })();

  LanguageUtil = {
    getSourceScopeLang: function(scopeSource, scopesArray) {
      var scope, _i, _len;
      for (_i = 0, _len = scopesArray.length; _i < _len; _i++) {
        scope = scopesArray[_i];
        if (scope in scopeSource) {
          return scopeSource[scope];
        }
      }
      return null;
    },
    prefixAtPosition: function(editor, bufferPosition) {
      var line, regex, _ref1;
      regex = /[\w0-9_-]+$/;
      line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      return ((_ref1 = line.match(regex)) != null ? _ref1[0] : void 0) || '';
    },
    nearestSymbolPosition: function(editor, bufferPosition) {
      var line, matches, regex, symbol, symbolColumn;
      regex = /([^\w0-9_]+)[\w0-9_]*$/;
      line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      matches = line.match(regex);
      if (matches) {
        symbol = matches[1];
        symbolColumn = matches[0].indexOf(symbol) + symbol.length + (line.length - matches[0].length);
        return [new Point(bufferPosition.row, symbolColumn), symbol.slice(-1)];
      } else {
        return [bufferPosition, ''];
      }
    }
  };

}).call(this);
