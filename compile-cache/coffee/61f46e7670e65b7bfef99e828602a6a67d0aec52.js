(function() {
  var $, CompositeDisposable, DecorationManagement, Delegato, Disposable, EditorView, Emitter, MinimapRenderView, ScrollView, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), EditorView = _ref.EditorView, ScrollView = _ref.ScrollView, $ = _ref.$;

  Emitter = require('emissary').Emitter;

  _ref1 = require('event-kit'), CompositeDisposable = _ref1.CompositeDisposable, Disposable = _ref1.Disposable;

  Delegato = require('delegato');

  DecorationManagement = require('./mixins/decoration-management');

  module.exports = MinimapRenderView = (function(_super) {
    __extends(MinimapRenderView, _super);

    Emitter.includeInto(MinimapRenderView);

    Delegato.includeInto(MinimapRenderView);

    DecorationManagement.includeInto(MinimapRenderView);

    MinimapRenderView.delegatesMethods('getMarker', 'findMarkers', {
      toProperty: 'editor'
    });

    MinimapRenderView.content = function() {
      return this.div({
        "class": 'minimap-editor editor editor-colors'
      }, (function(_this) {
        return function() {
          return _this.tag('canvas', {
            outlet: 'lineCanvas',
            "class": 'minimap-canvas',
            id: 'line-canvas'
          });
        };
      })(this));
    };

    MinimapRenderView.prototype.frameRequested = false;


    /* Public */

    function MinimapRenderView() {
      this.update = __bind(this.update, this);
      this.subscriptions = new CompositeDisposable;
      MinimapRenderView.__super__.constructor.apply(this, arguments);
      this.pendingChanges = [];
      this.context = this.lineCanvas[0].getContext('2d');
      this.tokenColorCache = {};
      this.decorationColorCache = {};
      this.initializeDecorations();
      this.tokenized = false;
      this.offscreenCanvas = document.createElement('canvas');
      this.offscreenCtxt = this.offscreenCanvas.getContext('2d');
    }

    MinimapRenderView.prototype.initialize = function() {
      this.lineCanvas.webkitImageSmoothingEnabled = false;
      this.interline = atom.config.get('minimap.interline');
      this.charWidth = atom.config.get('minimap.charWidth');
      this.charHeight = atom.config.get('minimap.charHeight');
      this.textOpacity = atom.config.get('minimap.textOpacity');
      this.subscriptions.add(this.asDisposable(atom.config.observe('minimap.interline', (function(_this) {
        return function(interline) {
          _this.interline = interline;
          _this.emit('minimap:scaleChanged');
          return _this.forceUpdate();
        };
      })(this))));
      this.subscriptions.add(this.asDisposable(atom.config.observe('minimap.charWidth', (function(_this) {
        return function(charWidth) {
          _this.charWidth = charWidth;
          _this.emit('minimap:scaleChanged');
          return _this.forceUpdate();
        };
      })(this))));
      this.subscriptions.add(this.asDisposable(atom.config.observe('minimap.charHeight', (function(_this) {
        return function(charHeight) {
          _this.charHeight = charHeight;
          _this.emit('minimap:scaleChanged');
          return _this.forceUpdate();
        };
      })(this))));
      return this.subscriptions.add(this.asDisposable(atom.config.observe('minimap.textOpacity', (function(_this) {
        return function(textOpacity) {
          _this.textOpacity = textOpacity;
          return _this.forceUpdate();
        };
      })(this))));
    };

    MinimapRenderView.prototype.destroy = function() {
      this.unsubscribe();
      this.subscriptions.dispose();
      return this.editorView = null;
    };

    MinimapRenderView.prototype.setEditorView = function(editorView) {
      this.editorView = editorView;
      this.editor = this.editorView.getModel();
      this.buffer = this.editorView.getEditor().getBuffer();
      this.displayBuffer = this.editor.displayBuffer;
      if (this.editor.onDidChangeScreenLines != null) {
        this.subscriptions.add(this.editor.onDidChangeScreenLines((function(_this) {
          return function(changes) {
            return _this.stackChanges(changes);
          };
        })(this)));
      } else {
        this.subscriptions.add(this.editor.onDidChange((function(_this) {
          return function(changes) {
            return _this.stackChanges(changes);
          };
        })(this)));
      }
      this.subscriptions.add(this.displayBuffer.onDidTokenize((function(_this) {
        return function() {
          _this.tokenized = true;
          return _this.forceUpdate();
        };
      })(this)));
      if (this.displayBuffer.tokenizedBuffer.fullyTokenized) {
        return this.tokenized = true;
      }
    };

    MinimapRenderView.prototype.update = function() {
      var firstRow, hasChanges, intact, intactRanges, lastRow, _i, _len;
      if (this.editorView == null) {
        return;
      }
      this.lineCanvas[0].width = this.lineCanvas[0].offsetWidth;
      this.lineCanvas[0].height = this.lineCanvas[0].offsetHeight;
      hasChanges = this.pendingChanges.length > 0;
      firstRow = this.getFirstVisibleScreenRow();
      lastRow = this.getLastVisibleScreenRow();
      intactRanges = this.computeIntactRanges(firstRow, lastRow);
      if (intactRanges.length === 0) {
        this.drawLines(this.context, firstRow, lastRow, 0);
      } else {
        for (_i = 0, _len = intactRanges.length; _i < _len; _i++) {
          intact = intactRanges[_i];
          this.copyBitmapPart(this.context, this.offscreenCanvas, intact.domStart, intact.start - firstRow, intact.end - intact.start);
        }
        this.fillGapsBetweenIntactRanges(this.context, intactRanges, firstRow, lastRow);
      }
      this.offscreenCanvas.width = this.lineCanvas[0].width;
      this.offscreenCanvas.height = this.lineCanvas[0].height;
      this.offscreenCtxt.drawImage(this.lineCanvas[0], 0, 0);
      this.offscreenFirstRow = firstRow;
      this.offscreenLastRow = lastRow;
      if (hasChanges) {
        return this.emit('minimap:updated');
      }
    };

    MinimapRenderView.prototype.requestUpdate = function() {
      if (this.frameRequested) {
        return;
      }
      this.frameRequested = true;
      return requestAnimationFrame((function(_this) {
        return function() {
          _this.update();
          return _this.frameRequested = false;
        };
      })(this));
    };

    MinimapRenderView.prototype.forceUpdate = function() {
      this.tokenColorCache = {};
      this.decorationColorCache = {};
      this.offscreenFirstRow = null;
      this.offscreenLastRow = null;
      return this.requestUpdate();
    };

    MinimapRenderView.prototype.stackChanges = function(changes) {
      this.pendingChanges.push(changes);
      return this.requestUpdate();
    };

    MinimapRenderView.prototype.scrollTop = function(scrollTop) {
      if (scrollTop == null) {
        return this.cachedScrollTop || 0;
      }
      if (scrollTop === this.cachedScrollTop) {
        return;
      }
      this.cachedScrollTop = scrollTop;
      return this.update();
    };

    MinimapRenderView.prototype.getMinimapHeight = function() {
      return this.getLinesCount() * this.getLineHeight();
    };

    MinimapRenderView.prototype.getLineHeight = function() {
      return this.charHeight + this.interline;
    };

    MinimapRenderView.prototype.getCharHeight = function() {
      return this.charHeight;
    };

    MinimapRenderView.prototype.getCharWidth = function() {
      return this.charWidth;
    };

    MinimapRenderView.prototype.getTextOpacity = function() {
      return this.textOpacity;
    };

    MinimapRenderView.prototype.getLinesCount = function() {
      return this.editorView.getEditor().getScreenLineCount();
    };

    MinimapRenderView.prototype.getMinimapScreenHeight = function() {
      return this.minimapView.height();
    };

    MinimapRenderView.prototype.getMinimapHeightInLines = function() {
      return Math.ceil(this.getMinimapScreenHeight() / this.getLineHeight());
    };

    MinimapRenderView.prototype.getFirstVisibleScreenRow = function() {
      var screenRow;
      screenRow = Math.floor(this.scrollTop() / this.getLineHeight());
      if (isNaN(screenRow)) {
        screenRow = 0;
      }
      return screenRow;
    };

    MinimapRenderView.prototype.getLastVisibleScreenRow = function() {
      var calculatedRow, screenRow;
      calculatedRow = Math.ceil((this.scrollTop() + this.getMinimapScreenHeight()) / this.getLineHeight()) - 1;
      screenRow = Math.max(0, Math.min(this.editor.getScreenLineCount() - 1, calculatedRow));
      if (isNaN(screenRow)) {
        screenRow = 0;
      }
      return screenRow;
    };

    MinimapRenderView.prototype.getClientRect = function() {
      var canvas;
      canvas = this.lineCanvas[0];
      return {
        width: canvas.scrollWidth,
        height: this.getMinimapHeight()
      };
    };

    MinimapRenderView.prototype.pixelPositionForScreenPosition = function(position) {
      var actualRow, column, row, _ref2;
      _ref2 = this.buffer.constructor.Point.fromObject(position), row = _ref2.row, column = _ref2.column;
      actualRow = Math.floor(row);
      return {
        top: row * this.getLineHeight(),
        left: column
      };
    };

    MinimapRenderView.prototype.getDefaultColor = function() {
      return this.transparentize(this.minimapView.editorView.css('color'), this.getTextOpacity());
    };

    MinimapRenderView.prototype.getTokenColor = function(token) {
      var color, flatScopes;
      flatScopes = token.scopes.join();
      if (!(flatScopes in this.tokenColorCache)) {
        color = this.retrieveTokenColorFromDom(token);
        this.tokenColorCache[flatScopes] = color;
      }
      return this.tokenColorCache[flatScopes];
    };

    MinimapRenderView.prototype.getDecorationColor = function(decoration) {
      var color, properties;
      properties = decoration.getProperties();
      if (properties.color != null) {
        return properties.color;
      }
      if (!(properties.scope in this.decorationColorCache)) {
        color = this.retrieveDecorationColorFromDom(decoration);
        this.decorationColorCache[properties.scope] = color;
      }
      return this.decorationColorCache[properties.scope];
    };

    MinimapRenderView.prototype.retrieveTokenColorFromDom = function(token) {
      var color;
      color = this.retrieveStyleFromDom(token.scopes, 'color');
      return this.transparentize(color, this.getTextOpacity());
    };

    MinimapRenderView.prototype.retrieveDecorationColorFromDom = function(decoration) {
      return this.retrieveStyleFromDom(decoration.getProperties().scope.split(/\s+/), 'background-color');
    };

    MinimapRenderView.prototype.retrieveStyleFromDom = function(scopes, property) {
      var node, parent, scope, value, _i, _len;
      this.ensureDummyNodeExistence();
      parent = this.dummyNode;
      for (_i = 0, _len = scopes.length; _i < _len; _i++) {
        scope = scopes[_i];
        node = document.createElement('span');
        node.className = scope.replace(/\.+/g, ' ');
        if (parent != null) {
          parent.appendChild(node);
        }
        parent = node;
      }
      value = getComputedStyle(parent).getPropertyValue(property);
      this.dummyNode.innerHTML = '';
      return value;
    };

    MinimapRenderView.prototype.ensureDummyNodeExistence = function() {
      if (this.dummyNode == null) {
        this.dummyNode = document.createElement('span');
        this.dummyNode.style.visibility = 'hidden';
        return this.editorView.append(this.dummyNode);
      }
    };

    MinimapRenderView.prototype.transparentize = function(color, opacity) {
      if (opacity == null) {
        opacity = 1;
      }
      return color.replace('rgb(', 'rgba(').replace(')', ", " + opacity + ")");
    };

    MinimapRenderView.prototype.drawLines = function(context, firstRow, lastRow, offsetRow) {
      var canvasWidth, charHeight, charWidth, color, decoration, decorations, displayCodeHighlights, highlightDecorations, line, lineDecorations, lineHeight, lines, re, row, screenRow, token, value, w, x, y, y0, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref2;
      if (firstRow > lastRow) {
        return;
      }
      lines = this.editor.tokenizedLinesForScreenRows(firstRow, lastRow);
      lineHeight = this.getLineHeight();
      charHeight = this.getCharHeight();
      charWidth = this.getCharWidth();
      canvasWidth = this.lineCanvas.width();
      displayCodeHighlights = this.minimapView.displayCodeHighlights;
      decorations = this.decorationsForScreenRowRange(firstRow, lastRow);
      line = lines[0];
      if (line.invisibles != null) {
        re = RegExp("" + line.invisibles.cr + "|" + line.invisibles.eol + "|" + line.invisibles.space + "|" + line.invisibles.tab, "g");
      }
      for (row = _i = 0, _len = lines.length; _i < _len; row = ++_i) {
        line = lines[row];
        x = 0;
        y = offsetRow + row;
        screenRow = firstRow + row;
        y0 = y * lineHeight;
        lineDecorations = this.decorationsByTypesForRow(screenRow, 'line', decorations);
        for (_j = 0, _len1 = lineDecorations.length; _j < _len1; _j++) {
          decoration = lineDecorations[_j];
          context.fillStyle = this.getDecorationColor(decoration);
          context.fillRect(0, y0, canvasWidth, lineHeight);
        }
        highlightDecorations = this.decorationsByTypesForRow(firstRow + row, 'highlight-under', decorations);
        for (_k = 0, _len2 = highlightDecorations.length; _k < _len2; _k++) {
          decoration = highlightDecorations[_k];
          this.drawHighlightDecoration(context, decoration, y, screenRow, lineHeight, charWidth, canvasWidth);
        }
        _ref2 = line.tokens;
        for (_l = 0, _len3 = _ref2.length; _l < _len3; _l++) {
          token = _ref2[_l];
          w = token.screenDelta;
          if (!token.isOnlyWhitespace()) {
            color = displayCodeHighlights && this.tokenized ? this.getTokenColor(token) : this.getDefaultColor();
            value = token.value;
            if (re != null) {
              value = value.replace(re, ' ');
            }
            x = this.drawToken(context, value, color, x, y0, charWidth, charHeight);
          } else {
            x += w * charWidth;
          }
        }
        highlightDecorations = this.decorationsByTypesForRow(firstRow + row, 'highlight', 'highlight-over', decorations);
        for (_m = 0, _len4 = highlightDecorations.length; _m < _len4; _m++) {
          decoration = highlightDecorations[_m];
          this.drawHighlightDecoration(context, decoration, y, screenRow, lineHeight, charWidth, canvasWidth);
        }
      }
      return context.fill();
    };

    MinimapRenderView.prototype.drawToken = function(context, text, color, x, y, charWidth, charHeight) {
      var char, chars, _i, _len;
      context.fillStyle = color;
      chars = 0;
      for (_i = 0, _len = text.length; _i < _len; _i++) {
        char = text[_i];
        if (/\s/.test(char)) {
          if (chars > 0) {
            context.fillRect(x - (chars * charWidth), y, chars * charWidth, charHeight);
          }
          chars = 0;
        } else {
          chars++;
        }
        x += charWidth;
      }
      if (chars > 0) {
        context.fillRect(x - (chars * charWidth), y, chars * charWidth, charHeight);
      }
      return x;
    };

    MinimapRenderView.prototype.drawHighlightDecoration = function(context, decoration, y, screenRow, lineHeight, charWidth, canvasWidth) {
      var colSpan, range, rowSpan, x;
      context.fillStyle = this.getDecorationColor(decoration);
      range = decoration.getMarker().getScreenRange();
      rowSpan = range.end.row - range.start.row;
      if (rowSpan === 0) {
        colSpan = range.end.column - range.start.column;
        return context.fillRect(range.start.column * charWidth, y * lineHeight, colSpan * charWidth, lineHeight);
      } else {
        if (screenRow === range.start.row) {
          x = range.start.column * charWidth;
          return context.fillRect(x, y * lineHeight, canvasWidth - x, lineHeight);
        } else if (screenRow === range.end.row) {
          return context.fillRect(0, y * lineHeight, range.end.column * charWidth, lineHeight);
        } else {
          return context.fillRect(0, y * lineHeight, canvasWidth, lineHeight);
        }
      }
    };

    MinimapRenderView.prototype.copyBitmapPart = function(context, bitmapCanvas, srcRow, destRow, rowCount) {
      var lineHeight;
      lineHeight = this.getLineHeight();
      return context.drawImage(bitmapCanvas, 0, srcRow * lineHeight, bitmapCanvas.width, rowCount * lineHeight, 0, destRow * lineHeight, bitmapCanvas.width, rowCount * lineHeight);
    };


    /* Internal */

    MinimapRenderView.prototype.fillGapsBetweenIntactRanges = function(context, intactRanges, firstRow, lastRow) {
      var currentRow, intact, _i, _len;
      currentRow = firstRow;
      for (_i = 0, _len = intactRanges.length; _i < _len; _i++) {
        intact = intactRanges[_i];
        this.drawLines(context, currentRow, intact.start - 1, currentRow - firstRow);
        currentRow = intact.end;
      }
      if (currentRow <= lastRow) {
        return this.drawLines(context, currentRow, lastRow, currentRow - firstRow);
      }
    };

    MinimapRenderView.prototype.computeIntactRanges = function(firstRow, lastRow) {
      var change, intactRange, intactRanges, newIntactRanges, range, _i, _j, _len, _len1, _ref2;
      if ((this.offscreenFirstRow == null) && (this.offscreenLastRow == null)) {
        return [];
      }
      intactRanges = [
        {
          start: this.offscreenFirstRow,
          end: this.offscreenLastRow,
          domStart: 0
        }
      ];
      _ref2 = this.pendingChanges;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        change = _ref2[_i];
        newIntactRanges = [];
        for (_j = 0, _len1 = intactRanges.length; _j < _len1; _j++) {
          range = intactRanges[_j];
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
          intactRange = newIntactRanges[newIntactRanges.length - 1];
          if ((intactRange != null) && (isNaN(intactRange.end) || isNaN(intactRange.start))) {
            debugger;
          }
        }
        intactRanges = newIntactRanges;
      }
      this.truncateIntactRanges(intactRanges, firstRow, lastRow);
      this.pendingChanges = [];
      return intactRanges;
    };

    MinimapRenderView.prototype.truncateIntactRanges = function(intactRanges, firstRow, lastRow) {
      var i, range;
      i = 0;
      while (i < intactRanges.length) {
        range = intactRanges[i];
        if (range.start < firstRow) {
          range.domStart += firstRow - range.start;
          range.start = firstRow;
        }
        if (range.end > lastRow) {
          range.end = lastRow;
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

    MinimapRenderView.prototype.asDisposable = function(subscription) {
      return new Disposable(function() {
        return subscription.off();
      });
    };

    return MinimapRenderView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1JQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBOEIsT0FBQSxDQUFRLE1BQVIsQ0FBOUIsRUFBQyxrQkFBQSxVQUFELEVBQWEsa0JBQUEsVUFBYixFQUF5QixTQUFBLENBQXpCLENBQUE7O0FBQUEsRUFDQyxVQUFXLE9BQUEsQ0FBUSxVQUFSLEVBQVgsT0FERCxDQUFBOztBQUFBLEVBRUEsUUFBb0MsT0FBQSxDQUFRLFdBQVIsQ0FBcEMsRUFBQyw0QkFBQSxtQkFBRCxFQUFzQixtQkFBQSxVQUZ0QixDQUFBOztBQUFBLEVBR0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxVQUFSLENBSFgsQ0FBQTs7QUFBQSxFQUlBLG9CQUFBLEdBQXVCLE9BQUEsQ0FBUSxnQ0FBUixDQUp2QixDQUFBOztBQUFBLEVBUUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHdDQUFBLENBQUE7O0FBQUEsSUFBQSxPQUFPLENBQUMsV0FBUixDQUFvQixpQkFBcEIsQ0FBQSxDQUFBOztBQUFBLElBQ0EsUUFBUSxDQUFDLFdBQVQsQ0FBcUIsaUJBQXJCLENBREEsQ0FBQTs7QUFBQSxJQUVBLG9CQUFvQixDQUFDLFdBQXJCLENBQWlDLGlCQUFqQyxDQUZBLENBQUE7O0FBQUEsSUFLQSxpQkFBQyxDQUFBLGdCQUFELENBQWtCLFdBQWxCLEVBQStCLGFBQS9CLEVBQThDO0FBQUEsTUFBQSxVQUFBLEVBQVksUUFBWjtLQUE5QyxDQUxBLENBQUE7O0FBQUEsSUFPQSxpQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8scUNBQVA7T0FBTCxFQUFtRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNqRCxLQUFD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
//# sourceURL=/Users/sarah/.atom/packages/minimap/lib/minimap-render-view.coffee