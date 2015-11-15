(function() {
  var $, $$, AutocompleteClangView, ClangFlags, Range, SelectListView, existsSync, path, snippets, spawn, util, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  util = require('./util');

  _ = require('underscore-plus');

  spawn = require('child_process').spawn;

  path = require('path');

  existsSync = require('fs').existsSync;

  snippets = require('snippets/lib/snippets');

  _ref = require('atom'), $ = _ref.$, $$ = _ref.$$, Range = _ref.Range, SelectListView = _ref.SelectListView;

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
      return this.setCurrentBuffer(this.editor.getBuffer());
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
          return _this.toggle();
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
        this.editor.getBuffer().on("changed", (function(_this) {
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
            _this.editor.insertText(text);
            return cancel();
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
        if (c.slice(-1) === event.newText && c === this.getBufferTextInColumnDelta(pos, -1 * c.length)) {
          this.editor.commitTransaction();
          this.editor.beginTransaction();
          _results.push(this.toggle());
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

    AutocompleteClangView.prototype.toggle = function() {
      if (this.hasParent()) {
        return this.cancel();
      } else {
        return this.attach();
      }
    };

    AutocompleteClangView.prototype.attach = function() {
      this.editor.beginTransaction();
      this.aboveCursor = false;
      this.originalSelectionBufferRanges = this.editor.getSelections().map(function(selection) {
        return selection.getBufferRange();
      });
      this.originalCursorPosition = this.editor.getCursorScreenPosition();
      return this.buildWordList();
    };

    AutocompleteClangView.prototype.buildWordList = function() {
      var firstCursorPosition, lang;
      firstCursorPosition = this.editor.getCursors()[0].getBufferPosition();
      lang = util.getFirstCursorSourceScopeLang(this.editor);
      if (!lang) {
        return this.cancel;
      }
      return this.codeCompletionAt(firstCursorPosition.row, firstCursorPosition.column, lang);
    };

    AutocompleteClangView.prototype.codeCompletionAt = function(row, column, lang) {
      var args, clang;
      args = this.buildClangArgs(row, column, lang);
      this.clangOutput = "";
      clang = spawn(atom.config.get("autocomplete-clang.clangCommand"), args, {
        cwd: path.dirname(this.editor.getPath())
      });
      clang.stdout.on('data', (function(_this) {
        return function(data) {
          return _this.handleCompletionOutput(data);
        };
      })(this));
      clang.stderr.on('data', (function(_this) {
        return function(data) {
          return _this.handleClangError(data);
        };
      })(this));
      clang.on('exit', (function(_this) {
        return function(code) {
          return _this.handleCompletionClose(code);
        };
      })(this));
      clang.stdin.write(this.editor.getText());
      return clang.stdin.end();
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
          args = args.concat(clanflags);
        }
      } catch (_error) {
        error = _error;
        console.log(error);
      }
      return args = args.concat(["-"]);
    };

    AutocompleteClangView.prototype.convertClangCompletion = function(s) {
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

    AutocompleteClangView.prototype.handleCompletionOutput = function(data) {
      return this.clangOutput += data.toString();
    };

    AutocompleteClangView.prototype.handleCompletionClose = function(code) {
      var completions, items, s;
      if (code) {
        console.log("Unexpected return code of clang command:", code);
        return this.cancel();
      }
      completions = (function() {
        var _i, _len, _ref1, _results;
        _ref1 = this.clangOutput.trim().split('\n');
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          s = _ref1[_i];
          _results.push(this.convertClangCompletion(s));
        }
        return _results;
      }).call(this);
      items = _.remove(completions, void 0);
      this.setItems(items);
      if (items.length === 1) {
        return this.Selection();
      } else {
        this.editorView.appendToLinesView(this);
        this.setPosition();
        return this.focusFilterEditor();
      }
    };

    AutocompleteClangView.prototype.handleClangError = function(data) {
      return console.log(data.toString());
    };

    AutocompleteClangView.prototype.cancelled = function() {
      AutocompleteClangView.__super__.cancelled.apply(this, arguments);
      if (!this.editor.isDestroyed()) {
        this.editor.abortTransaction();
        this.editor.setSelectedBufferRanges(this.originalSelectionBufferRanges);
        return this.editorView.focus();
      }
    };

    AutocompleteClangView.prototype.replaceSelectedTextWithMatch = function(match) {
      var newSelectedBufferRanges;
      newSelectedBufferRanges = [];
      this.editor.getSelections().forEach((function(_this) {
        return function(selection, i) {
          var cursorPosition, startPosition;
          startPosition = selection.getBufferRange().start;
          selection.deleteSelectedText();
          cursorPosition = _this.editor.getCursors()[i].getBufferPosition();
          return newSelectedBufferRanges.push([startPosition, [startPosition.row, startPosition.column + match.word.length]]);
        };
      })(this));
      this.editor.insertText(match.word);
      return this.editor.setSelectedBufferRanges(newSelectedBufferRanges);
    };

    AutocompleteClangView.prototype.setPosition = function() {
      var height, left, parentWidth, potentialBottom, potentialTop, top, width, _ref1;
      _ref1 = this.editorView.pixelPositionForScreenPosition(this.originalCursorPosition), left = _ref1.left, top = _ref1.top;
      height = this.outerHeight();
      width = this.outerWidth();
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
      return this.editor.getCursors().forEach(function(cursor) {
        return snippets.insert(match.word, this.editor, cursor);
      });
    };

    return AutocompleteClangView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlIQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVIsQ0FBUCxDQUFBOztBQUFBLEVBRUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUZKLENBQUE7O0FBQUEsRUFHQyxRQUFTLE9BQUEsQ0FBUSxlQUFSLEVBQVQsS0FIRCxDQUFBOztBQUFBLEVBSUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSlAsQ0FBQTs7QUFBQSxFQUtDLGFBQWMsT0FBQSxDQUFRLElBQVIsRUFBZCxVQUxELENBQUE7O0FBQUEsRUFNQSxRQUFBLEdBQVcsT0FBQSxDQUFRLHVCQUFSLENBTlgsQ0FBQTs7QUFBQSxFQU9BLE9BQThCLE9BQUEsQ0FBUSxNQUFSLENBQTlCLEVBQUMsU0FBQSxDQUFELEVBQUcsVUFBQSxFQUFILEVBQU0sYUFBQSxLQUFOLEVBQVksc0JBQUEsY0FQWixDQUFBOztBQUFBLEVBU0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxhQUFSLENBVGIsQ0FBQTs7QUFBQSxFQVdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiw0Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsb0NBQUEsV0FBQSxHQUFhLEVBQWIsQ0FBQTs7QUFBQSxvQ0FDQSxTQUFBLEdBQVcsTUFEWCxDQUFBOztBQUFBLG9DQUdBLFVBQUEsR0FBWSxTQUFFLFVBQUYsR0FBQTtBQUNWLE1BRFcsSUFBQyxDQUFBLGFBQUEsVUFDWixDQUFBO0FBQUEsTUFBQSx1REFBQSxTQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSwyQkFBVixDQURBLENBQUE7QUFBQSxNQUVDLElBQUMsQ0FBQSxTQUFVLElBQUMsQ0FBQSxXQUFYLE1BRkYsQ0FBQTtBQUFBLE1BR0EsSUFB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
//# sourceURL=/Users/sarah/.atom/packages/autocomplete-clang/lib/autocomplete-clang-view.coffee