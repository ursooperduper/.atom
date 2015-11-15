(function() {
  var ClangProvider, CompositeDisposable, Disposable, defaultPrecompiled, path, spawn, util, _ref;

  util = require('./util');

  spawn = require('child_process').spawn;

  path = require('path');

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Disposable = _ref.Disposable;

  ClangProvider = null;

  defaultPrecompiled = require('./defaultPrecompiled');

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
        "default": defaultPrecompiled.cpp,
        item: {
          type: 'string'
        }
      },
      "preCompiledHeaders c": {
        type: 'array',
        "default": defaultPrecompiled.c,
        items: {
          type: 'string'
        }
      },
      "preCompiledHeaders objective-c": {
        type: 'array',
        "default": defaultPrecompiled.objc,
        items: {
          type: 'string'
        }
      },
      "preCompiledHeaders objective-c++": {
        type: 'array',
        "default": defaultPrecompiled.objcpp,
        items: {
          type: 'string'
        }
      }
    },
    deactivationDisposables: null,
    activate: function(state) {
      this.deactivationDisposables = new CompositeDisposable;
      return this.deactivationDisposables.add(atom.commands.add('atom-text-editor:not([mini])', {
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
    },
    provide: function() {
      if (ClangProvider == null) {
        ClangProvider = require('./clang-provider');
      }
      return new ClangProvider();
    }
  };

}).call(this);
