(function() {
  var $, CompositeDisposable, Delegato, EditorView, MinimapIndicator, MinimapOpenQuickSettingsView, MinimapRenderView, MinimapView, View, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), $ = _ref.$, View = _ref.View, EditorView = _ref.EditorView;

  Delegato = require('delegato');

  CompositeDisposable = require('event-kit').CompositeDisposable;

  MinimapRenderView = require('./minimap-render-view');

  MinimapIndicator = require('./minimap-indicator');

  MinimapOpenQuickSettingsView = require('./minimap-open-quick-settings-view');

  module.exports = MinimapView = (function(_super) {
    __extends(MinimapView, _super);

    Delegato.includeInto(MinimapView);

    MinimapView.delegatesMethods('getLineHeight', 'getCharHeight', 'getCharWidth', 'getLinesCount', 'getMinimapHeight', 'getMinimapScreenHeight', 'getMinimapHeightInLines', 'getFirstVisibleScreenRow', 'getLastVisibleScreenRow', 'pixelPositionForScreenPosition', 'decorateMarker', 'removeDecoration', 'decorationsForScreenRowRange', 'removeAllDecorationsForMarker', {
      toProperty: 'renderView'
    });

    MinimapView.delegatesMethods('getSelection', 'getSelections', 'getLastSelection', 'bufferRangeForBufferRow', 'getTextInBufferRange', 'getEofBufferPosition', 'scanInBufferRange', 'markBufferRange', {
      toProperty: 'editor'
    });

    MinimapView.delegatesProperty('lineHeight', {
      toMethod: 'getLineHeight'
    });

    MinimapView.delegatesProperty('charWidth', {
      toMethod: 'getCharWidth'
    });

    MinimapView.content = function() {
      return this.div({
        "class": 'minimap'
      }, (function(_this) {
        return function() {
          if (atom.config.get('minimap.displayPluginsControls')) {
            _this.subview('openQuickSettings', new MinimapOpenQuickSettingsView);
          }
          _this.div({
            outlet: 'miniScroller',
            "class": "minimap-scroller"
          });
          return _this.div({
            outlet: 'miniWrapper',
            "class": "minimap-wrapper"
          }, function() {
            _this.div({
              outlet: 'miniUnderlayer',
              "class": "minimap-underlayer"
            });
            _this.subview('renderView', new MinimapRenderView);
            return _this.div({
              outlet: 'miniOverlayer',
              "class": "minimap-overlayer"
            }, function() {
              return _this.div({
                outlet: 'miniVisibleArea',
                "class": "minimap-visible-area"
              });
            });
          });
        };
      })(this));
    };

    MinimapView.prototype.isClicked = false;


    /* Public */

    function MinimapView(editorView) {
      this.editorView = editorView;
      this.onDrag = __bind(this.onDrag, this);
      this.onMove = __bind(this.onMove, this);
      this.onDragStart = __bind(this.onDragStart, this);
      this.onScrollViewResized = __bind(this.onScrollViewResized, this);
      this.onMouseDown = __bind(this.onMouseDown, this);
      this.onMouseWheel = __bind(this.onMouseWheel, this);
      this.onActiveItemChanged = __bind(this.onActiveItemChanged, this);
      this.updateScroll = __bind(this.updateScroll, this);
      this.updateScrollX = __bind(this.updateScrollX, this);
      this.updateScrollY = __bind(this.updateScrollY, this);
      this.updateMinimapSize = __bind(this.updateMinimapSize, this);
      this.updateMinimapRenderView = __bind(this.updateMinimapRenderView, this);
      this.updateMinimapView = __bind(this.updateMinimapView, this);
      this.editor = this.editorView.getEditor();
      this.paneView = this.editorView.getPaneView();
      this.paneView.addClass('with-minimap');
      this.subscriptions = new CompositeDisposable;
      MinimapView.__super__.constructor.apply(this, arguments);
      this.computeScale();
      this.miniScrollView = this.renderView.scrollView;
      this.offsetLeft = 0;
      this.offsetTop = 0;
      this.indicator = new MinimapIndicator();
      this.scrollView = this.editorView.scrollView;
      this.scrollViewLines = this.scrollView.find('.lines');
      this.subscribeToEditor();
      this.renderView.minimapView = this;
      this.renderView.setEditorView(this.editorView);
      this.updateMinimapView();
    }

    MinimapView.prototype.initialize = function() {
      var config;
      this.on('mousewheel', this.onMouseWheel);
      this.on('mousedown', this.onMouseDown);
      this.miniVisibleArea.on('mousedown', this.onDragStart);
      this.obsPane = this.paneView.model.observeActiveItem(this.onActiveItemChanged);
      this.subscriptions.add(this.paneView.model.onDidRemoveItem(function(item) {
        return typeof item.off === "function" ? item.off('.minimap') : void 0;
      }));
      this.subscribe(this.renderView, 'minimap:updated', this.updateMinimapSize);
      this.subscribe(this.renderView, 'minimap:scaleChanged', (function(_this) {
        return function() {
          _this.computeScale();
          return _this.updatePositions();
        };
      })(this));
      this.observer = new MutationObserver((function(_this) {
        return function(mutations) {
          return _this.adjustTopPosition();
        };
      })(this));
      config = {
        childList: true
      };
      this.observer.observe(this.paneView.element, config);
      this.subscriptions.add(atom.themes.onDidReloadAll((function(_this) {
        return function() {
          _this.adjustTopPosition();
          return _this.updateMinimapView();
        };
      })(this)));
      this.subscribe($(window), 'resize:end', this.onScrollViewResized);
      this.miniScrollVisible = atom.config.get('minimap.minimapScrollIndicator');
      this.miniScroller.toggleClass('visible', this.miniScrollVisible);
      this.displayCodeHighlights = atom.config.get('minimap.displayCodeHighlights');
      atom.config.observe('minimap.minimapScrollIndicator', (function(_this) {
        return function() {
          _this.miniScrollVisible = atom.config.get('minimap.minimapScrollIndicator');
          return _this.miniScroller.toggleClass('visible', _this.miniScrollVisible);
        };
      })(this));
      atom.config.observe('minimap.useHardwareAcceleration', (function(_this) {
        return function() {
          if (_this.ScrollView != null) {
            return _this.updateScroll();
          }
        };
      })(this));
      return atom.config.observe('minimap.displayCodeHighlights', (function(_this) {
        return function() {
          var newOptionValue;
          newOptionValue = atom.config.get('minimap.displayCodeHighlights');
          return _this.setDisplayCodeHighlights(newOptionValue);
        };
      })(this));
    };

    MinimapView.prototype.computeScale = function() {
      var computedLineHeight, originalLineHeight;
      originalLineHeight = parseInt(this.editorView.find('.lines').css('line-height'));
      computedLineHeight = this.getLineHeight();
      return this.scaleX = this.scaleY = computedLineHeight / originalLineHeight;
    };

    MinimapView.prototype.adjustTopPosition = function() {
      return this.offset({
        top: (this.offsetTop = this.editorView.offset().top)
      });
    };

    MinimapView.prototype.destroy = function() {
      this.paneView.removeClass('with-minimap');
      this.off();
      this.obsPane.dispose();
      this.unsubscribe();
      this.observer.disconnect();
      this.detachFromPaneView();
      this.renderView.destroy();
      return this.remove();
    };

    MinimapView.prototype.setDisplayCodeHighlights = function(value) {
      if (value !== this.displayCodeHighlights) {
        this.displayCodeHighlights = value;
        return this.renderView.forceUpdate();
      }
    };

    MinimapView.prototype.attachToPaneView = function() {
      this.paneView.append(this);
      return this.adjustTopPosition();
    };

    MinimapView.prototype.detachFromPaneView = function() {
      return this.detach();
    };

    MinimapView.prototype.minimapIsAttached = function() {
      return this.paneView.find('.minimap').length === 1;
    };

    MinimapView.prototype.getEditorViewClientRect = function() {
      return this.scrollView[0].getBoundingClientRect();
    };

    MinimapView.prototype.getScrollViewClientRect = function() {
      return this.scrollViewLines[0].getBoundingClientRect();
    };

    MinimapView.prototype.getMinimapClientRect = function() {
      return this[0].getBoundingClientRect();
    };

    MinimapView.prototype.updateMinimapView = function() {
      if (!this.editorView) {
        return;
      }
      if (!this.indicator) {
        return;
      }
      if (this.frameRequested) {
        return;
      }
      this.updateMinimapSize();
      this.frameRequested = true;
      return requestAnimationFrame((function(_this) {
        return function() {
          _this.updateScroll();
          return _this.frameRequested = false;
        };
      })(this));
    };

    MinimapView.prototype.updateMinimapRenderView = function() {
      return this.renderView.update();
    };

    MinimapView.prototype.updateMinimapSize = function() {
      var editorViewRect, evh, evw, height, miniScrollViewRect, minimapVisibilityRatio, msvh, msvw, width, _ref1;
      if (this.indicator == null) {
        return;
      }
      _ref1 = this.getMinimapClientRect(), width = _ref1.width, height = _ref1.height;
      editorViewRect = this.getEditorViewClientRect();
      miniScrollViewRect = this.renderView.getClientRect();
      evw = editorViewRect.width;
      evh = editorViewRect.height;
      minimapVisibilityRatio = miniScrollViewRect.height / height;
      this.miniScroller.height(evh / minimapVisibilityRatio);
      this.miniScroller.toggleClass('visible', minimapVisibilityRatio > 1 && this.miniScrollVisible);
      this.miniWrapper.css({
        width: width
      });
      this.indicator.height = evh * this.scaleY;
      this.indicator.width = width / this.scaleX;
      this.miniVisibleArea.css({
        width: width / this.scaleX,
        height: evh * this.scaleY
      });
      msvw = miniScrollViewRect.width || 0;
      msvh = miniScrollViewRect.height || 0;
      this.indicator.setWrapperSize(width, Math.min(height, msvh));
      this.indicator.setScrollerSize(msvw, msvh);
      return this.indicator.updateBoundary();
    };

    MinimapView.prototype.updateScrollY = function(top) {
      var overlayY, overlayerOffset, scrollViewOffset;
      if (top != null) {
        overlayY = top;
      } else {
        scrollViewOffset = this.scrollView.offset().top;
        overlayerOffset = this.scrollView.find('.overlayer').offset().top;
        overlayY = -overlayerOffset + scrollViewOffset;
      }
      this.indicator.setY(overlayY * this.scaleY);
      return this.updatePositions();
    };

    MinimapView.prototype.updateScrollX = function() {
      this.indicator.setX(this.scrollView[0].scrollLeft);
      return this.updatePositions();
    };

    MinimapView.prototype.updateScroll = function() {
      this.indicator.setX(this.scrollView[0].scrollLeft);
      this.updateScrollY();
      return this.trigger('minimap:scroll');
    };

    MinimapView.prototype.updatePositions = function() {
      this.transform(this.miniVisibleArea[0], this.translate(0, this.indicator.y));
      this.renderView.scrollTop(this.indicator.scroller.y * -1);
      this.transform(this.renderView[0], this.translate(0, this.indicator.scroller.y + this.getFirstVisibleScreenRow() * this.getLineHeight()));
      this.transform(this.miniUnderlayer[0], this.translate(0, this.indicator.scroller.y));
      this.transform(this.miniOverlayer[0], this.translate(0, this.indicator.scroller.y));
      return this.updateScrollerPosition();
    };

    MinimapView.prototype.updateScrollerPosition = function() {
      var height, scrollRange, totalHeight;
      height = this.miniScroller.height();
      totalHeight = this.height();
      scrollRange = totalHeight - height;
      return this.transform(this.miniScroller[0], this.translate(0, this.indicator.ratioY * scrollRange));
    };


    /* Internal */

    MinimapView.prototype.subscribeToEditor = function() {
      this.subscribe(this.editor, 'scroll-top-changed.minimap', this.updateScrollY);
      return this.subscribe(this.scrollView, 'scroll.minimap', this.updateScrollX);
    };

    MinimapView.prototype.unsubscribeFromEditor = function() {
      if (this.editor != null) {
        this.unsubscribe(this.editor, '.minimap');
      }
      if (this.scrollView != null) {
        return this.unsubscribe(this.scrollView, '.minimap');
      }
    };

    MinimapView.prototype.onActiveItemChanged = function(activeItem) {
      if (activeItem === this.editor) {
        if (this.parent().length === 0) {
          this.attachToPaneView();
        }
        this.updateMinimapView();
        return this.renderView.forceUpdate();
      } else {
        if (this.parent().length === 1) {
          return this.detachFromPaneView();
        }
      }
    };

    MinimapView.prototype.onMouseWheel = function(e) {
      var wheelDeltaX, wheelDeltaY, _ref1;
      if (this.isClicked) {
        return;
      }
      _ref1 = e.originalEvent, wheelDeltaX = _ref1.wheelDeltaX, wheelDeltaY = _ref1.wheelDeltaY;
      if (wheelDeltaX) {
        this.editorView.scrollLeft(this.editorView.scrollLeft() - wheelDeltaX);
      }
      if (wheelDeltaY) {
        return this.editorView.scrollTop(this.editorView.scrollTop() - wheelDeltaY);
      }
    };

    MinimapView.prototype.onMouseDown = function(e) {
      var top, y;
      if (e.which !== 1) {
        return;
      }
      this.isClicked = true;
      e.preventDefault();
      e.stopPropagation();
      y = e.pageY - this.offsetTop;
      top = this.indicator.computeFromCenterY(y) / this.scaleY;
      this.editorView.scrollTop(top);
      return setTimeout((function(_this) {
        return function() {
          return _this.isClicked = false;
        };
      })(this), 377);
    };

    MinimapView.prototype.onScrollViewResized = function() {
      this.renderView.lineCanvas.height(this.editorView.height());
      this.updateMinimapSize();
      this.updateMinimapView();
      return this.renderView.forceUpdate();
    };

    MinimapView.prototype.onDragStart = function(e) {
      var y;
      if (e.which !== 1) {
        return;
      }
      this.isClicked = true;
      e.preventDefault();
      e.stopPropagation();
      y = e.pageY - this.offsetTop;
      this.grabY = y - (this.indicator.y + this.indicator.scroller.y);
      return this.on('mousemove.visible-area', this.onMove);
    };

    MinimapView.prototype.onMove = function(e) {
      if (e.which === 1) {
        return this.onDrag(e);
      } else {
        this.isClicked = false;
        return this.off('.visible-area');
      }
    };

    MinimapView.prototype.onDrag = function(e) {
      var top, y;
      y = e.pageY - this.offsetTop;
      top = (y - this.grabY) * (this.indicator.scroller.height - this.indicator.height) / (this.indicator.wrapper.height - this.indicator.height);
      return this.editorView.scrollTop(top / this.scaleY);
    };

    MinimapView.prototype.translate = function(x, y) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      if (atom.config.get('minimap.useHardwareAcceleration')) {
        return "translate3d(" + x + "px, " + y + "px, 0)";
      } else {
        return "translate(" + x + "px, " + y + "px)";
      }
    };

    MinimapView.prototype.transform = function(el, transform) {
      return el.style.webkitTransform = el.style.transform = transform;
    };

    return MinimapView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdJQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBd0IsT0FBQSxDQUFRLE1BQVIsQ0FBeEIsRUFBQyxTQUFBLENBQUQsRUFBSSxZQUFBLElBQUosRUFBVSxrQkFBQSxVQUFWLENBQUE7O0FBQUEsRUFDQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFVBQVIsQ0FEWCxDQUFBOztBQUFBLEVBRUMsc0JBQXVCLE9BQUEsQ0FBUSxXQUFSLEVBQXZCLG1CQUZELENBQUE7O0FBQUEsRUFJQSxpQkFBQSxHQUFvQixPQUFBLENBQVEsdUJBQVIsQ0FKcEIsQ0FBQTs7QUFBQSxFQUtBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxxQkFBUixDQUxuQixDQUFBOztBQUFBLEVBTUEsNEJBQUEsR0FBK0IsT0FBQSxDQUFRLG9DQUFSLENBTi9CLENBQUE7O0FBQUEsRUF3Q0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLGtDQUFBLENBQUE7O0FBQUEsSUFBQSxRQUFRLENBQUMsV0FBVCxDQUFxQixXQUFyQixDQUFBLENBQUE7O0FBQUEsSUFFQSxXQUFDLENBQUEsZ0JBQUQsQ0FBa0IsZUFBbEIsRUFBbUMsZUFBbkMsRUFBb0QsY0FBcEQsRUFBb0UsZUFBcEUsRUFBcUYsa0JBQXJGLEVBQXlHLHdCQUF6RyxFQUFtSSx5QkFBbkksRUFBOEosMEJBQTlKLEVBQTBMLHlCQUExTCxFQUFxTixnQ0FBck4sRUFBdVAsZ0JBQXZQLEVBQXlRLGtCQUF6USxFQUE2Uiw4QkFBN1IsRUFBNlQsK0JBQTdULEVBQThWO0FBQUEsTUFBQSxVQUFBLEVBQVksWUFBWjtLQUE5VixDQUZBLENBQUE7O0FBQUEsSUFJQSxXQUFDLENBQUEsZ0JBQUQsQ0FBa0IsY0FBbEIsRUFBa0MsZUFBbEMsRUFBbUQsa0JBQW5ELEVBQXVFLHlCQUF2RSxFQUFrRyxzQkFBbEcsRUFBMEgsc0JBQTFILEVBQWtKLG1CQUFsSixFQUF1SyxpQkFBdkssRUFBMEw7QUFBQSxNQUFBLFVBQUEsRUFBWSxRQUFaO0tBQTFMLENBSkEsQ0FBQTs7QUFBQSxJQU1BLFdBQUMsQ0FBQSxpQkFBRCxDQUFtQixZQUFuQixFQUFpQztBQUFBLE1BQUEsUUFBQSxFQUFVLGVBQVY7S0FBakMsQ0FOQSxDQUFBOztBQUFBLElBT0EsV0FBQyxDQUFBLGlCQUFELENBQW1CLFdBQW5CLEVBQWdDO0FBQUEsTUFBQSxRQUFBLEVBQVUsY0FBVjtLQUFoQyxDQVBBLENBQUE7O0FBQUEsSUFTQSxXQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxTQUFQO09BQUwsRUFBdUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNyQixVQUFBLElBQWtFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQ0FBaEIsQ0FBbEU7QUFBQSxZQUFBLEtBQUMsQ0FBQSxPQUFELENBQVMsbUJBQVQsRUFBOEIsR0FBQSxDQUFBLDRCQUE5QixDQUFBLENBQUE7V0FBQTtBQUFBLFVBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsTUFBQSxFQUFRLGNBQVI7QUFBQSxZQUF3QixPQUFBLEVBQU8sa0JBQS9CO1dBQUwsQ0FEQSxDQUFBO2lCQUVBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE1BQUEsRUFBUSxhQUFSO0FBQUEsWUFBdUIsT0FBQSxFQUFPLGlCQUE5QjtXQUFMLEVBQXNELFNBQUEsR0FBQTtBQUNwRCxZQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE1BQUEsRUFBUSxnQkFBUjtBQUFBLGNBQTBCLE9BQUEsRUFBTyxvQkFBakM7YUFBTCxDQUFBLENBQUE7QUFBQSxZQUNBLEtBQUMsQ0FBQSxPQUFELENBQVMsWUFBVCxFQUF1QixHQUFBLENBQUEsaUJBQXZCLENBREEsQ0FBQTttQkFFQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxNQUFBLEVBQVEsZUFBUjtBQUFBLGNBQXlCLE9BQUEsRUFBTyxtQkFBaEM7YUFBTCxFQUEwRCxTQUFBLEdBQUE7cUJBQ3hELEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxnQkFBQSxNQUFBLEVBQVEsaUJBQVI7QUFBQSxnQkFBMkIsT0FBQSxFQUFPLHNCQUFsQztlQUFMLEVBRHdEO1lBQUEsQ0FBMUQsRUFIb0Q7VUFBQSxDQUF0RCxFQUhxQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZCLEVBRFE7SUFBQSxDQVRWLENBQUE7O0FBQUEsMEJBbUJBLFNBQUEsR0FBVyxLQW5CWCxDQUFBOztBQXFCQTtBQUFBLGdCQXJCQTs7QUFrQ2EsSUFBQSxxQkFBRSxVQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxhQUFBLFVBQ2IsQ0FBQTtBQUFBLDZDQUFBLENBQUE7QUFBQSw2Q0FBQSxDQUFBO0FBQUEsdURBQUEsQ0FBQTtBQUFBLHVFQUFBLENBQUE7QUFBQSx1REFBQSxDQUFBO0FBQUEseURBQUEsQ0FBQTtBQUFBLHVFQUFBLENBQUE7QUFBQSx5REFBQSxDQUFBO0FBQUEsMkRBQUEsQ0FBQTtBQUFBLDJEQUFBLENBQUE7QUFBQSxtRUFBQSxDQUFBO0FBQUEsK0VBQUEsQ0FBQTtBQUFBLG1FQUFBLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLFVBQVUsQ0FBQyxTQUFaLENBQUEsQ0FBVixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsUUFBRCxHQUFZLElBQUMsQ0FBQSxVQUFVLENBQUMsV0FBWixDQUFBLENBRFosQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxRQUFWLENBQW1CLGNBQW5CLENBSEEsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUxqQixDQUFBO0FBQUEsTUFPQSw4Q0FBQSxTQUFBLENBUEEsQ0FBQTtBQUFBLE1BU0EsSUFBQyxDQUFBLFlBQUQsQ0FBQSxDQVRBLENBQUE7QUFBQSxNQVVBLElBQUMsQ0FBQSxjQUFELEdBQWtCLElBQUMsQ0FBQSxVQUFVLENBQUMsVUFWOUIsQ0FBQTtBQUFBLE1BV0EsSUFBQyxDQUFBLFVBQUQsR0FBYyxDQVhkLENBQUE7QUFBQSxNQVlBLElBQUMsQ0FBQSxTQUFELEdBQWEsQ0FaYixDQUFBO0FBQUEsTUFhQSxJQUFDLENBQUEsU0FBRCxHQUFpQixJQUFBLGdCQUFBLENBQUEsQ0FiakIsQ0FBQTtBQUFBLE1BZUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFDLENBQUEsVUFBVSxDQUFDLFVBZjFCLENBQUE7QUFBQSxNQWdCQSxJQUFDLENBQUEsZUFBRCxHQUFtQixJQUFDLENBQUEsVUFBVSxDQUFDLElBQVosQ0FBaUIsUUFBakIsQ0FoQm5CLENBQUE7QUFBQSxNQWtCQSxJQUFDLENBQUEsaUJBQUQsQ0FBQSxDQWxCQSxDQUFBO0FBQUEsTUFvQkEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxXQUFaLEdBQTBCLElBcEIxQixDQUFBO0FBQUEsTUFxQkEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxhQUFaLENBQTBCLElBQUMsQ0FBQSxVQUEzQixDQXJCQSxDQUFBO0FBQUEsTUF1QkEsSUFBQyxDQUFBLGlCQUFELENBQUEsQ0F2QkEsQ0FEVztJQUFBLENBbENiOztBQUFBLDBCQThEQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSxNQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsRUFBRCxDQUFJLFlBQUosRUFBa0IsSUFBQyxDQUFBLFlBQW5CLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLEVBQUQsQ0FBSSxXQUFKLEVBQWlCLElBQUMsQ0FBQSxXQUFsQixDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxlQUFlLENBQUMsRUFBakIsQ0FBb0IsV0FBcEIsRUFBaUMsSUFBQyxDQUFBLFdBQWxDLENBRkEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFDLENBQUEsUUFBUSxDQUFDLEtBQUssQ0FBQyxpQkFBaEIsQ0FBa0MsSUFBQyxDQUFBLG1CQUFuQyxDQUpYLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsUUFBUSxDQUFDLEtBQUssQ0FBQyxlQUFoQixDQUFnQyxTQUFDLElBQUQsR0FBQTtnREFBVSxJQUFJLENBQUMsSUFBSyxxQkFBcEI7TUFBQSxDQUFoQyxDQUFuQixDQVBBLENBQUE7QUFBQSxNQVNBLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBQyxDQUFBLFVBQVosRUFBd0IsaUJBQXhCLEVBQTJDLElBQUMsQ0FBQSxpQkFBNUMsQ0FUQSxDQUFBO0FBQUEsTUFVQSxJQUFDLENBQUEsU0FBRCxDQUFXLElBQUMsQ0FBQSxVQUFaLEVBQXdCLHNCQUF4QixFQUFnRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQzlDLFVBQUEsS0FBQyxDQUFBLFlBQUQsQ0FBQSxDQUFBLENBQUE7aUJBQ0EsS0FBQyxDQUFBLGVBQUQsQ0FBQSxFQUY4QztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhELENBVkEsQ0FBQTtBQUFBLE1BZ0JBLElBQUMsQ0FBQSxRQUFELEdBQWdCLElBQUEsZ0JBQUEsQ0FBaUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsU0FBRCxHQUFBO2lCQUMvQixLQUFDLENBQUEsaUJBQUQsQ0FBQSxFQUQrQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpCLENBaEJoQixDQUFBO0FBQUEsTUFtQkEsTUFBQSxHQUFTO0FBQUEsUUFBQSxTQUFBLEVBQVcsSUFBWDtPQW5CVCxDQUFBO0FBQUEsTUFvQkEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxPQUFWLENBQWtCLElBQUMsQ0FBQSxRQUFRLENBQUMsT0FBNUIsRUFBcUMsTUFBckMsQ0FwQkEsQ0FBQTtBQUFBLE1BdUJBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLGNBQVosQ0FBMkIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUM1QyxVQUFBLEtBQUMsQ0FBQSxpQkFBRCxDQUFBLENBQUEsQ0FBQTtpQkFDQSxLQUFDLENBQUEsaUJBQUQsQ0FBQSxFQUY0QztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNCLENBQW5CLENBdkJBLENBQUE7QUFBQSxNQTZCQSxJQUFDLENBQUEsU0FBRCxDQUFXLENBQUEsQ0FBRSxNQUFGLENBQVgsRUFBc0IsWUFBdEIsRUFBb0MsSUFBQyxDQUFBLG1CQUFyQyxDQTdCQSxDQUFBO0FBQUEsTUErQkEsSUFBQyxDQUFBLGlCQUFELEdBQXFCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQ0FBaEIsQ0EvQnJCLENBQUE7QUFBQSxNQWdDQSxJQUFDLENBQUEsWUFBWSxDQUFDLFdBQWQsQ0FBMEIsU0FBMUIsRUFBcUMsSUFBQyxDQUFBLGlCQUF0QyxDQWhDQSxDQUFBO0FBQUEsTUFrQ0EsSUFBQyxDQUFBLHFCQUFELEdBQXlCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwrQkFBaEIsQ0FsQ3pCLENBQUE7QUFBQSxNQW9DQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsZ0NBQXBCLEVBQXNELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDcEQsVUFBQSxLQUFDLENBQUEsaUJBQUQsR0FBcUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGdDQUFoQixDQUFyQixDQUFBO2lCQUNBLEtBQUMsQ0FBQSxZQUFZLENBQUMsV0FBZCxDQUEwQixTQUExQixFQUFxQyxLQUFDLENBQUEsaUJBQXRDLEVBRm9EO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdEQsQ0FwQ0EsQ0FBQTtBQUFBLE1Bd0NBLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQixpQ0FBcEIsRUFBdUQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNyRCxVQUFBLElBQW1CLHdCQUFuQjttQkFBQSxLQUFDLENBQUEsWUFBRCxDQUFBLEVBQUE7V0FEcUQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF2RCxDQXhDQSxDQUFBO2FBMkNBLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQiwrQkFBcEIsRUFBcUQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNuRCxjQUFBLGNBQUE7QUFBQSxVQUFBLGNBQUEsR0FBaUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLCtCQUFoQixDQUFqQixDQUFBO2lCQUNBLEtBQUMsQ0FBQSx3QkFBRCxDQUEwQixjQUExQixFQUZtRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJELEVBNUNVO0lBQUEsQ0E5RFosQ0FBQTs7QUFBQSwwQkFrSEEsWUFBQSxHQUFjLFNBQUEsR0FBQTtBQUNaLFVBQUEsc0NBQUE7QUFBQSxNQUFBLGtCQUFBLEdBQXFCLFFBQUEsQ0FBUyxJQUFDLENBQUEsVUFBVSxDQUFDLElBQVosQ0FBaUIsUUFBakIsQ0FBMEIsQ0FBQyxHQUEzQixDQUErQixhQUEvQixDQUFULENBQXJCLENBQUE7QUFBQSxNQUNBLGtCQUFBLEdBQXFCLElBQUMsQ0FBQSxhQUFELENBQUEsQ0FEckIsQ0FBQTthQUdBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLE1BQUQsR0FBVSxrQkFBQSxHQUFxQixtQkFKN0I7SUFBQSxDQWxIZCxDQUFBOztBQUFBLDBCQTJIQSxpQkFBQSxHQUFtQixTQUFBLEdBQUE7YUFDakIsSUFBQyxDQUFBLE1BQUQsQ0FBUTtBQUFBLFFBQUEsR0FBQSxFQUFLLENBQUMsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFDLENBQUEsVUFBVSxDQUFDLE1BQVosQ0FBQSxDQUFvQixDQUFDLEdBQW5DLENBQUw7T0FBUixFQURpQjtJQUFBLENBM0huQixDQUFBOztBQUFBLDBCQStIQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFDLENBQUEsUUFBUSxDQUFDLFdBQVYsQ0FBc0IsY0FBdEIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsR0FBRCxDQUFBLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxPQUFULENBQUEsQ0FGQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsV0FBRCxDQUFBLENBSEEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxVQUFWLENBQUEsQ0FKQSxDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsa0JBQUQsQ0FBQSxDQU5BLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxVQUFVLENBQUMsT0FBWixDQUFBLENBUEEsQ0FBQTthQVFBLElBQUMsQ0FBQSxNQUFELENBQUEsRUFUTztJQUFBLENBL0hULENBQUE7O0FBQUEsMEJBcUpBLHdCQUFBLEdBQTBCLFNBQUMsS0FBRCxHQUFBO0FBQ3hCLE1BQUEsSUFBRyxLQUFBLEtBQVcsSUFBQyxDQUFBLHFCQUFmO0FBQ0UsUUFBQSxJQUFDLENBQUEscUJBQUQsR0FBeUIsS0FBekIsQ0FBQTtlQUNBLElBQUMsQ0FBQSxVQUFVLENBQUMsV0FBWixDQUFBLEVBRkY7T0FEd0I7SUFBQSxDQXJKMUIsQ0FBQTs7QUFBQSwwQkEySkEsZ0JBQUEsR0FBa0IsU0FBQSxHQUFBO0FBQ2hCLE1BQUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxNQUFWLENBQWlCLElBQWpCLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxpQkFBRCxDQUFBLEVBRmdCO0lBQUEsQ0EzSmxCLENBQUE7O0FBQUEsMEJBZ0tBLGtCQUFBLEdBQW9CLFNBQUEsR0FBQTthQUNsQixJQUFDLENBQUEsTUFBRCxDQUFBLEVBRGtCO0lBQUEsQ0FoS3BCLENBQUE7O0FBQUEsMEJBc0tBLGlCQUFBLEdBQW1CLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxRQUFRLENBQUMsSUFBVixDQUFlLFVBQWYsQ0FBMEIsQ0FBQyxNQUEzQixLQUFxQyxFQUF4QztJQUFBLENBdEtuQixDQUFBOztBQUFBLDBCQTJLQSx1QkFBQSxHQUF5QixTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsVUFBVyxDQUFBLENBQUEsQ0FBRSxDQUFDLHFCQUFmLENBQUEsRUFBSDtJQUFBLENBM0t6QixDQUFBOztBQUFBLDBCQWdMQSx1QkFBQSxHQUF5QixTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsZUFBZ0IsQ0FBQSxDQUFBLENBQUUsQ0FBQyxxQkFBcEIsQ0FBQSxFQUFIO0lBQUEsQ0FoTHpCLENBQUE7O0FBQUEsMEJBcUxBLG9CQUFBLEdBQXNCLFNBQUEsR0FBQTthQUFHLElBQUUsQ0FBQSxDQUFBLENBQUUsQ0FBQyxxQkFBTCxDQUFBLEVBQUg7SUFBQSxDQXJMdEIsQ0FBQTs7QUFBQSwwQkFvTUEsaUJBQUEsR0FBbUIsU0FBQSxHQUFBO0FBQ2pCLE1BQUEsSUFBQSxDQUFBLElBQWUsQ0FBQSxVQUFmO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFDQSxNQUFBLElBQUEsQ0FBQSxJQUFlLENBQUEsU0FBZjtBQUFBLGNBQUEsQ0FBQTtPQURBO0FBR0EsTUFBQSxJQUFVLElBQUMsQ0FBQSxjQUFYO0FBQUEsY0FBQSxDQUFBO09BSEE7QUFBQSxNQUtBLElBQUMsQ0FBQSxpQkFBRCxDQUFBLENBTEEsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLGNBQUQsR0FBa0IsSUFObEIsQ0FBQTthQU9BLHFCQUFBLENBQXNCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDcEIsVUFBQSxLQUFDLENBQUEsWUFBRCxDQUFBLENBQUEsQ0FBQTtpQkFDQSxLQUFDLENBQUEsY0FBRCxHQUFrQixNQUZFO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdEIsRUFSaUI7SUFBQSxDQXBNbkIsQ0FBQTs7QUFBQSwwQkFpTkEsdUJBQUEsR0FBeUIsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLFVBQVUsQ0FBQyxNQUFaLENBQUEsRUFBSDtJQUFBLENBak56QixDQUFBOztBQUFBLDBCQXFOQSxpQkFBQSxHQUFtQixTQUFBLEdBQUE7QUFDakIsVUFBQSxzR0FBQTtBQUFBLE1BQUEsSUFBYyxzQkFBZDtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFFQSxRQUFrQixJQUFDLENBQUEsb0JBQUQsQ0FBQSxDQUFsQixFQUFDLGNBQUEsS0FBRCxFQUFRLGVBQUEsTUFGUixDQUFBO0FBQUEsTUFHQSxjQUFBLEdBQWlCLElBQUMsQ0FBQSx1QkFBRCxDQUFBLENBSGpCLENBQUE7QUFBQSxNQUlBLGtCQUFBLEdBQXFCLElBQUMsQ0FBQSxVQUFVLENBQUMsYUFBWixDQUFBLENBSnJCLENBQUE7QUFBQSxNQU1BLEdBQUEsR0FBTSxjQUFjLENBQUMsS0FOckIsQ0FBQTtBQUFBLE1BT0EsR0FBQSxHQUFNLGNBQWMsQ0FBQyxNQVByQixDQUFBO0FBQUEsTUFTQSxzQkFBQSxHQUF5QixrQkFBa0IsQ0FBQyxNQUFuQixHQUE0QixNQVRyRCxDQUFBO0FBQUEsTUFXQSxJQUFDLENBQUEsWUFBWSxDQUFDLE1BQWQsQ0FBcUIsR0FBQSxHQUFNLHNCQUEzQixDQVhBLENBQUE7QUFBQSxNQVlBLElBQUMsQ0FBQSxZQUFZLENBQUMsV0FBZCxDQUEwQixTQUExQixFQUFxQyxzQkFBQSxHQUF5QixDQUF6QixJQUErQixJQUFDLENBQUEsaUJBQXJFLENBWkEsQ0FBQTtBQUFBLE1BY0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCO0FBQUEsUUFBQyxPQUFBLEtBQUQ7T0FBakIsQ0FkQSxDQUFBO0FBQUEsTUFpQkEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQUFYLEdBQW9CLEdBQUEsR0FBTSxJQUFDLENBQUEsTUFqQjNCLENBQUE7QUFBQSxNQWtCQSxJQUFDLENBQUEsU0FBUyxDQUFDLEtBQVgsR0FBbUIsS0FBQSxHQUFRLElBQUMsQ0FBQSxNQWxCNUIsQ0FBQTtBQUFBLE1Bb0JBLElBQUMsQ0FBQSxlQUFlLENBQUMsR0FBakIsQ0FDRTtBQUFBLFFBQUEsS0FBQSxFQUFRLEtBQUEsR0FBUSxJQUFDLENBQUEsTUFBakI7QUFBQSxRQUNBLE1BQUEsRUFBUSxHQUFBLEdBQU0sSUFBQyxDQUFBLE1BRGY7T0FERixDQXBCQSxDQUFBO0FBQUEsTUF3QkEsSUFBQSxHQUFPLGtCQUFrQixDQUFDLEtBQW5CLElBQTRCLENBeEJuQyxDQUFBO0FBQUEsTUF5QkEsSUFBQSxHQUFPLGtCQUFrQixDQUFDLE1BQW5CLElBQTZCLENBekJwQyxDQUFBO0FBQUEsTUE0QkEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxjQUFYLENBQTBCLEtBQTFCLEVBQWlDLElBQUksQ0FBQyxHQUFMLENBQVMsTUFBVCxFQUFpQixJQUFqQixDQUFqQyxDQTVCQSxDQUFBO0FBQUEsTUErQkEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxlQUFYLENBQTJCLElBQTNCLEVBQWlDLElBQWpDLENBL0JBLENBQUE7YUFrQ0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxjQUFYLENBQUEsRUFuQ2lCO0lBQUEsQ0FyTm5CLENBQUE7O0FBQUEsMEJBNlBBLGFBQUEsR0FBZSxTQUFDLEdBQUQsR0FBQTtBQUdiLFVBQUEsMkNBQUE7QUFBQSxNQUFBLElBQUcsV0FBSDtBQUNFLFFBQUEsUUFBQSxHQUFXLEdBQVgsQ0FERjtPQUFBLE1BQUE7QUFHRSxRQUFBLGdCQUFBLEdBQW1CLElBQUMsQ0FBQSxVQUFVLENBQUMsTUFBWixDQUFBLENBQW9CLENBQUMsR0FBeEMsQ0FBQTtBQUFBLFFBQ0EsZUFBQSxHQUFrQixJQUFDLENBQUEsVUFBVSxDQUFDLElBQVosQ0FBaUIsWUFBakIsQ0FBOEIsQ0FBQyxNQUEvQixDQUFBLENBQXVDLENBQUMsR0FEMUQsQ0FBQTtBQUFBLFFBRUEsUUFBQSxHQUFXLENBQUEsZUFBQSxHQUFtQixnQkFGOUIsQ0FIRjtPQUFBO0FBQUEsTUFPQSxJQUFDLENBQUEsU0FBUyxDQUFDLElBQVgsQ0FBZ0IsUUFBQSxHQUFXLElBQUMsQ0FBQSxNQUE1QixDQVBBLENBQUE7YUFRQSxJQUFDLENBQUEsZUFBRCxDQUFBLEVBWGE7SUFBQSxDQTdQZixDQUFBOztBQUFBLDBCQTJRQSxhQUFBLEdBQWUsU0FBQSxHQUFBO0FBQ2IsTUFBQSxJQUFDLENBQUEsU0FBUyxDQUFDLElBQVgsQ0FBZ0IsSUFBQyxDQUFBLFVBQVcsQ0FBQSxDQUFBLENBQUUsQ0FBQyxVQUEvQixDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsZUFBRCxDQUFBLEVBRmE7SUFBQSxDQTNRZixDQUFBOztBQUFBLDBCQWlSQSxZQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ1osTUFBQSxJQUFDLENBQUEsU0FBUyxDQUFDLElBQVgsQ0FBZ0IsSUFBQyxDQUFBLFVBQVcsQ0FBQSxDQUFBLENBQUUsQ0FBQyxVQUEvQixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxhQUFELENBQUEsQ0FEQSxDQUFBO2FBRUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxnQkFBVCxFQUhZO0lBQUEsQ0FqUmQsQ0FBQTs7QUFBQSwwQkF3UkEsZUFBQSxHQUFpQixTQUFBLEdBQUE7QUFDZixNQUFBLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBQyxDQUFBLGVBQWdCLENBQUEsQ0FBQSxDQUE1QixFQUFnQyxJQUFDLENBQUEsU0FBRCxDQUFXLENBQVgsRUFBYyxJQUFDLENBQUEsU0FBUyxDQUFDLENBQXpCLENBQWhDLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFVBQVUsQ0FBQyxTQUFaLENBQXNCLElBQUMsQ0FBQSxTQUFTLENBQUMsUUFBUSxDQUFDLENBQXBCLEdBQXdCLENBQUEsQ0FBOUMsQ0FEQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsU0FBRCxDQUFXLElBQUMsQ0FBQSxVQUFXLENBQUEsQ0FBQSxDQUF2QixFQUEyQixJQUFDLENBQUEsU0FBRCxDQUFXLENBQVgsRUFBYyxJQUFDLENBQUEsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFwQixHQUF3QixJQUFDLENBQUEsd0JBQUQsQ0FBQSxDQUFBLEdBQThCLElBQUMsQ0FBQSxhQUFELENBQUEsQ0FBcEUsQ0FBM0IsQ0FIQSxDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsU0FBRCxDQUFXLElBQUMsQ0FBQSxjQUFlLENBQUEsQ0FBQSxDQUEzQixFQUErQixJQUFDLENBQUEsU0FBRCxDQUFXLENBQVgsRUFBYyxJQUFDLENBQUEsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFsQyxDQUEvQixDQUxBLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBQyxDQUFBLGFBQWMsQ0FBQSxDQUFBLENBQTFCLEVBQThCLElBQUMsQ0FBQSxTQUFELENBQVcsQ0FBWCxFQUFjLElBQUMsQ0FBQSxTQUFTLENBQUMsUUFBUSxDQUFDLENBQWxDLENBQTlCLENBTkEsQ0FBQTthQVFBLElBQUMsQ0FBQSxzQkFBRCxDQUFBLEVBVGU7SUFBQSxDQXhSakIsQ0FBQTs7QUFBQSwwQkFvU0Esc0JBQUEsR0FBd0IsU0FBQSxHQUFBO0FBQ3RCLFVBQUEsZ0NBQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxJQUFDLENBQUEsWUFBWSxDQUFDLE1BQWQsQ0FBQSxDQUFULENBQUE7QUFBQSxNQUNBLFdBQUEsR0FBYyxJQUFDLENBQUEsTUFBRCxDQUFBLENBRGQsQ0FBQTtBQUFBLE1BR0EsV0FBQSxHQUFjLFdBQUEsR0FBYyxNQUg1QixDQUFBO2FBS0EsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFDLENBQUEsWUFBYSxDQUFBLENBQUEsQ0FBekIsRUFBNkIsSUFBQyxDQUFBLFNBQUQsQ0FBVyxDQUFYLEVBQWMsSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQUFYLEdBQW9CLFdBQWxDLENBQTdCLEVBTnNCO0lBQUEsQ0FwU3hCLENBQUE7O0FBb1RBO0FBQUEsa0JBcFRBOztBQUFBLDBCQXVUQSxpQkFBQSxHQUFtQixTQUFBLEdBQUE7QUFDakIsTUFBQSxJQUFDLENBQUEsU0FBRCxDQUFXLElBQUMsQ0FBQSxNQUFaLEVBQW9CLDRCQUFwQixFQUFrRCxJQUFDLENBQUEsYUFBbkQsQ0FBQSxDQUFBO2FBRUEsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFDLENBQUEsVUFBWixFQUF3QixnQkFBeEIsRUFBMEMsSUFBQyxDQUFBLGFBQTNDLEVBSGlCO0lBQUEsQ0F2VG5CLENBQUE7O0FBQUEsMEJBNlRBLHFCQUFBLEdBQXVCLFNBQUEsR0FBQTtBQUNyQixNQUFBLElBQW9DLG1CQUFwQztBQUFBLFFBQUEsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsTUFBZCxFQUFzQixVQUF0QixDQUFBLENBQUE7T0FBQTtBQUNBLE1BQUEsSUFBd0MsdUJBQXhDO2VBQUEsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsVUFBZCxFQUEwQixVQUExQixFQUFBO09BRnFCO0lBQUEsQ0E3VHZCLENBQUE7O0FBQUEsMEJBcVVBLG1CQUFBLEdBQXFCLFNBQUMsVUFBRCxHQUFBO0FBQ25CLE1BQUEsSUFBRyxVQUFBLEtBQWMsSUFBQyxDQUFBLE1BQWxCO0FBQ0UsUUFBQSxJQUF1QixJQUFDLENBQUEsTUFBRCxDQUFBLENBQVMsQ0FBQyxNQUFWLEtBQW9CLENBQTNDO0FBQUEsVUFBQSxJQUFDLENBQUEsZ0JBQUQsQ0FBQSxDQUFBLENBQUE7U0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLGlCQUFELENBQUEsQ0FEQSxDQUFBO2VBRUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxXQUFaLENBQUEsRUFIRjtPQUFBLE1BQUE7QUFLRSxRQUFBLElBQXlCLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBUyxDQUFDLE1BQVYsS0FBb0IsQ0FBN0M7aUJBQUEsSUFBQyxDQUFBLGtCQUFELENBQUEsRUFBQTtTQUxGO09BRG1CO0lBQUEsQ0FyVXJCLENBQUE7O0FBQUEsMEJBK1VBLFlBQUEsR0FBYyxTQUFDLENBQUQsR0FBQTtBQUNaLFVBQUEsK0JBQUE7QUFBQSxNQUFBLElBQVUsSUFBQyxDQUFBLFNBQVg7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsUUFBNkIsQ0FBQyxDQUFDLGFBQS9CLEVBQUMsb0JBQUEsV0FBRCxFQUFjLG9CQUFBLFdBRGQsQ0FBQTtBQUVBLE1BQUEsSUFBRyxXQUFIO0FBQ0UsUUFBQSxJQUFDLENBQUEsVUFBVSxDQUFDLFVBQVosQ0FBdUIsSUFBQyxDQUFBLFVBQVUsQ0FBQyxVQUFaLENBQUEsQ0FBQSxHQUEyQixXQUFsRCxDQUFBLENBREY7T0FGQTtBQUlBLE1BQUEsSUFBRyxXQUFIO2VBQ0UsSUFBQyxDQUFBLFVBQVUsQ0FBQyxTQUFaLENBQXNCLElBQUMsQ0FBQSxVQUFVLENBQUMsU0FBWixDQUFBLENBQUEsR0FBMEIsV0FBaEQsRUFERjtPQUxZO0lBQUEsQ0EvVWQsQ0FBQTs7QUFBQSwwQkF5VkEsV0FBQSxHQUFhLFNBQUMsQ0FBRCxHQUFBO0FBRVgsVUFBQSxNQUFBO0FBQUEsTUFBQSxJQUFVLENBQUMsQ0FBQyxLQUFGLEtBQWEsQ0FBdkI7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQURiLENBQUE7QUFBQSxNQUVBLENBQUMsQ0FBQyxjQUFGLENBQUEsQ0FGQSxDQUFBO0FBQUEsTUFHQSxDQUFDLENBQUMsZUFBRixDQUFBLENBSEEsQ0FBQTtBQUFBLE1BS0EsQ0FBQSxHQUFJLENBQUMsQ0FBQyxLQUFGLEdBQVUsSUFBQyxDQUFBLFNBTGYsQ0FBQTtBQUFBLE1BTUEsR0FBQSxHQUFNLElBQUMsQ0FBQSxTQUFTLENBQUMsa0JBQVgsQ0FBOEIsQ0FBOUIsQ0FBQSxHQUFtQyxJQUFDLENBQUEsTUFOMUMsQ0FBQTtBQUFBLE1BUUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxTQUFaLENBQXNCLEdBQXRCLENBUkEsQ0FBQTthQVVBLFVBQUEsQ0FBVyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNULEtBQUMsQ0FBQSxTQUFELEdBQWEsTUFESjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVgsRUFFRSxHQUZGLEVBWlc7SUFBQSxDQXpWYixDQUFBOztBQUFBLDBCQTJXQSxtQkFBQSxHQUFxQixTQUFBLEdBQUE7QUFDbkIsTUFBQSxJQUFDLENBQUEsVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUF2QixDQUE4QixJQUFDLENBQUEsVUFBVSxDQUFDLE1BQVosQ0FBQSxDQUE5QixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxpQkFBRCxDQUFBLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLGlCQUFELENBQUEsQ0FGQSxDQUFBO2FBR0EsSUFBQyxDQUFBLFVBQVUsQ0FBQyxXQUFaLENBQUEsRUFKbUI7SUFBQSxDQTNXckIsQ0FBQTs7QUFBQSwwQkFtWEEsV0FBQSxHQUFhLFNBQUMsQ0FBRCxHQUFBO0FBRVgsVUFBQSxDQUFBO0FBQUEsTUFBQSxJQUFVLENBQUMsQ0FBQyxLQUFGLEtBQWEsQ0FBdkI7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQURiLENBQUE7QUFBQSxNQUVBLENBQUMsQ0FBQyxjQUFGLENBQUEsQ0FGQSxDQUFBO0FBQUEsTUFHQSxDQUFDLENBQUMsZUFBRixDQUFBLENBSEEsQ0FBQTtBQUFBLE1BS0EsQ0FBQSxHQUFJLENBQUMsQ0FBQyxLQUFGLEdBQVUsSUFBQyxDQUFBLFNBTGYsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxDQUFBLEdBQUksQ0FBQyxJQUFDLENBQUEsU0FBUyxDQUFDLENBQVgsR0FBZSxJQUFDLENBQUEsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFwQyxDQU5iLENBQUE7YUFPQSxJQUFDLENBQUEsRUFBRCxDQUFJLHdCQUFKLEVBQThCLElBQUMsQ0FBQSxNQUEvQixFQVRXO0lBQUEsQ0FuWGIsQ0FBQTs7QUFBQSwwQkErWEEsTUFBQSxHQUFRLFNBQUMsQ0FBRCxHQUFBO0FBQ04sTUFBQSxJQUFHLENBQUMsQ0FBQyxLQUFGLEtBQVcsQ0FBZDtlQUNFLElBQUMsQ0FBQSxNQUFELENBQVEsQ0FBUixFQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxLQUFiLENBQUE7ZUFDQSxJQUFDLENBQUEsR0FBRCxDQUFLLGVBQUwsRUFKRjtPQURNO0lBQUEsQ0EvWFIsQ0FBQTs7QUFBQSwwQkF1WUEsTUFBQSxHQUFRLFNBQUMsQ0FBRCxHQUFBO0FBSU4sVUFBQSxNQUFBO0FBQUEsTUFBQSxDQUFBLEdBQUksQ0FBQyxDQUFDLEtBQUYsR0FBVSxJQUFDLENBQUEsU0FBZixDQUFBO0FBQUEsTUFDQSxHQUFBLEdBQU0sQ0FBQyxDQUFBLEdBQUUsSUFBQyxDQUFBLEtBQUosQ0FBQSxHQUFhLENBQUMsSUFBQyxDQUFBLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBcEIsR0FBMkIsSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQUF2QyxDQUFiLEdBQThELENBQUMsSUFBQyxDQUFBLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBbkIsR0FBMEIsSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQUF0QyxDQURwRSxDQUFBO2FBRUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxTQUFaLENBQXNCLEdBQUEsR0FBTSxJQUFDLENBQUEsTUFBN0IsRUFOTTtJQUFBLENBdllSLENBQUE7O0FBQUEsMEJBd1pBLFNBQUEsR0FBVyxTQUFDLENBQUQsRUFBSyxDQUFMLEdBQUE7O1FBQUMsSUFBRTtPQUNaOztRQURjLElBQUU7T0FDaEI7QUFBQSxNQUFBLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlDQUFoQixDQUFIO2VBQ0csY0FBQSxHQUFhLENBQWIsR0FBZ0IsTUFBaEIsR0FBcUIsQ0FBckIsR0FBd0IsU0FEM0I7T0FBQSxNQUFBO2VBR0csWUFBQSxHQUFXLENBQVgsR0FBYyxNQUFkLEdBQW1CLENBQW5CLEdBQXNCLE1BSHpCO09BRFM7SUFBQSxDQXhaWCxDQUFBOztBQUFBLDBCQWthQSxTQUFBLEdBQVcsU0FBQyxFQUFELEVBQUssU0FBTCxHQUFBO2FBQ1QsRUFBRSxDQUFDLEtBQUssQ0FBQyxlQUFULEdBQTJCLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBVCxHQUFxQixVQUR2QztJQUFBLENBbGFYLENBQUE7O3VCQUFBOztLQUR3QixLQXpDMUIsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/sarah/.atom/packages/minimap/lib/minimap-view.coffee