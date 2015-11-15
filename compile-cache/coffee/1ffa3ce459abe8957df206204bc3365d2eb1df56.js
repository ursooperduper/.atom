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
      this.originalSelectionBufferRanges = this.editor.getSelections().map(function(selection) {
        return selection.getBufferRange();
      });
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
      if (result.status) {
        console.log("Unexpected return code of clang command:", result.status);
        console.log(result.stderr.toString());
        return;
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
        this.editor.setSelectedBufferRanges(this.originalSelectionBufferRanges);
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
            return _this.snippets.insert(match.word);
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