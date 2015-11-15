(function() {
  var $, CompositeDisposable, DecorationManagement, Delegato, EditorView, Emitter, MinimapRenderView, ScrollView, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), EditorView = _ref.EditorView, ScrollView = _ref.ScrollView, $ = _ref.$;

  Emitter = require('emissary').Emitter;

  CompositeDisposable = require('event-kit').CompositeDisposable;

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
      MinimapRenderView.__super__.constructor.apply(this, arguments);
      this.pendingChanges = [];
      this.context = this.lineCanvas[0].getContext('2d');
      this.tokenColorCache = {};
      this.decorationColorCache = {};
      this.initializeDecorations();
      this.tokenized = false;
      this.subscriptions = new CompositeDisposable;
      this.offscreenCanvas = document.createElement('canvas');
      this.offscreenCtxt = this.offscreenCanvas.getContext('2d');
    }

    MinimapRenderView.prototype.initialize = function() {
      this.lineCanvas.webkitImageSmoothingEnabled = false;
      this.interline = atom.config.get('minimap.interline');
      this.charWidth = atom.config.get('minimap.charWidth');
      this.charHeight = atom.config.get('minimap.charHeight');
      this.textOpacity = atom.config.get('minimap.textOpacity');
      atom.config.observe('minimap.interline', (function(_this) {
        return function(interline) {
          _this.interline = interline;
          _this.emit('minimap:scaleChanged');
          return _this.forceUpdate();
        };
      })(this));
      atom.config.observe('minimap.charWidth', (function(_this) {
        return function(charWidth) {
          _this.charWidth = charWidth;
          return _this.forceUpdate();
        };
      })(this));
      atom.config.observe('minimap.charHeight', (function(_this) {
        return function(charHeight) {
          _this.charHeight = charHeight;
          return _this.forceUpdate();
        };
      })(this));
      return atom.config.observe('minimap.textOpacity', (function(_this) {
        return function(textOpacity) {
          _this.textOpacity = textOpacity;
          return _this.forceUpdate();
        };
      })(this));
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
      var actualRow, column, row, _ref1;
      _ref1 = this.buffer.constructor.Point.fromObject(position), row = _ref1.row, column = _ref1.column;
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
      var canvasWidth, charHeight, charWidth, color, decoration, decorations, displayCodeHighlights, highlightDecorations, line, lineDecorations, lineHeight, lines, re, row, screenRow, token, value, w, x, y, y0, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref1;
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
        _ref1 = line.tokens;
        for (_l = 0, _len3 = _ref1.length; _l < _len3; _l++) {
          token = _ref1[_l];
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
      var change, intactRange, intactRanges, newIntactRanges, range, _i, _j, _len, _len1, _ref1;
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
      _ref1 = this.pendingChanges;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        change = _ref1[_i];
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

    return MinimapRenderView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdIQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBOEIsT0FBQSxDQUFRLE1BQVIsQ0FBOUIsRUFBQyxrQkFBQSxVQUFELEVBQWEsa0JBQUEsVUFBYixFQUF5QixTQUFBLENBQXpCLENBQUE7O0FBQUEsRUFDQyxVQUFXLE9BQUEsQ0FBUSxVQUFSLEVBQVgsT0FERCxDQUFBOztBQUFBLEVBRUMsc0JBQXVCLE9BQUEsQ0FBUSxXQUFSLEVBQXZCLG1CQUZELENBQUE7O0FBQUEsRUFHQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFVBQVIsQ0FIWCxDQUFBOztBQUFBLEVBSUEsb0JBQUEsR0FBdUIsT0FBQSxDQUFRLGdDQUFSLENBSnZCLENBQUE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osd0NBQUEsQ0FBQTs7QUFBQSxJQUFBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLGlCQUFwQixDQUFBLENBQUE7O0FBQUEsSUFDQSxRQUFRLENBQUMsV0FBVCxDQUFxQixpQkFBckIsQ0FEQSxDQUFBOztBQUFBLElBRUEsb0JBQW9CLENBQUMsV0FBckIsQ0FBaUMsaUJBQWpDLENBRkEsQ0FBQTs7QUFBQSxJQUtBLGlCQUFDLENBQUEsZ0JBQUQsQ0FBa0IsV0FBbEIsRUFBK0IsYUFBL0IsRUFBOEM7QUFBQSxNQUFBLFVBQUEsRUFBWSxRQUFaO0tBQTlDLENBTEEsQ0FBQTs7QUFBQSxJQU9BLGlCQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxxQ0FBUDtPQUFMLEVBQW1ELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ2pELEtBQUMsQ0FBQSxHQUFELENBQUssUUFBTCxFQUFlO0FB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
//# sourceURL=/Users/sarah/.atom/packages/minimap/lib/minimap-render-view.coffee