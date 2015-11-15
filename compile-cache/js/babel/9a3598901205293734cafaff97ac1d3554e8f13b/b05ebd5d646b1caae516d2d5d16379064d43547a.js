Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _uiBottomPanel = require('./ui/bottom-panel');

var _uiBottomPanel2 = _interopRequireDefault(_uiBottomPanel);

var _uiBottomContainer = require('./ui/bottom-container');

var _uiBottomContainer2 = _interopRequireDefault(_uiBottomContainer);

var _uiMessageElement = require('./ui/message-element');

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _uiMessageBubble = require('./ui/message-bubble');

'use babel';

var LinterViews = (function () {
  function LinterViews(scope, editorRegistry) {
    var _this = this;

    _classCallCheck(this, LinterViews);

    this.subscriptions = new _atom.CompositeDisposable();
    this.emitter = new _atom.Emitter();
    this.bottomPanel = new _uiBottomPanel2['default'](scope);
    this.bottomContainer = _uiBottomContainer2['default'].create(scope);
    this.editors = editorRegistry;
    this.bottomBar = null; // To be added when status-bar service is consumed
    this.bubble = null;
    this.bubbleRange = null;

    this.subscriptions.add(this.bottomPanel);
    this.subscriptions.add(this.bottomContainer);
    this.subscriptions.add(this.emitter);

    this.count = {
      Line: 0,
      File: 0,
      Project: 0
    };
    this.messages = [];
    this.subscriptions.add(atom.config.observe('linter.showErrorInline', function (showBubble) {
      return _this.showBubble = showBubble;
    }));
    this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem(function (paneItem) {
      var isEditor = false;
      _this.editors.forEach(function (editorLinter) {
        isEditor = (editorLinter.active = editorLinter.editor === paneItem) || isEditor;
      });
      _this.updateCounts();
      _this.bottomPanel.refresh();
      _this.bottomContainer.visibility = isEditor && atom.config.get('linter.displayLinterInfo');
    }));
    this.subscriptions.add(this.bottomContainer.onDidChangeTab(function (scope) {
      _this.emitter.emit('did-update-scope', scope);
      atom.config.set('linter.showErrorPanel', true);
      _this.bottomPanel.refresh(scope);
    }));
    this.subscriptions.add(this.bottomContainer.onShouldTogglePanel(function () {
      atom.config.set('linter.showErrorPanel', !atom.config.get('linter.showErrorPanel'));
    }));

    this._renderBubble = this.renderBubble;
    this.subscriptions.add(atom.config.observe('linter.inlineTooltipInterval', function (bubbleInterval) {
      return _this.renderBubble = _helpers2['default'].debounce(_this._renderBubble, bubbleInterval);
    }));
  }

  _createClass(LinterViews, [{
    key: 'render',
    value: function render(_ref) {
      var added = _ref.added;
      var removed = _ref.removed;
      var messages = _ref.messages;

      this.messages = messages;
      this.notifyEditorLinters({ added: added, removed: removed });
      this.bottomPanel.setMessages({ added: added, removed: removed });
      this.updateCounts();
    }
  }, {
    key: 'updateCounts',
    value: function updateCounts() {
      var activeEditorLinter = this.editors.ofActiveTextEditor();

      this.count.Project = this.messages.length;
      this.count.File = activeEditorLinter ? activeEditorLinter.getMessages().size : 0;
      this.count.Line = activeEditorLinter ? activeEditorLinter.countLineMessages : 0;
      this.bottomContainer.setCount(this.count);
    }
  }, {
    key: 'renderBubble',
    value: function renderBubble(editorLinter) {
      if (!this.showBubble || !editorLinter.messages.size) {
        return;
      }
      var point = editorLinter.editor.getCursorBufferPosition();
      if (this.bubbleRange && this.bubbleRange.containsPoint(point)) {
        return; // The marker remains the same
      } else if (this.bubble) {
          this.bubble.destroy();
          this.bubble = null;
        }
      for (var entry of editorLinter.markers) {
        var bubbleRange = entry[1].getBufferRange();
        if (bubbleRange.containsPoint(point)) {
          this.bubbleRange = bubbleRange;
          this.bubble = editorLinter.editor.decorateMarker(entry[1], {
            type: 'overlay',
            item: (0, _uiMessageBubble.create)(entry[0])
          });
          return;
        }
      }
      this.bubbleRange = null;
    }
  }, {
    key: 'notifyEditorLinters',
    value: function notifyEditorLinters(_ref2) {
      var _this2 = this;

      var added = _ref2.added;
      var removed = _ref2.removed;

      var editorLinter = undefined;
      removed.forEach(function (message) {
        if (message.filePath && (editorLinter = _this2.editors.ofPath(message.filePath))) {
          editorLinter.deleteMessage(message);
        }
      });
      added.forEach(function (message) {
        if (message.filePath && (editorLinter = _this2.editors.ofPath(message.filePath))) {
          editorLinter.addMessage(message);
        }
      });
      editorLinter = this.editors.ofActiveTextEditor();
      if (editorLinter) {
        editorLinter.calculateLineMessages(null);
        this.renderBubble(editorLinter);
      }
    }
  }, {
    key: 'notifyEditorLinter',
    value: function notifyEditorLinter(editorLinter) {
      var path = editorLinter.editor.getPath();
      if (!path) return;
      this.messages.forEach(function (message) {
        if (message.filePath && message.filePath === path) {
          editorLinter.addMessage(message);
        }
      });
    }
  }, {
    key: 'attachBottom',
    value: function attachBottom(statusBar) {
      var _this3 = this;

      this.subscriptions.add(atom.config.observe('linter.statusIconPosition', function (position) {
        if (_this3.bottomBar) {
          _this3.bottomBar.destroy();
        }
        _this3.bottomBar = statusBar['add' + position + 'Tile']({
          item: _this3.bottomContainer,
          priority: position === 'Left' ? -100 : 100
        });
      }));
    }
  }, {
    key: 'onDidUpdateScope',
    value: function onDidUpdateScope(callback) {
      return this.emitter.on('did-update-scope', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      // No need to notify editors of this, we're being disposed means the package is
      // being deactivated. They'll be disposed automatically by the registry.
      this.subscriptions.dispose();
      if (this.bottomBar) {
        this.bottomBar.destroy();
      }
      if (this.bubble) {
        this.bubble.destroy();
        this.bubbleRange = null;
      }
    }
  }]);

  return LinterViews;
})();

