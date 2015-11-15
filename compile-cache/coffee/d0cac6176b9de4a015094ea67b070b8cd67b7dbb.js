(function() {
  var $, $$, AutocompleteClangView, ClangFlags, CompositeDisposable, Range, SelectListView, existsSync, path, spawnSync, util, _, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  util = require('./util');

  _ = require('underscore-plus');

  spawnSync = require('child_process').spawnSync;

  path = require('path');

  existsSync = require('fs').existsSync;

  _ref = require('atom'), Range = _ref.Range, CompositeDisposable = _ref.CompositeDisposable;

  _ref1 = require('atom-space-pen-views'), $ = _ref1.$, $$ = _ref1.$$, SelectListView = _ref1.SelectListView;

  ClangFlags = require('clang-flags');

  module.exports = AutocompleteClangView = (function(_super) {
    __extends(AutocompleteClangView, _super);

    function AutocompleteClangView() {
      return AutocompleteClangView.__super__.constructor.apply(this, arguments);
    }

    AutocompleteClangView.prototype.clangOutput = "";

    AutocompleteClangView.prototype.wordRegex = /\w+/g;

    AutocompleteClangView.prototype.initialize = function(editor) {
      this.editor = editor;
      AutocompleteClangView.__super__.initialize.apply(this, arguments);
      this.addClass('autocomplete popover-list');
      this.handleEvents();
      this.setCurrentBuffer(this.editor.getBuffer());
      if (atom.packages.isPackageLoaded("snippets")) {
        return this.snippets = atom.packages.getLoadedPackage("snippets").mainModule;
      }
    };

    AutocompleteClangView.prototype.getFilterKey = function() {
      return 'word';
    };

    AutocompleteClangView.prototype.viewForItem = function(_arg) {
      var label;
      label = _arg.label;
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            return _this.span(label.slice(0, 51));
          };
        })(this));
      });
    };

    AutocompleteClangView.prototype.handleEvents = function() {
      this.list.on('mousewheel', function(event) {
        return event.stopPropagation();
      });
      this.editor.onDidChangePath((function(_this) {
        return function() {
          return _this.setCurrentBuffer(_this.editor.getBuffer());
        };
      })(this));
      return this.filterEditorView.getModel().onWillInsertText((function(_this) {
        return function(_arg) {
          var cancel, text;
          cancel = _arg.cancel, text = _arg.text;
          if (!text.match(_this.wordRegex)) {
            _this.confirmSelection();
            return _this.editor.insertText(text);
          }
        };
      })(this));
    };

    AutocompleteClangView.prototype.setCurrentBuffer = function(currentBuffer) {
      this.currentBuffer = currentBuffer;
    };

    AutocompleteClangView.prototype.selectItemView = function(item) {
      var match;
      AutocompleteClangView.__super__.selectItemView.apply(this, arguments);
      if (match = this.getSelectedItem()) {
        return this.replaceSelectedTextWithMatch(match);
      }
    };

    AutocompleteClangView.prototype.selectNextItemView = function() {
      AutocompleteClangView.__super__.selectNextItemView.apply(this, arguments);
      return false;
    };

    AutocompleteClangView.prototype.selectPreviousItemView = function() {
      AutocompleteClangView.__super__.selectPreviousItemView.apply(this, arguments);
      return false;
    };

    AutocompleteClangView.prototype.handleTextInsertion = function(event) {
      var c, pos, _i, _len, _ref2, _results;
      if (this.isVisible()) {
        return;
      }
      pos = this.editor.getCursorBufferPosition();
      _ref2 = atom.config.get("autocomplete-clang.autoToggleKeys");
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        c = _ref2[_i];
        if (c.slice(-1) === event.text) {
          if (c === this.getBufferTextInColumnDelta(pos, -1 * c.length)) {
            _results.push(this.toggle(event.text));
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    AutocompleteClangView.prototype.getBufferTextInColumnDelta = function(point, columnDelta) {
      var r;
      r = Range.fromPointWithDelta(point, 0, columnDelta);
      return this.editor.getBuffer().getTextInRange(r);
    };

    AutocompleteClangView.prototype.toggle = function(prefix) {
      if (this.isVisible()) {
        return this.cancel();
      } else {
        this.prefix = prefix;
        return this.attach();
      }
    };

    AutocompleteClangView.prototype.attach = function() {
      var cursorMarker, items;
      this.aboveCursor = false;
      this.originalCursorPosition = this.editor.getCursorScreenPosition();
      items = this.buildWordList();
      if (items && items.length) {
        this.setItems(items);
        cursorMarker = this.editor.getLastCursor().getMarker();
        return this.overlayDecoration = this.editor.decorateMarker(cursorMarker, {
          type: 'overlay',
          position: 'tail',
          item: this
        });
      }
    };

    AutocompleteClangView.prototype.buildWordList = function() {
      var firstCursorPosition, lang;
      firstCursorPosition = this.editor.getCursors()[0].getBufferPosition();
      lang = util.getFirstCursorSourceScopeLang(this.editor);
      if (!lang) {
        return;
      }
      return this.codeCompletionAt(firstCursorPosition.row, firstCursorPosition.column, lang);
    };

    AutocompleteClangView.prototype.codeCompletionAt = function(row, column, lang) {
      var args, command, options, result;
      command = atom.config.get("autocomplete-clang.clangCommand");
      args = this.buildClangArgs(row, column, lang);
      options = {
        cwd: path.dirname(this.editor.getPath()),
        input: this.editor.getText()
      };
      result = spawnSync(command, args, options);
      return this.handleCompletionResult(result);
    };

    AutocompleteClangView.prototype.buildClangArgs = function(row, column, lang) {
      var args, clangflags, error, i, location, pch, pchPath, std;
      pch = [atom.config.get("autocomplete-clang.pchFilePrefix"), lang, "pch"].join('.');
      args = ["-fsyntax-only", "-x" + lang, "-Xclang"];
      location = ["-", row + 1, column + 1].join(':');
      args = args.concat(["-code-completion-at=" + location]);
      pchPath = path.join(path.dirname(this.editor.getPath()), pch);
      if (existsSync(pchPath)) {
        args = args.concat(["-include-pch", pch]);
      }
      std = atom.config.get("autocomplete-clang.std " + lang);
      if (std) {
        args = args.concat(["-std=" + std]);
      }
      args = args.concat((function() {
        var _i, _len, _ref2, _results;
        _ref2 = atom.config.get("autocomplete-clang.includePaths");
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          i = _ref2[_i];
          _results.push("-I" + i);
        }
        return _results;
      })());
      try {
        clangflags = ClangFlags.getClangFlags(atom.workspace.getActiveTextEditor().getPath());
        if (clangflags) {
          args = args.concat(clangflags);
        }
      } catch (_error) {
        error = _error;
        console.log(error);
      }
      return args = args.concat(["-"]);
    };

    AutocompleteClangView.prototype.convertCompletionLine = function(s) {
      var i, l, slabel, snipet;
      s = s.slice(12);
      l = s.match(/^[^ ]+\s:\s/);
      s = s.replace(/^[^ ]+\s:\s/, "");
      s = s.replace(/\[#(.*?)#\]/g, "");
      i = 0;
      snipet = s.replace(/<#(.*?)#>|{#(.*?)#}/g, function(match, p1, p2) {
        ++i;
        return "${" + i + ":" + (p1 || p2) + "}";
      });
      slabel = s.replace(/<#(.*?)#>/g, function(match, p1) {
        return "" + p1;
      });
      if (s) {
        return {
          word: snipet,
          label: slabel
        };
      }
    };

    AutocompleteClangView.prototype.handleCompletionResult = function(result) {
      var completions, items, outputLines, s;
      if (result.error) {
        console.log(result.error);
        return;
      }
      if (result.status) {
        console.log("Unexpected return code of clang command:", result.status);
        console.log(result.stderr.toString());
        if (!atom.config.get("autocomplete-clang.ignoreClangErrors")) {
          return;
        }
      }
      outputLines = result.stdout.toString().trim().split('\n');
      completions = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = outputLines.length; _i < _len; _i++) {
          s = outputLines[_i];
          _results.push(this.convertCompletionLine(s));
        }
        return _results;
      }).call(this);
      return items = _.remove(completions, void 0);
    };

    AutocompleteClangView.prototype.cancelled = function() {
      var _ref2;
      if ((_ref2 = this.overlayDecoration) != null) {
        _ref2.destroy();
      }
      if (!this.editor.isDestroyed()) {
        return atom.workspace.getActivePane().activate();
      }
    };

    AutocompleteClangView.prototype.replaceSelectedTextWithMatch = function(match) {
      var newSelectedBufferRanges;
      newSelectedBufferRanges = [];
      this.editor.getSelections().forEach((function(_this) {
        return function(selection, i) {
          var cursorPosition, range, startPosition;
          startPosition = selection.getBufferRange().start;
          selection.deleteSelectedText();
          cursorPosition = _this.editor.getCursors()[i].getBufferPosition();
          range = [startPosition.row, startPosition.column + match.word.length];
          return newSelectedBufferRanges.push([startPosition, range]);
        };
      })(this));
      return this.editor.setSelectedBufferRanges(newSelectedBufferRanges);
    };

    AutocompleteClangView.prototype.attached = function() {
      var widestCompletion;
      this.focusFilterEditor();
      widestCompletion = parseInt(this.css('min-width')) || 0;
      this.list.find('span').each(function() {
        return widestCompletion = Math.max(widestCompletion, $(this).outerWidth());
      });
      this.list.width(widestCompletion);
      return this.width(this.list.outerWidth());
    };

    AutocompleteClangView.prototype.detached = function() {};

    AutocompleteClangView.prototype.confirmed = function(match) {
      if (!match) {
        return;
      }
      this.cancel();
      if (this.snippets) {
        return this.editor.getCursors().forEach((function(_this) {
          return function(cursor) {
            return _this.snippets.insert(match.word, _this.editor, cursor);
          };
        })(this));
      } else {
        return this.editor.insertText(match.label);
      }
    };

    return AutocompleteClangView;

  })(SelectListView);

}).call(this);
