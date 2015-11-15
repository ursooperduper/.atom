(function() {
  var $$, AutocompleteClangView, ClangFlags, Range, SelectListView, existsSync, path, spawnSync, util, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  util = require('./util');

  _ = require('underscore-plus');

  spawnSync = require('child_process').spawnSync;

  path = require('path');

  existsSync = require('fs').existsSync;

  _ref = require('atom'), $$ = _ref.$$, Range = _ref.Range, SelectListView = _ref.SelectListView;

  ClangFlags = require('clang-flags');

  module.exports = AutocompleteClangView = (function(_super) {
    __extends(AutocompleteClangView, _super);

    function AutocompleteClangView() {
      return AutocompleteClangView.__super__.constructor.apply(this, arguments);
    }

    AutocompleteClangView.prototype.clangOutput = "";

    AutocompleteClangView.prototype.wordRegex = /\w+/g;

    AutocompleteClangView.prototype.initialize = function(editorView) {
      this.editorView = editorView;
      AutocompleteClangView.__super__.initialize.apply(this, arguments);
      this.addClass('autocomplete popover-list');
      this.editor = this.editorView.editor;
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
      this.editorView.on('editor:path-changed', (function(_this) {
        return function() {
          return _this.setCurrentBuffer(_this.editor.getBuffer());
        };
      })(this));
      this.editorView.command('autocomplete-clang:toggle', (function(_this) {
        return function() {
          return _this.toggle("");
        };
      })(this));
      this.editorView.command('autocomplete:next', (function(_this) {
        return function() {
          return _this.selectNextItemView();
        };
      })(this));
      this.editorView.command('autocomplete:previous', (function(_this) {
        return function() {
          return _this.selectPreviousItemView();
        };
      })(this));
      if (atom.config.get('autocomplete-clang.enableAutoToggle')) {
        this.editor.getBuffer().onDidChange((function(_this) {
          return function(e) {
            if (e.newText) {
              return _this.handleChanged(e);
            }
          };
        })(this));
      }
      return this.filterEditorView.getModel().on('will-insert-text', (function(_this) {
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

    AutocompleteClangView.prototype.handleChanged = function(event) {
      var c, pos, _i, _len, _ref1, _results;
      if (this.hasParent()) {
        return;
      }
      pos = this.editor.getCursorBufferPosition();
      _ref1 = atom.config.get("autocomplete-clang.autoToggleKeys");
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        c = _ref1[_i];
        if (c.slice(-1) === event.newText) {
          if (c === this.getBufferTextInColumnDelta(pos, -1 * c.length)) {
            _results.push(this.toggle(event.newText));
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
      if (this.hasParent()) {
        return this.cancel();
      } else {
        this.prefix = prefix;
        return this.attach();
      }
    };

    AutocompleteClangView.prototype.attach = function() {
      var items;
      this.aboveCursor = false;
      this.originalCursorPosition = this.editor.getCursorScreenPosition();
      items = this.buildWordList();
      if (items && items.length) {
        this.editor.beginTransaction();
        this.setItems(items);
        this.editorView.appendToLinesView(this);
        this.setPosition();
        return this.focusFilterEditor();
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
      AutocompleteClangView.__super__.cancelled.apply(this, arguments);
      if (!this.editor.isDestroyed()) {
        this.editor.abortTransaction();
        this.editor.insertText(this.prefix);
        return this.editorView.focus();
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

    AutocompleteClangView.prototype.setPosition = function() {
      var height, left, parentWidth, potentialBottom, potentialTop, top, width, _ref1, _ref2;
      _ref1 = this.editorView.pixelPositionForScreenPosition(this.originalCursorPosition), left = _ref1.left, top = _ref1.top;
      _ref2 = [this.outerHeight(), this.outerWidth()], height = _ref2[0], width = _ref2[1];
      potentialTop = top + this.editorView.lineHeight;
      potentialBottom = potentialTop - this.editorView.scrollTop() + height;
      parentWidth = this.parent().width();
      if (left + width > parentWidth) {
        left = parentWidth - width;
      }
      if (this.aboveCursor || potentialBottom > this.editorView.outerHeight()) {
        this.aboveCursor = true;
        return this.css({
          left: left,
          top: top - height,
          bottom: 'inherit'
        });
      } else {
        return this.css({
          left: left,
          top: potentialTop,
          bottom: 'inherit'
        });
      }
    };

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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdHQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVIsQ0FBUCxDQUFBOztBQUFBLEVBRUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUZKLENBQUE7O0FBQUEsRUFHQyxZQUFhLE9BQUEsQ0FBUSxlQUFSLEVBQWIsU0FIRCxDQUFBOztBQUFBLEVBSUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSlAsQ0FBQTs7QUFBQSxFQUtDLGFBQWMsT0FBQSxDQUFRLElBQVIsRUFBZCxVQUxELENBQUE7O0FBQUEsRUFNQSxPQUE0QixPQUFBLENBQVEsTUFBUixDQUE1QixFQUFDLFVBQUEsRUFBRCxFQUFJLGFBQUEsS0FBSixFQUFVLHNCQUFBLGNBTlYsQ0FBQTs7QUFBQSxFQVFBLFVBQUEsR0FBYSxPQUFBLENBQVEsYUFBUixDQVJiLENBQUE7O0FBQUEsRUFVQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osNENBQUEsQ0FBQTs7OztLQUFBOztBQUFBLG9DQUFBLFdBQUEsR0FBYSxFQUFiLENBQUE7O0FBQUEsb0NBQ0EsU0FBQSxHQUFXLE1BRFgsQ0FBQTs7QUFBQSxvQ0FHQSxVQUFBLEdBQVksU0FBRSxVQUFGLEdBQUE7QUFDVixNQURXLElBQUMsQ0FBQSxhQUFBLFVBQ1osQ0FBQTtBQUFBLE1BQUEsdURBQUEsU0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxRQUFELENBQVUsMkJBQVYsQ0FEQSxDQUFBO0FBQUEsTUFFQyxJQUFDLENBQUEsU0FBVSxJQUFDLENBQUEsV0FBWCxNQUZGLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxZQUFELENBQUEsQ0FIQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsSUFB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
//# sourceURL=/Users/sarah/.atom/packages/autocomplete-clang/lib/autocomplete-clang-view.coffee