exports['default'] = LinterViews;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYXJhaC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2xpbnRlci12aWV3cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUUyQyxNQUFNOzs2QkFDekIsbUJBQW1COzs7O2lDQUNmLHVCQUF1Qjs7OztnQ0FDN0Isc0JBQXNCOzt1QkFDeEIsV0FBVzs7OzsrQkFDTSxxQkFBcUI7O0FBUDFELFdBQVcsQ0FBQTs7SUFTVSxXQUFXO0FBQ25CLFdBRFEsV0FBVyxDQUNsQixLQUFLLEVBQUUsY0FBYyxFQUFFOzs7MEJBRGhCLFdBQVc7O0FBRTVCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxXQUFXLEdBQUcsK0JBQWdCLEtBQUssQ0FBQyxDQUFBO0FBQ3pDLFFBQUksQ0FBQyxlQUFlLEdBQUcsK0JBQWdCLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUNwRCxRQUFJLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQTtBQUM3QixRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQTtBQUNyQixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQTtBQUNsQixRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQTs7QUFFdkIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQ3hDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQTtBQUM1QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7O0FBRXBDLFFBQUksQ0FBQyxLQUFLLEdBQUc7QUFDWCxVQUFJLEVBQUUsQ0FBQztBQUNQLFVBQUksRUFBRSxDQUFDO0FBQ1AsYUFBTyxFQUFFLENBQUM7S0FDWCxDQUFBO0FBQ0Qs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QVcsR0FBRyxJQUFJLENBQUE7T0FDeEI7S0FDRjs7O1NBMUlrQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiIvVXNlcnMvc2FyYWgvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9saW50ZXItdmlld3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge0VtaXR0ZXIsIENvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5pbXBvcnQgQm90dG9tUGFuZWwgZnJvbSAnLi91aS9ib3R0b20tcGFuZWwnXG5pbXBvcnQgQm90dG9tQ29udGFpbmVyIGZyb20gJy4vdWkvYm90dG9tLWNvbnRhaW5lcidcbmltcG9ydCB7TWVzc2FnZX0gZnJvbSAnLi91aS9tZXNzYWdlLWVsZW1lbnQnXG5pbXBvcnQgSGVscGVycyBmcm9tICcuL2hlbHBlcnMnXG5pbXBvcnQge2NyZWF0ZSBhcyBjcmVhdGVCdWJibGV9IGZyb20gJy4vdWkvbWVzc2FnZS1idWJibGUnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbnRlclZpZXdzIHtcbiAgY29uc3RydWN0b3Ioc2NvcGUsIGVkaXRvclJlZ2lzdHJ5KSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLmJvdHRvbVBhbmVsID0gbmV3IEJvdHRvbVBhbmVsKHNjb3BlKVxuICAgIHRoaXMuYm90dG9tQ29udGFpbmVyID0gQm90dG9tQ29udGFpbmVyLmNyZWF0ZShzY29wZSlcbiAgICB0aGlzLmVkaXRvcnMgPSBlZGl0b3JSZWdpc3RyeVxuICAgIHRoaXMuYm90dG9tQmFyID0gbnVsbCAvLyBUbyBiZSBhZGRlZCB3aGVuIHN0YXR1cy1iYXIgc2VydmljZSBpcyBjb25zdW1lZFxuICAgIHRoaXMuYnViYmxlID0gbnVsbFxuICAgIHRoaXMuYnViYmxlUmFuZ2UgPSBudWxsXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuYm90dG9tUGFuZWwpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmJvdHRvbUNvbnRhaW5lcilcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcblxuICAgIHRoaXMuY291bnQgPSB7XG4gICAgICBMaW5lOiAwLFxuICAgICAgRmlsZTogMCxcbiAgICAgIFByb2plY3Q6IDBcbiAgICB9XG4gICAgdGhpcy5tZXNzYWdlcyA9IFtdXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXIuc2hvd0Vycm9ySW5saW5lJywgc2hvd0J1YmJsZSA9PlxuICAgICAgdGhpcy5zaG93QnViYmxlID0gc2hvd0J1YmJsZVxuICAgICkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vbkRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtKHBhbmVJdGVtID0+IHtcbiAgICAgIGxldCBpc0VkaXRvciA9IGZhbHNlXG4gICAgICB0aGlzLmVkaXRvcnMuZm9yRWFjaChmdW5jdGlvbihlZGl0b3JMaW50ZXIpIHtcbiAgICAgICAgaXNFZGl0b3IgPSAoZWRpdG9yTGludGVyLmFjdGl2ZSA9IGVkaXRvckxpbnRlci5lZGl0b3IgPT09IHBhbmVJdGVtKSB8fCBpc0VkaXRvclxuICAgICAgfSlcbiAgICAgIHRoaXMudXBkYXRlQ291bnRzKClcbiAgICAgIHRoaXMuYm90dG9tUGFuZWwucmVmcmVzaCgpXG4gICAgICB0aGlzLmJvdHRvbUNvbnRhaW5lci52aXNpYmlsaXR5ID0gaXNFZGl0b3IgJiYgYXRvbS5jb25maWcuZ2V0KCdsaW50ZXIuZGlzcGxheUxpbnRlckluZm8nKVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5ib3R0b21Db250YWluZXIub25EaWRDaGFuZ2VUYWIoc2NvcGUgPT4ge1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC11cGRhdGUtc2NvcGUnLCBzY29wZSlcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLnNob3dFcnJvclBhbmVsJywgdHJ1ZSlcbiAgICAgIHRoaXMuYm90dG9tUGFuZWwucmVmcmVzaChzY29wZSlcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuYm90dG9tQ29udGFpbmVyLm9uU2hvdWxkVG9nZ2xlUGFuZWwoZnVuY3Rpb24oKSB7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci5zaG93RXJyb3JQYW5lbCcsICFhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci5zaG93RXJyb3JQYW5lbCcpKVxuICAgIH0pKVxuXG4gICAgdGhpcy5fcmVuZGVyQnViYmxlID0gdGhpcy5yZW5kZXJCdWJibGVcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5pbmxpbmVUb29sdGlwSW50ZXJ2YWwnLCBidWJibGVJbnRlcnZhbCA9PlxuICAgICAgdGhpcy5yZW5kZXJCdWJibGUgPSBIZWxwZXJzLmRlYm91bmNlKHRoaXMuX3JlbmRlckJ1YmJsZSwgYnViYmxlSW50ZXJ2YWwpXG4gICAgKSlcbiAgfVxuICByZW5kZXIoe2FkZGVkLCByZW1vdmVkLCBtZXNzYWdlc30pIHtcbiAgICB0aGlzLm1lc3NhZ2VzID0gbWVzc2FnZXNcbiAgICB0aGlzLm5vdGlmeUVkaXRvckxpbnRlcnMoe2FkZGVkLCByZW1vdmVkfSlcbiAgICB0aGlzLmJvdHRvbVBhbmVsLnNldE1lc3NhZ2VzKHthZGRlZCwgcmVtb3ZlZH0pXG4gICAgdGhpcy51cGRhdGVDb3VudHMoKVxuICB9XG4gIHVwZGF0ZUNvdW50cygpIHtcbiAgICBjb25zdCBhY3RpdmVFZGl0b3JMaW50ZXIgPSB0aGlzLmVkaXRvcnMub2ZBY3RpdmVUZXh0RWRpdG9yKClcblxuICAgIHRoaXMuY291bnQuUHJvamVjdCA9IHRoaXMubWVzc2FnZXMubGVuZ3RoXG4gICAgdGhpcy5jb3VudC5GaWxlID0gYWN0aXZlRWRpdG9yTGludGVyID8gYWN0aXZlRWRpdG9yTGludGVyLmdldE1lc3NhZ2VzKCkuc2l6ZSA6IDBcbiAgICB0aGlzLmNvdW50LkxpbmUgPSBhY3RpdmVFZGl0b3JMaW50ZXIgPyBhY3RpdmVFZGl0b3JMaW50ZXIuY291bnRMaW5lTWVzc2FnZXMgOiAwXG4gICAgdGhpcy5ib3R0b21Db250YWluZXIuc2V0Q291bnQodGhpcy5jb3VudClcbiAgfVxuICByZW5kZXJCdWJibGUoZWRpdG9yTGludGVyKSB7XG4gICAgaWYgKCF0aGlzLnNob3dCdWJibGUgfHwgIWVkaXRvckxpbnRlci5tZXNzYWdlcy5zaXplKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3QgcG9pbnQgPSBlZGl0b3JMaW50ZXIuZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcbiAgICBpZiAodGhpcy5idWJibGVSYW5nZSAmJiB0aGlzLmJ1YmJsZVJhbmdlLmNvbnRhaW5zUG9pbnQocG9pbnQpKSB7XG4gICAgICByZXR1cm4gLy8gVGhlIG1hcmtlciByZW1haW5zIHRoZSBzYW1lXG4gICAgfSBlbHNlIGlmICh0aGlzLmJ1YmJsZSkge1xuICAgICAgdGhpcy5idWJibGUuZGVzdHJveSgpXG4gICAgICB0aGlzLmJ1YmJsZSA9IG51bGxcbiAgICB9XG4gICAgZm9yIChsZXQgZW50cnkgb2YgZWRpdG9yTGludGVyLm1hcmtlcnMpIHtcbiAgICAgIGNvbnN0IGJ1YmJsZVJhbmdlID0gZW50cnlbMV0uZ2V0QnVmZmVyUmFuZ2UoKVxuICAgICAgaWYgKGJ1YmJsZVJhbmdlLmNvbnRhaW5zUG9pbnQocG9pbnQpKSB7XG4gICAgICAgIHRoaXMuYnViYmxlUmFuZ2UgPSBidWJibGVSYW5nZVxuICAgICAgICB0aGlzLmJ1YmJsZSA9IGVkaXRvckxpbnRlci5lZGl0b3IuZGVjb3JhdGVNYXJrZXIoZW50cnlbMV0sIHtcbiAgICAgICAgICB0eXBlOiAnb3ZlcmxheScsXG4gICAgICAgICAgaXRlbTogY3JlYXRlQnViYmxlKGVudHJ5WzBdKVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5idWJibGVSYW5nZSA9IG51bGxcbiAgfVxuICBub3RpZnlFZGl0b3JMaW50ZXJzKHthZGRlZCwgcmVtb3ZlZH0pIHtcbiAgICBsZXQgZWRpdG9yTGludGVyXG4gICAgcmVtb3ZlZC5mb3JFYWNoKG1lc3NhZ2UgPT4ge1xuICAgICAgaWYgKG1lc3NhZ2UuZmlsZVBhdGggJiYgKGVkaXRvckxpbnRlciA9IHRoaXMuZWRpdG9ycy5vZlBhdGgobWVzc2FnZS5maWxlUGF0aCkpKSB7XG4gICAgICAgIGVkaXRvckxpbnRlci5kZWxldGVNZXNzYWdlKG1lc3NhZ2UpXG4gICAgICB9XG4gICAgfSlcbiAgICBhZGRlZC5mb3JFYWNoKG1lc3NhZ2UgPT4ge1xuICAgICAgaWYgKG1lc3NhZ2UuZmlsZVBhdGggJiYgKGVkaXRvckxpbnRlciA9IHRoaXMuZWRpdG9ycy5vZlBhdGgobWVzc2FnZS5maWxlUGF0aCkpKSB7XG4gICAgICAgIGVkaXRvckxpbnRlci5hZGRNZXNzYWdlKG1lc3NhZ2UpXG4gICAgICB9XG4gICAgfSlcbiAgICBlZGl0b3JMaW50ZXIgPSB0aGlzLmVkaXRvcnMub2ZBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBpZiAoZWRpdG9yTGludGVyKSB7XG4gICAgICBlZGl0b3JMaW50ZXIuY2FsY3VsYXRlTGluZU1lc3NhZ2VzKG51bGwpXG4gICAgICB0aGlzLnJlbmRlckJ1YmJsZShlZGl0b3JMaW50ZXIpXG4gICAgfVxuICB9XG4gIG5vdGlmeUVkaXRvckxpbnRlcihlZGl0b3JMaW50ZXIpIHtcbiAgICBjb25zdCBwYXRoID0gZWRpdG9yTGludGVyLmVkaXRvci5nZXRQYXRoKClcbiAgICBpZiAoIXBhdGgpIHJldHVyblxuICAgIHRoaXMubWVzc2FnZXMuZm9yRWFjaChmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgICBpZiAobWVzc2FnZS5maWxlUGF0aCAmJiBtZXNzYWdlLmZpbGVQYXRoID09PSBwYXRoKSB7XG4gICAgICAgIGVkaXRvckxpbnRlci5hZGRNZXNzYWdlKG1lc3NhZ2UpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuICBhdHRhY2hCb3R0b20oc3RhdHVzQmFyKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXIuc3RhdHVzSWNvblBvc2l0aW9uJywgcG9zaXRpb24gPT4ge1xuICAgICAgaWYgKHRoaXMuYm90dG9tQmFyKSB7XG4gICAgICAgIHRoaXMuYm90dG9tQmFyLmRlc3Ryb3koKVxuICAgICAgfVxuICAgICAgdGhpcy5ib3R0b21CYXIgPSBzdGF0dXNCYXJbYGFkZCR7cG9zaXRpb259VGlsZWBdKHtcbiAgICAgICAgaXRlbTogdGhpcy5ib3R0b21Db250YWluZXIsXG4gICAgICAgIHByaW9yaXR5OiBwb3NpdGlvbiA9PT0gJ0xlZnQnID8gLTEwMCA6IDEwMFxuICAgICAgfSlcbiAgICB9KSlcbiAgfVxuXG4gIG9uRGlkVXBkYXRlU2NvcGUoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtdXBkYXRlLXNjb3BlJywgY2FsbGJhY2spXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICAvLyBObyBuZWVkIHRvIG5vdGlmeSBlZGl0b3JzIG9mIHRoaXMsIHdlJ3JlIGJlaW5nIGRpc3Bvc2VkIG1lYW5zIHRoZSBwYWNrYWdlIGlzXG4gICAgLy8gYmVpbmcgZGVhY3RpdmF0ZWQuIFRoZXknbGwgYmUgZGlzcG9zZWQgYXV0b21hdGljYWxseSBieSB0aGUgcmVnaXN0cnkuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIGlmICh0aGlzLmJvdHRvbUJhcikge1xuICAgICAgdGhpcy5ib3R0b21CYXIuZGVzdHJveSgpXG4gICAgfVxuICAgIGlmICh0aGlzLmJ1YmJsZSkge1xuICAgICAgdGhpcy5idWJibGUuZGVzdHJveSgpXG4gICAgICB0aGlzLmJ1YmJsZVJhbmdlID0gbnVsbFxuICAgIH1cbiAgfVxufVxuIl19
//# sourceURL=/Users/sarah/.atom/packages/linter/lib/linter-views.js
