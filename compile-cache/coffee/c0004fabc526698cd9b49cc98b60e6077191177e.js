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
        this.editor.beginTransaction();
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
      std = atom.config.get("autocomplete-clang.std." + lang);
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
        this.editor.abortTransaction();
        if (this.prefix) {
          this.editor.insertText(this.prefix);
        }
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
      this.editor.insertText(match.label);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVJQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVIsQ0FBUCxDQUFBOztBQUFBLEVBRUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUZKLENBQUE7O0FBQUEsRUFHQyxZQUFhLE9BQUEsQ0FBUSxlQUFSLEVBQWIsU0FIRCxDQUFBOztBQUFBLEVBSUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSlAsQ0FBQTs7QUFBQSxFQUtDLGFBQWMsT0FBQSxDQUFRLElBQVIsRUFBZCxVQUxELENBQUE7O0FBQUEsRUFNQSxPQUErQixPQUFBLENBQVEsTUFBUixDQUEvQixFQUFDLGFBQUEsS0FBRCxFQUFRLDJCQUFBLG1CQU5SLENBQUE7O0FBQUEsRUFPQSxRQUEyQixPQUFBLENBQVEsc0JBQVIsQ0FBM0IsRUFBQyxVQUFBLENBQUQsRUFBSSxXQUFBLEVBQUosRUFBUSx1QkFBQSxjQVBSLENBQUE7O0FBQUEsRUFTQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGFBQVIsQ0FUYixDQUFBOztBQUFBLEVBV0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDRDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxvQ0FBQSxXQUFBLEdBQWEsRUFBYixDQUFBOztBQUFBLG9DQUNBLFNBQUEsR0FBVyxNQURYLENBQUE7O0FBQUEsb0NBR0EsVUFBQSxHQUFZLFNBQUUsTUFBRixHQUFBO0FBQ1YsTUFEVyxJQUFDLENBQUEsU0FBQSxNQUNaLENBQUE7QUFBQSxNQUFBLHVEQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLDJCQUFWLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFlBQUQsQ0FBQSxDQUZBLENBQUE7QUFBQSxNQUdB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
//# sourceURL=/Users/sarah/.atom/packages/autocomplete-clang/lib/autocomplete-clang-view.coffee