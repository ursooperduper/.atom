(function() {
  var AutocompleteClangView, CompositeDisposable, Disposable, path, spawn, util, _, _ref;

  AutocompleteClangView = require('./autocomplete-clang-view');

  util = require('./util');

  spawn = require('child_process').spawn;

  path = require('path');

  _ = require('underscore-plus');

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Disposable = _ref.Disposable;

  module.exports = {
    configDefaults: {
      clangCommand: "clang",
      includePaths: ["."],
      pchFilePrefix: ".stdafx",
      enableAutoToggle: true,
      autoToggleKeys: [".", "#", "::", "->"],
      ignoreClangErrors: false,
      std: {
        "c++": "c++03",
        "c": "c99"
      },
      preCompiledHeaders: {
        "c++": ["cassert", "cctype", "cerrno", "cfloat", "ciso646", "climits", "clocale", "cmath", "csetjmp", "csignal", "cstdarg", "cstddef", "cstdio", "cstdlib", "cstring", "ctime", "cwchar", "cwctype", "deque", "list", "map", "queue", "set", "stack", "vector", "fstream", "iomanip", "ios", "iosfwd", "iostream", "istream", "ostream", "sstream", "streambuf", "algorithm", "bitset", "complex", "exception", "functional", "iterator", "limits", "locale", "memory", "new", "numeric", "stdexcept", "string", "typeinfo", "utility", "valarray"],
        "c": ["assert.h", "complex.h", "ctype.h", "errno.h", "fenv.h", "float.h", "inttypes.h", "iso646.h", "limits.h", "locale.h", "math.h", "setjmp.h", "signal.h", "stdalign.h", "stdarg.h", "stdatomic.h", "stdbool.h", "stddef.h", "stdint.h", "stdio.h", "stdlib.h", "stdnoreturn.h", "string.h", "tgmath.h", "threads.h", "time.h", "uchar.h", "wchar.h", "wctype.h"],
        "objective-c": [],
        "objective-c++": []
      }
    },
    autocompleteClangViewsByEditor: null,
    deactivationDisposables: null,
    activate: function(state) {
      var getAutocompleteClangView;
      this.autocompleteClangViewsByEditor = new WeakMap;
      getAutocompleteClangView = (function(_this) {
        return function(editorElement) {
          return _this.autocompleteClangViewsByEditor.get(editorElement.getModel());
        };
      })(this);
      this.deactivationDisposables = new CompositeDisposable;
      this.deactivationDisposables.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var autocompleteClangView, disposable;
          if (editor.mini) {
            return;
          }
          autocompleteClangView = new AutocompleteClangView(editor);
          _this.autocompleteClangViewsByEditor.set(editor, autocompleteClangView);
          disposable = new Disposable(function() {
            return autocompleteClangView.remove();
          });
          _this.deactivationDisposables.add(editor.onDidDestroy(function() {
            return disposable.dispose();
          }));
          _this.deactivationDisposables.add(disposable);
          return _this.deactivationDisposables.add(editor.onDidInsertText(function(e) {
            if (atom.config.get('autocomplete-clang.enableAutoToggle')) {
              return autocompleteClangView != null ? autocompleteClangView.handleTextInsertion(e) : void 0;
            }
          }));
        };
      })(this)));
      return this.deactivationDisposables.add(atom.commands.add('atom-text-editor:not([mini])', {
        'autocomplete-clang:toggle': function() {
          var _ref1;
          return (_ref1 = getAutocompleteClangView(this)) != null ? _ref1.toggle() : void 0;
        },
        'autocomplete:next': (function(_this) {
          return function() {
            var _ref1;
            return (_ref1 = getAutocompleteClangView(_this)) != null ? _ref1.selectNextItemView() : void 0;
          };
        })(this),
        'autocomplete:previous': (function(_this) {
          return function() {
            var _ref1;
            return (_ref1 = getAutocompleteClangView(_this)) != null ? _ref1.selectPreviousItemView() : void 0;
          };
        })(this),
        'autocomplete-clang:emit-pch': (function(_this) {
          return function() {
            return _this.emitPch(_this);
          };
        })(this)
      }));
    },
    emitPch: function(editor) {
      var args, clang_command, emit_process, h, headers, headersInput, lang;
      lang = util.getFirstCursorSourceScopeLang(editor);
      if (!lang) {
        alert("autocomplete-clang:emit-pch\nError: Incompatible Language");
        return;
      }
      clang_command = atom.config.get("autocomplete-clang.clangCommand");
      args = this.buildEmitPchCommandArgs(editor, lang);
      emit_process = spawn(clang_command, args);
      emit_process.on("exit", (function(_this) {
        return function(code) {
          return _this.handleEmitPchResult(code);
        };
      })(this));
      emit_process.stdout.on('data', function(data) {
        return console.log("out:\n" + data.toString());
      });
      emit_process.stderr.on('data', function(data) {
        return console.log("err:\n" + data.toString());
      });
      headers = atom.config.get("autocomplete-clang.preCompiledHeaders." + lang);
      headersInput = ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = headers.length; _i < _len; _i++) {
          h = headers[_i];
          _results.push("#include <" + h + ">");
        }
        return _results;
      })()).join("\n");
      emit_process.stdin.write(headersInput);
      return emit_process.stdin.end();
    },
    buildEmitPchCommandArgs: function(editor, lang) {
      var args, dir, file, i, include_paths, pch, pch_file_prefix, std;
      dir = path.dirname(editor.getPath());
      pch_file_prefix = atom.config.get("autocomplete-clang.pchFilePrefix");
      file = [pch_file_prefix, lang, "pch"].join('.');
      pch = path.join(dir, file);
      std = atom.config.get("autocomplete-clang.std." + lang);
      args = ["-x" + lang + "-header", "-Xclang", '-emit-pch', '-o', pch];
      if (std) {
        args = args.concat(["-std=" + std]);
      }
      include_paths = atom.config.get("autocomplete-clang.includePaths");
      args = args.concat((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = include_paths.length; _i < _len; _i++) {
          i = include_paths[_i];
          _results.push("-I" + i);
        }
        return _results;
      })());
      args = args.concat(["-"]);
      return args;
    },
    handleEmitPchResult: function(code) {
      if (!code) {
        alert("Emiting precompiled header has successfully finished");
        return;
      }
      return alert(("Emiting precompiled header exit with " + code + "\n") + "See console for detailed error message");
    },
    deactivate: function() {
      this.deactivationDisposables.dispose();
      return console.log("autocomplete-clang deactivated");
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtGQUFBOztBQUFBLEVBQUEscUJBQUEsR0FBd0IsT0FBQSxDQUFRLDJCQUFSLENBQXhCLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUMsUUFBUyxPQUFBLENBQVEsZUFBUixFQUFULEtBRkQsQ0FBQTs7QUFBQSxFQUdBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUhQLENBQUE7O0FBQUEsRUFJQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBSkosQ0FBQTs7QUFBQSxFQUtBLE9BQW1DLE9BQUEsQ0FBUSxNQUFSLENBQW5DLEVBQUMsMkJBQUEsbUJBQUQsRUFBcUIsa0JBQUEsVUFMckIsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLGNBQUEsRUFDRTtBQUFBLE1BQUEsWUFBQSxFQUFjLE9BQWQ7QUFBQSxNQUNBLFlBQUEsRUFBYyxDQUFDLEdBQUQsQ0FEZDtBQUFBLE1BRUEsYUFBQSxFQUFlLFNBRmY7QUFBQSxNQUdBLGdCQUFBLEVBQWtCLElBSGxCO0FBQUEsTUFJQSxjQUFBLEVBQWdCLENBQUMsR0FBRCxFQUFLLEdBQUwsRUFBUyxJQUFULEVBQWMsSUFBZCxDQUpoQjtBQUFBLE1BS0EsaUJBQUEsRUFBbUIsS0FMbkI7QUFBQSxNQU1BLEdBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLE9BQVA7QUFBQSxRQUNBLEdBQUEsRUFBSyxLQURMO09BUEY7QUFBQSxNQVNBLGtCQUFBLEVBQW9CO0FBQUEsUUFDbEIsS0FBQSxFQUFNLENBQ0osU0FESSxFQUVKLFFBRkksRUFHSixRQUhJLEVBSUosUUFKSSxFQUtKLFNBTEksRUFNSixTQU5JLEVBT0osU0FQSSxFQVFKLE9BUkks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
//# sourceURL=/Users/sarah/.atom/packages/autocomplete-clang/lib/autocomplete-clang.coffee