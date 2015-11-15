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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJDQUFBOztBQUFBLEVBQUEscUJBQUEsR0FBd0IsT0FBQSxDQUFRLDJCQUFSLENBQXhCLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUMsUUFBUyxPQUFBLENBQVEsZUFBUixFQUFULEtBRkQsQ0FBQTs7QUFBQSxFQUdBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUhQLENBQUE7O0FBQUEsRUFJQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBSkosQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLGNBQUEsRUFDRTtBQUFBLE1BQUEsWUFBQSxFQUFjLE9BQWQ7QUFBQSxNQUNBLFlBQUEsRUFBYyxDQUFDLEdBQUQsQ0FEZDtBQUFBLE1BRUEsYUFBQSxFQUFlLFNBRmY7QUFBQSxNQUdBLGdCQUFBLEVBQWtCLElBSGxCO0FBQUEsTUFJQSxjQUFBLEVBQWdCLENBQUMsR0FBRCxFQUFLLEdBQUwsRUFBUyxJQUFULEVBQWMsSUFBZCxDQUpoQjtBQUFBLE1BS0EsaUJBQUEsRUFBbUIsS0FMbkI7QUFBQSxNQU1BLEdBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLE9BQVA7QUFBQSxRQUNBLEdBQUEsRUFBSyxLQURMO09BUEY7QUFBQSxNQVNBLGtCQUFBLEVBQW9CO0FBQUEsUUFDbEIsS0FBQSxFQUFNLENBQ0osU0FESSxFQUVKLFFBRkksRUFHSixRQUhJLEVBSUosUUFKSSxFQUtKLFNBTEksRUFNSixTQU5JLEVBT0osU0FQSSxFQVFKLE9BUkksRUFTSixTQVRJLEVBVUosU0FWSSxFQVdKLFNBWEksRUFZSixTQVpJLEVBYUosUUFiSSxFQWNKLFNBZEksRUFlSixTQWZJLEVBZ0JKLE9B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
//# sourceURL=/Users/sarah/.atom/packages/autocomplete-clang/lib/autocomplete-clang.coffee