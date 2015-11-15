(function() {
  var AutocompleteClangView, CompositeDisposable, Disposable, path, spawn, util, _, _ref;

  AutocompleteClangView = require('./autocomplete-clang-view');

  util = require('./util');

  spawn = require('child_process').spawn;

  path = require('path');

  _ = require('underscore-plus');

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Disposable = _ref.Disposable;

  module.exports = {
    config: {
      clangCommand: {
        type: 'string',
        "default": 'clang'
      },
      includePaths: {
        type: 'array',
        "default": ['.'],
        items: {
          type: 'string'
        }
      },
      pchFilePrefix: {
        type: 'string',
        "default": '.stdafx'
      },
      enableAutoToggle: {
        type: 'boolean',
        "default": true
      },
      autoToggleKeys: {
        type: 'array',
        "default": [".", "#", "::", "->"],
        items: {
          type: 'string'
        }
      },
      ignoreClangErrors: {
        type: 'boolean',
        "default": true
      },
      "std c++": {
        type: 'string',
        "default": "c++11"
      },
      "std c": {
        type: 'string',
        "default": "c99"
      },
      "preCompiledHeaders c++": {
        type: 'array',
        "default": ["cassert", "cctype", "cerrno", "cfloat", "ciso646", "climits", "clocale", "cmath", "csetjmp", "csignal", "cstdarg", "cstddef", "cstdio", "cstdlib", "cstring", "ctime", "cwchar", "cwctype", "deque", "list", "map", "queue", "set", "stack", "vector", "fstream", "iomanip", "ios", "iosfwd", "iostream", "istream", "ostream", "sstream", "streambuf", "algorithm", "bitset", "complex", "exception", "functional", "iterator", "limits", "locale", "memory", "new", "numeric", "stdexcept", "string", "typeinfo", "utility", "valarray"],
        item: {
          type: 'string'
        }
      },
      "preCompiledHeaders c": {
        type: 'array',
        "default": ["assert.h", "complex.h", "ctype.h", "errno.h", "fenv.h", "float.h", "inttypes.h", "iso646.h", "limits.h", "locale.h", "math.h", "setjmp.h", "signal.h", "stdalign.h", "stdarg.h", "stdatomic.h", "stdbool.h", "stddef.h", "stdint.h", "stdio.h", "stdlib.h", "stdnoreturn.h", "string.h", "tgmath.h", "threads.h", "time.h", "uchar.h", "wchar.h", "wctype.h"],
        items: {
          type: 'string'
        }
      },
      "preCompiledHeaders objective-c": {
        type: 'array',
        "default": [],
        items: {
          type: 'string'
        }
      },
      "preCompiledHeaders objective-c++": {
        type: 'array',
        "default": [],
        items: {
          type: 'string'
        }
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
            return _this.emitPch(atom.workspace.getActiveTextEditor());
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
      headers = atom.config.get("autocomplete-clang.preCompiledHeaders " + lang);
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
      std = atom.config.get("autocomplete-clang.std " + lang);
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
