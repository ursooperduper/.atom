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

    ClangProvider.prototype.lineRe = /COMPLETION: ([^:]+)(?: : (.+))?$/;

    ClangProvider.prototype.returnTypeRe = /\[#([^#]+)#\]/ig;

    ClangProvider.prototype.argumentRe = /\<#([^#]+)#\>/ig;

    ClangProvider.prototype.commentSplitRe = /(?: : (.+))?$/;

    ClangProvider.prototype.convertCompletionLine = function(s) {
      var briefComment, completion, index, line, match, pattern, patternNoComment, patternNoType, replacement, returnType, suggestion, _ref1;
      match = s.match(this.lineRe);
      if (match != null) {
        line = match[0], completion = match[1], pattern = match[2];
        if (pattern == null) {
          return {
            snippet: completion,
            text: completion
          };
        }
        _ref1 = pattern.split(this.commentSplitRe), patternNoComment = _ref1[0], briefComment = _ref1[1];
        returnType = null;
        patternNoType = patternNoComment.replace(this.returnTypeRe, function(match, type) {
          returnType = type;
          return '';
        });
        index = 0;
        replacement = patternNoType.replace(this.argumentRe, function(match, arg) {
          index++;
          return "${" + index + ":" + arg + "}";
        });
        suggestion = {};
        if (returnType != null) {
          suggestion.rightLabel = returnType;
        }
        if (index > 0) {
          suggestion.snippet = replacement;
        } else {
          suggestion.text = replacement;
        }
        if (briefComment != null) {
          suggestion.description = briefComment;
        }
        return suggestion;
      }
    };

    ClangProvider.prototype.handleCompletionResult = function(result, returnCode) {
      var completion, completions, outputLines, s, _i, _len, _results;
      if (returnCode === !0) {
        if (!atom.config.get("autocomplete-clang.ignoreClangErrors")) {
          return;
        }
      }
      outputLines = result.trim().split('\n');
      completions = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = outputLines.length; _i < _len; _i++) {
          s = outputLines[_i];
          _results.push(this.convertCompletionLine(s));
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
      args = ["-fsyntax-only", "-x" + language, "-Xclang", "-code-completion-macros", "-Xclang"];
      location = "-:" + (row + 1) + ":" + (column + 1);
      args.push("-code-completion-at=" + location);
      if (atom.config.get("autocomplete-clang.includeDocumentation") != null) {
        args = args.concat(["-Xclang", "-code-completion-brief-comments"]);
        if (atom.config.get("autocomplete-clang.includeNonDoxygenCommentsAsDocumentation")) {
          args.push("-fparse-all-comments");
        }
      }
      pchPath = path.join(path.dirname(editor.getPath()), 'test.pch');
      if (existsSync(pchPath)) {
        args = args.concat(["-include-pch", pchPath]);
      }
      std = atom.config.get("autocomplete-clang.std " + language);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1jbGFuZy9saWIvY2xhbmctcHJvdmlkZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBSUE7QUFBQSxNQUFBLCtIQUFBOztBQUFBLEVBQUEsT0FBbUUsT0FBQSxDQUFRLE1BQVIsQ0FBbkUsRUFBQyxhQUFBLEtBQUQsRUFBUSxhQUFBLEtBQVIsRUFBZSx1QkFBQSxlQUFmLEVBQWdDLGtCQUFBLFVBQWhDLEVBQTRDLDJCQUFBLG1CQUE1QyxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVDLGFBQWMsT0FBQSxDQUFRLElBQVIsRUFBZCxVQUZELENBQUE7O0FBQUEsRUFHQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGFBQVIsQ0FIYixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDTTsrQkFDSjs7QUFBQSw0QkFBQSxRQUFBLEdBQVUsc0RBQVYsQ0FBQTs7QUFBQSw0QkFDQSxpQkFBQSxHQUFtQixDQURuQixDQUFBOztBQUFBLDRCQUVBLG9CQUFBLEdBQXNCLElBRnRCLENBQUE7O0FBQUEsNEJBSUEsV0FBQSxHQUNFO0FBQUEsTUFBQSxZQUFBLEVBQWMsS0FBZDtBQUFBLE1BQ0EsVUFBQSxFQUFZLEdBRFo7QUFBQSxNQUVBLGFBQUEsRUFBZSxhQUZmO0FBQUEsTUFHQSxlQUFBLEVBQWlCLGVBSGpCO0tBTEYsQ0FBQTs7QUFBQSw0QkFVQSxjQUFBLEdBQWdCLFNBQUMsSUFBRCxHQUFBO0FBQ2QsVUFBQSw0RkFBQTtBQUFBLE1BRGdCLGNBQUEsUUFBUSx1QkFBQSxpQkFBaUIsc0JBQUEsY0FDekMsQ0FBQTtBQUFBLE1BQUEsUUFBQSxHQUFXLFlBQVksQ0FBQyxrQkFBYixDQUFnQyxJQUFDLENBQUEsV0FB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

//# sourceURL=/Users/sarah/.atom/packages/autocomplete-clang/lib/clang-provider.coffee
