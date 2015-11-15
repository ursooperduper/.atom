(function() {
  var $, Debug, EditorView, Emitter, MinimapEditorView, ScrollView, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('atom'), EditorView = _ref.EditorView, ScrollView = _ref.ScrollView, $ = _ref.$;

  Emitter = require('emissary').Emitter;

  Debug = require('prolix');

  module.exports = MinimapEditorView = (function(_super) {
    __extends(MinimapEditorView, _super);

    Emitter.includeInto(MinimapEditorView);

    Debug('minimap').includeInto(MinimapEditorView);

    MinimapEditorView.content = function() {
      return this.div({
        "class": 'minimap-editor editor editor-colors'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'scroll-view',
            outlet: 'scrollView'
          }, function() {
            return _this.div({
              "class": 'lines',
              outlet: 'lines'
            });
          });
        };
      })(this));
    };

    MinimapEditorView.prototype.frameRequested = false;

    MinimapEditorView.prototype.dummyNode = document.createElement('div');

    function MinimapEditorView() {
      this.update = __bind(this.update, this);
      this.registerBufferChanges = __bind(this.registerBufferChanges, this);
      MinimapEditorView.__super__.constructor.apply(this, arguments);
      this.pendingChanges = [];
      this.lineClasses = {};
    }

    MinimapEditorView.prototype.initialize = function() {
      this.lineOverdraw = atom.config.get('minimap.lineOverdraw');
      atom.config.observe('minimap.lineOverdraw', (function(_this) {
        return function() {
          return _this.lineOverdraw = atom.config.get('minimap.lineOverdraw');
        };
      })(this));
      atom.config.observe('editor.lineHeight', (function(_this) {
        return function() {
          if (_this.editorView != null) {
            return _this.lines.css({
              lineHeight: "" + (_this.getLineHeight()) + "px"
            });
          }
        };
      })(this));
      return atom.config.observe('editor.fontSize', (function(_this) {
        return function() {
          if (_this.editorView != null) {
            return _this.lines.css({
              fontSize: "" + (_this.getFontSize()) + "px"
            });
          }
        };
      })(this));
    };

    MinimapEditorView.prototype.pixelPositionForScreenPosition = function(position) {
      var actualRow, column, row, _ref1;
      _ref1 = this.buffer.constructor.Point.fromObject(position), row = _ref1.row, column = _ref1.column;
      actualRow = Math.floor(row);
      return {
        top: row * this.getLineHeight(),
        left: column
      };
    };

    MinimapEditorView.prototype.destroy = function() {
      this.unsubscribe();
      return this.editorView = null;
    };

    MinimapEditorView.prototype.setEditorView = function(editorView) {
      this.editorView = editorView;
      this.editor = this.editorView.getModel();
      this.buffer = this.editorView.getEditor().buffer;
      this.lines.css({
        lineHeight: "" + (this.getLineHeight()) + "px",
        fontSize: "" + (this.getFontSize()) + "px"
      });
      return this.subscribe(this.editor, 'screen-lines-changed.minimap', (function(_this) {
        return function(changes) {
          _this.pendingChanges.push(changes);
          return _this.requestUpdate();
        };
      })(this));
    };

    MinimapEditorView.prototype.requestUpdate = function() {
      if (this.frameRequested) {
        return;
      }
      this.frameRequested = true;
      return setImmediate((function(_this) {
        return function() {
          _this.startBench();
          _this.update();
          _this.endBench('minimap update');
          return _this.frameRequested = false;
        };
      })(this));
    };

    MinimapEditorView.prototype.scrollTop = function(scrollTop, options) {
      if (options == null) {
        options = {};
      }
      if (scrollTop == null) {
        return this.cachedScrollTop || 0;
      }
      if (scrollTop === this.cachedScrollTop) {
        return;
      }
      this.cachedScrollTop = scrollTop;
      return this.requestUpdate();
    };

    MinimapEditorView.prototype.addLineClass = function(line, cls) {
      var index, _base, _ref1;
      (_base = this.lineClasses)[line] || (_base[line] = []);
      this.lineClasses[line].push(cls);
      if ((this.firstRenderedScreenRow != null) && line >= this.firstRenderedScreenRow && line <= this.lastRenderedScreenRow) {
        index = line - this.firstRenderedScreenRow - 1;
        return (_ref1 = this.lines.children()[index]) != null ? _ref1.classList.add(cls) : void 0;
      }
    };

    MinimapEditorView.prototype.removeLineClass = function(line, cls) {
      var index, _ref1;
      if (this.lineClasses[line] && (index = this.lineClasses[line].indexOf(cls)) !== -1) {
        this.lineClasses[line].splice(index, 1);
      }
      if ((this.firstRenderedScreenRow != null) && line >= this.firstRenderedScreenRow && line <= this.lastRenderedScreenRow) {
        index = line - this.firstRenderedScreenRow - 1;
        return (_ref1 = this.lines.children()[index]) != null ? _ref1.classList.remove(cls) : void 0;
      }
    };

    MinimapEditorView.prototype.removeAllLineClasses = function() {
      var classes, classesToRemove, cls, k, _i, _len, _ref1;
      classesToRemove = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _ref1 = this.lineClasses;
      for (k in _ref1) {
        classes = _ref1[k];
        for (_i = 0, _len = classes.length; _i < _len; _i++) {
          cls = classes[_i];
          if (classesToRemove.length === 0 || __indexOf.call(classesToRemove, cls) >= 0) {
            this.find("." + cls).removeClass(cls);
          }
        }
      }
      return this.lineClasses = {};
    };

    MinimapEditorView.prototype.registerBufferChanges = function(event) {
      return this.pendingChanges.push(event);
    };

    MinimapEditorView.prototype.getMinimapHeight = function() {
      return this.getLinesCount() * this.getLineHeight();
    };

    MinimapEditorView.prototype.getLineHeight = function() {
      return this.lineHeight || (this.lineHeight = Math.round(parseInt(this.editorView.find('.lines').css('line-height')) * this.minimapView.scaleY));
    };

    MinimapEditorView.prototype.getFontSize = function() {
      return this.fontSize || (this.fontSize = Math.round(parseInt(this.editorView.find('.lines').css('font-size')) * this.minimapView.scaleY));
    };

    MinimapEditorView.prototype.getLinesCount = function() {
      return this.editorView.getEditor().getScreenLineCount();
    };

    MinimapEditorView.prototype.getMinimapScreenHeight = function() {
      return this.minimapView.height();
    };

    MinimapEditorView.prototype.getMinimapHeightInLines = function() {
      return Math.ceil(this.getMinimapScreenHeight() / this.getLineHeight());
    };

    MinimapEditorView.prototype.getFirstVisibleScreenRow = function() {
      var screenRow;
      screenRow = Math.floor(this.scrollTop() / this.getLineHeight());
      if (isNaN(screenRow)) {
        screenRow = 0;
      }
      return screenRow;
    };

    MinimapEditorView.prototype.getLastVisibleScreenRow = function() {
      var calculatedRow, screenRow;
      calculatedRow = Math.ceil((this.scrollTop() + this.getMinimapScreenHeight()) / this.getLineHeight()) - 1;
      screenRow = Math.max(0, Math.min(this.editor.getScreenLineCount() - 1, calculatedRow));
      if (isNaN(screenRow)) {
        screenRow = 0;
      }
      return screenRow;
    };

    MinimapEditorView.prototype.update = function() {
      var changes, firstVisibleScreenRow, has_no_changes, intactRanges, lastScreenRow, lastScreenRowToRender, node, renderFrom, renderTo;
      if (this.editorView == null) {
        return;
      }
      firstVisibleScreenRow = this.getFirstVisibleScreenRow();
      lastScreenRowToRender = firstVisibleScreenRow + this.getMinimapHeightInLines() - 1;
      lastScreenRow = this.editor.getLastScreenRow();
      if ((this.firstRenderedScreenRow != null) && firstVisibleScreenRow >= this.firstRenderedScreenRow && lastScreenRowToRender <= this.lastRenderedScreenRow) {
        renderFrom = Math.min(lastScreenRow, this.firstRenderedScreenRow);
        renderTo = Math.min(lastScreenRow, this.lastRenderedScreenRow);
      } else {
        renderFrom = Math.min(lastScreenRow, Math.max(0, firstVisibleScreenRow - this.lineOverdraw));
        renderTo = Math.min(lastScreenRow, lastScreenRowToRender + this.lineOverdraw);
      }
      has_no_changes = this.pendingChanges.length === 0 && this.firstRenderedScreenRow && this.firstRenderedScreenRow <= renderFrom && renderTo <= this.lastRenderedScreenRow;
      if (has_no_changes) {
        return;
      }
      changes = this.pendingChanges;
      intactRanges = this.computeIntactRanges(renderFrom, renderTo);
      node = this.lines[0];
      node.classList.add('hidden');
      this.clearDirtyRanges(intactRanges);
      this.fillDirtyRanges(intactRanges, renderFrom, renderTo);
      this.firstRenderedScreenRow = renderFrom;
      this.lastRenderedScreenRow = renderTo;
      this.updatePaddingOfRenderedLines();
      node.classList.remove('hidden');
      return this.emit('minimap:updated');
    };

    MinimapEditorView.prototype.computeIntactRanges = function(renderFrom, renderTo) {
      var change, changes, emptyLineChanges, intactRanges, newIntactRanges, range, _i, _j, _k, _len, _len1, _len2, _ref1, _ref2, _ref3;
      if ((this.firstRenderedScreenRow == null) && (this.lastRenderedScreenRow == null)) {
        return [];
      }
      intactRanges = [
        {
          start: this.firstRenderedScreenRow,
          end: this.lastRenderedScreenRow,
          domStart: 0
        }
      ];
      if (this.editorView.showIndentGuide) {
        emptyLineChanges = [];
        _ref1 = this.pendingChanges;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          change = _ref1[_i];
          changes = this.computeSurroundingEmptyLineChanges(change);
          emptyLineChanges.push.apply(emptyLineChanges, changes);
        }
        (_ref2 = this.pendingChanges).push.apply(_ref2, emptyLineChanges);
      }
      _ref3 = this.pendingChanges;
      for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
        change = _ref3[_j];
        newIntactRanges = [];
        for (_k = 0, _len2 = intactRanges.length; _k < _len2; _k++) {
          range = intactRanges[_k];
          if (change.end < range.start && change.screenDelta !== 0) {
            newIntactRanges.push({
              start: range.start + change.screenDelta,
              end: range.end + change.screenDelta,
              domStart: range.domStart
            });
          } else if (change.end < range.start || change.start > range.end) {
            newIntactRanges.push(range);
          } else {
            if (change.start > range.start) {
              newIntactRanges.push({
                start: range.start,
                end: change.start - 1,
                domStart: range.domStart
              });
            }
            if (change.end < range.end) {
              newIntactRanges.push({
                start: change.end + change.screenDelta + 1,
                end: range.end + change.screenDelta,
                domStart: range.domStart + change.end + 1 - range.start
              });
            }
          }
        }
        intactRanges = newIntactRanges;
      }
      this.truncateIntactRanges(intactRanges, renderFrom, renderTo);
      this.pendingChanges = [];
      return intactRanges;
    };

    MinimapEditorView.prototype.truncateIntactRanges = function(intactRanges, renderFrom, renderTo) {
      var i, range;
      i = 0;
      while (i < intactRanges.length) {
        range = intactRanges[i];
        if (range.start < renderFrom) {
          range.domStart += renderFrom - range.start;
          range.start = renderFrom;
        }
        if (range.end > renderTo) {
          range.end = renderTo;
        }
        if (range.start >= range.end) {
          intactRanges.splice(i--, 1);
        }
        i++;
      }
      return intactRanges.sort(function(a, b) {
        return a.domStart - b.domStart;
      });
    };

    MinimapEditorView.prototype.computeSurroundingEmptyLineChanges = function(change) {
      var afterEnd, afterStart, beforeEnd, beforeStart, emptyLineChanges;
      emptyLineChanges = [];
      if (change.bufferDelta != null) {
        afterStart = change.end + change.bufferDelta + 1;
        if (this.editor.lineForBufferRow(afterStart) === '') {
          afterEnd = afterStart;
          while (this.editor.lineForBufferRow(afterEnd + 1) === '') {
            afterEnd++;
          }
          emptyLineChanges.push({
            start: afterStart,
            end: afterEnd,
            screenDelta: 0
          });
        }
        beforeEnd = change.start - 1;
        if (this.editor.lineForBufferRow(beforeEnd) === '') {
          beforeStart = beforeEnd;
          while (this.editor.lineForBufferRow(beforeStart - 1) === '') {
            beforeStart--;
          }
          emptyLineChanges.push({
            start: beforeStart,
            end: beforeEnd,
            screenDelta: 0
          });
        }
      }
      return emptyLineChanges;
    };

    MinimapEditorView.prototype.clearDirtyRanges = function(intactRanges) {
      var currentLine, domPosition, i, intactRange, _i, _j, _len, _ref1, _ref2, _results;
      if (intactRanges.length === 0) {
        return this.lines[0].innerHTML = '';
      } else if (currentLine = this.lines[0].firstChild) {
        if (currentLine == null) {
          console.warn("Unexpected undefined first line in clearing dirty ranges");
          return;
        }
        domPosition = 0;
        for (_i = 0, _len = intactRanges.length; _i < _len; _i++) {
          intactRange = intactRanges[_i];
          while (intactRange.domStart > domPosition) {
            if (currentLine == null) {
              console.warn("Unexpected undefined line at dom position " + domPosition + " with range starting at position " + intactRange.domStart + " (" + intactRange.start + ".." + intactRange.end + ")");
              return;
            }
            currentLine = this.clearLine(currentLine);
            domPosition++;
          }
          for (i = _j = _ref1 = intactRange.start, _ref2 = intactRange.end; _ref1 <= _ref2 ? _j <= _ref2 : _j >= _ref2; i = _ref1 <= _ref2 ? ++_j : --_j) {
            if (currentLine == null) {
              console.warn("Unexpected undefined line when clearing dirty range " + intactRange.start + ".." + intactRange.end);
              return;
            }
            currentLine = currentLine.nextSibling;
            domPosition++;
          }
        }
        _results = [];
        while (currentLine) {
          _results.push(currentLine = this.clearLine(currentLine));
        }
        return _results;
      }
    };

    MinimapEditorView.prototype.clearLine = function(lineElement) {
      var next;
      next = lineElement.nextSibling;
      this.lines[0].removeChild(lineElement);
      return next;
    };

    MinimapEditorView.prototype.fillDirtyRanges = function(intactRanges, renderFrom, renderTo) {
      var classes, currentLine, dirtyRangeEnd, html, i, line, lineElement, lines, linesComponent, nextIntact, re, row, _base, _results;
      i = 0;
      nextIntact = intactRanges[i];
      currentLine = this.lines[0].firstChild;
      row = renderFrom;
      _results = [];
      while (row <= renderTo) {
        if (row === (nextIntact != null ? nextIntact.end : void 0) + 1) {
          nextIntact = intactRanges[++i];
        }
        if (!nextIntact || row < nextIntact.start) {
          if (nextIntact) {
            dirtyRangeEnd = nextIntact.start - 1;
          } else {
            dirtyRangeEnd = renderTo;
          }
          linesComponent = this.editorView.component.refs.lines;
          lines = this.editor.linesForScreenRows(row, dirtyRangeEnd);
          (_base = linesComponent.props).lineDecorations || (_base.lineDecorations = {});
          line = lines[0];
          re = RegExp("" + line.invisibles.cr + "|" + line.invisibles.eol + "|" + line.invisibles.space + "|" + line.invisibles.tab, "g");
          _results.push((function() {
            var _i, _len, _ref1, _results1;
            _results1 = [];
            for (_i = 0, _len = lines.length; _i < _len; _i++) {
              line = lines[_i];
              if (this.minimapView.displayCodeHighlights) {
                html = linesComponent.buildLineHTML(line, row);
                this.dummyNode.innerHTML = html;
                lineElement = this.dummyNode.childNodes[0];
              } else {
                if (line.text.length === 0) {
                  html = ' ';
                } else {
                  html = line.text.replace(re, ' ');
                }
                lineElement = document.createElement('div');
                lineElement.className = 'line';
                lineElement.textContent = html;
              }
              if (lineElement == null) {
                console.warn("Unexpected undefined line element at screen row " + screenRow);
                continue;
              }
              classes = this.classesForRow(row);
              lineElement.className = 'line';
              if (classes != null) {
                (_ref1 = lineElement.classList).add.apply(_ref1, classes);
              }
              lineElement.style.cssText = "";
              this.lines[0].insertBefore(lineElement, currentLine);
              _results1.push(row++);
            }
            return _results1;
          }).call(this));
        } else {
          currentLine = currentLine != null ? currentLine.nextSibling : void 0;
          _results.push(row++);
        }
      }
      return _results;
    };

    MinimapEditorView.prototype.classesForRow = function(row) {
      return this.lineClasses[row + 1];
    };

    MinimapEditorView.prototype.updatePaddingOfRenderedLines = function() {
      var paddingBottom, paddingTop;
      paddingTop = this.firstRenderedScreenRow * this.lineHeight;
      this.lines.css('padding-top', paddingTop);
      paddingBottom = (this.editor.getLastScreenRow() - this.lastRenderedScreenRow) * this.lineHeight;
      return this.lines.css('padding-bottom', paddingBottom);
    };

    MinimapEditorView.prototype.getClientRect = function() {
      var sv;
      sv = this.scrollView[0];
      return {
        width: sv.scrollWidth,
        height: sv.scrollHeight
      };
    };

    return MinimapEditorView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtFQUFBO0lBQUE7Ozs7eUpBQUE7O0FBQUEsRUFBQSxPQUE4QixPQUFBLENBQVEsTUFBUixDQUE5QixFQUFDLGtCQUFBLFVBQUQsRUFBYSxrQkFBQSxVQUFiLEVBQXlCLFNBQUEsQ0FBekIsQ0FBQTs7QUFBQSxFQUNDLFVBQVcsT0FBQSxDQUFRLFVBQVIsRUFBWCxPQURELENBQUE7O0FBQUEsRUFFQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFFBQVIsQ0FGUixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHdDQUFBLENBQUE7O0FBQUEsSUFBQSxPQUFPLENBQUMsV0FBUixDQUFvQixpQkFBcEIsQ0FBQSxDQUFBOztBQUFBLElBQ0EsS0FBQSxDQUFNLFNBQU4sQ0FBZ0IsQ0FBQyxXQUFqQixDQUE2QixpQkFBN0IsQ0FEQSxDQUFBOztBQUFBLElBR0EsaUJBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLHFDQUFQO09BQUwsRUFBbUQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDakQsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLGFBQVA7QUFBQSxZQUFzQixNQUFBLEVBQVEsWUFBOUI7V0FBTCxFQUFpRCxTQUFBLEdBQUE7bUJBQy9DLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxPQUFQO0FBQUEsY0FBZ0IsTUFBQSxFQUFRLE9BQXhCO2FBQUwsRUFEK0M7VUFBQSxDQUFqRCxFQURpRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5ELEVBRFE7SUFBQSxDQUhWLENBQUE7O0FB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
//# sourceURL=/Users/sarah/.atom/packages/minimap/lib/minimap-editor-view.coffee