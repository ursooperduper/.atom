(function() {
  var AutocompleteClangView, path, spawn, util, _;

  AutocompleteClangView = require('./autocomplete-clang-view');

  util = require('./util');

  spawn = require('child_process').spawn;

  path = require('path');

  _ = require('underscore-plus');

  module.exports = {
    configDefaults: {
      clangCommand: "clang",
      includePaths: ["."],
      pchFilePrefix: ".stdafx",
      enableAutoToggle: true,
      autoToggleKeys: [".", "#", "::", "->"],
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
    autocompleteClangViews: [],
    activate: function(state) {
      return this.editorSubscription = atom.workspaceView.eachEditorView((function(_this) {
        return function(editor) {
          var autocompleteClangView;
          if (editor.attached && !editor.mini) {
            autocompleteClangView = new AutocompleteClangView(editor);
            editor.on('editor:will-be-removed', function() {
              if (!autocompleteClangView.hasParent()) {
                autocompleteClangView.remove();
              }
              return _.remove(_this.autocompleteClangViews, autocompleteClangView);
            });
            _this.autocompleteClangViews.push(autocompleteClangView);
            return editor.command("autocomplete-clang:emit-pch", function() {
              return _this.emitPch(editor.getEditor());
            });
          }
        };
      })(this));
    },
    emitPch: function(editor) {
      var args, emit_process, h, headers, headersInput, lang;
      lang = util.getFirstCursorSourceScopeLang(editor);
      if (!lang) {
        alert("autocomplete-clang:emit-pch\nError: Incompatible Language");
        return;
      }
      args = this.buildEmitPchCommandArgs(editor, lang);
      emit_process = spawn(atom.config.get("autocomplete-clang.clangCommand"), args);
      emit_process.on("exit", (function(_this) {
        return function(code) {
          return _this.handleEmitPchResult(code);
        };
      })(this));
      emit_process.stdout.on('data', (function(_this) {
        return function(data) {
          return console.log("out:\n" + data.toString());
        };
      })(this));
      emit_process.stderr.on('data', (function(_this) {
        return function(data) {
          return console.log("err:\n" + data.toString());
        };
      })(this));
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
      var args, dir, file, i, pch, std;
      dir = path.dirname(editor.getPath());
      file = [atom.config.get("autocomplete-clang.pchFilePrefix"), lang, "pch"].join('.');
      pch = path.join(dir, file);
      std = atom.config.get("autocomplete-clang.std." + lang);
      args = ["-x" + lang + "-header", "-Xclang", '-emit-pch', '-o', pch];
      if (std) {
        args = args.concat(["-std=" + std]);
      }
      args = args.concat((function() {
        var _i, _len, _ref, _results;
        _ref = atom.config.get("autocomplete-clang.includePaths");
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
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
      return alert("Emiting precompiled header exit with " + code + "\nSee console for detailed error message");
    },
    deactivate: function() {
      var _ref;
      if ((_ref = this.editorSubscription) != null) {
        _ref.off();
      }
      this.editorSubscription = null;
      this.autocompleteClangViews.forEach(function(autocompleteView) {
        return autocompleteView.remove();
      });
      return this.autocompleteClangViews = [];
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJDQUFBOztBQUFBLEVBQUEscUJBQUEsR0FBd0IsT0FBQSxDQUFRLDJCQUFSLENBQXhCLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUMsUUFBUyxPQUFBLENBQVEsZUFBUixFQUFULEtBRkQsQ0FBQTs7QUFBQSxFQUdBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUhQLENBQUE7O0FBQUEsRUFJQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBSkosQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLGNBQUEsRUFDRTtBQUFBLE1BQUEsWUFBQSxFQUFjLE9BQWQ7QUFBQSxNQUNBLFlBQUEsRUFBYyxDQUFDLEdBQUQsQ0FEZDtBQUFBLE1BRUEsYUFBQSxFQUFlLFNBRmY7QUFBQSxNQUdBLGdCQUFBLEVBQWtCLElBSGxCO0FBQUEsTUFJQSxjQUFBLEVBQWdCLENBQUMsR0FBRCxFQUFLLEdBQUwsRUFBUyxJQUFULEVBQWMsSUFBZCxDQUpoQjtBQUFBLE1BS0EsR0FBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sT0FBUDtBQUFBLFFBQ0EsR0FBQSxFQUFLLEtBREw7T0FORjtBQUFBLE1BUUEsa0JBQUEsRUFBb0I7QUFBQSxRQUNsQixLQUFBLEVBQU0sQ0FDSixTQURJLEVBRUosUUFGSSxFQUdKLFFBSEksRUFJSixRQUpJLEVBS0osU0FMSSxFQU1KLFNBTkksRUFPSixTQVBJLEVBUUosT0FSSSxFQVNKLFNBVEksRUFVSixTQVZJLEVBV0osU0FYSSxFQVlKLFNBWkksRUFhSixRQWJJLEVBY0osU0FkSSxFQWVKLFNBZkksRUFnQkosT0FoQkksRUFpQkosUUFqQkksRUFrQkosU0FsQkks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
//# sourceURL=/Users/sarah/.atom/packages/autocomplete-clang/lib/autocomplete-clang.coffee