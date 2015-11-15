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
      includeDocumentation: {
        type: 'boolean',
        "default": true
      },
      includeNonDoxygenCommentsAsDocumentation: {
        type: 'boolean',
        "default": false
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1jbGFuZy9saWIvYXV0b2NvbXBsZXRlLWNsYW5nLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwyRkFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQyxRQUFTLE9BQUEsQ0FBUSxlQUFSLEVBQVQsS0FERCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLE9BQW1DLE9BQUEsQ0FBUSxNQUFSLENBQW5DLEVBQUMsMkJBQUEsbUJBQUQsRUFBcUIsa0JBQUEsVUFIckIsQ0FBQTs7QUFBQSxFQUlBLGFBQUEsR0FBZ0IsSUFKaEIsQ0FBQTs7QUFBQSxFQUtBLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSxzQkFBUixDQUxyQixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsT0FEVDtPQURGO0FBQUEsTUFHQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxPQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsQ0FBQyxHQUFELENBRFQ7QUFBQSxRQUVBLEtBQUEsRUFDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLFFBQU47U0FIRjtPQUpGO0FBQUEsTUFRQSxhQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsU0FEVDtPQVRGO0FBQUEsTUFXQSxpQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FB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

//# sourceURL=/Users/sarah/.atom/packages/autocomplete-clang/lib/autocomplete-clang.coffee
