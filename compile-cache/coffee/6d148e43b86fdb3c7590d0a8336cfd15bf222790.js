(function() {
  var CompositeDisposable, Emitter, SuggestionList, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ref = require('atom'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;

  module.exports = SuggestionList = (function() {
    function SuggestionList() {
      this.destroyOverlay = __bind(this.destroyOverlay, this);
      this.hideAndFocusOn = __bind(this.hideAndFocusOn, this);
      this.show = __bind(this.show, this);
      this.cancel = __bind(this.cancel, this);
      this.selectPrevious = __bind(this.selectPrevious, this);
      this.selectNext = __bind(this.selectNext, this);
      this.confirm = __bind(this.confirm, this);
      this.confirmSelection = __bind(this.confirmSelection, this);
      this.compositionInProgress = false;
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('autocomplete-suggestion-list', {
        'autocomplete-plus:confirm': this.confirmSelection,
        'autocomplete-plus:select-next': this.selectNext,
        'autocomplete-plus:select-previous': this.selectPrevious,
        'autocomplete-plus:cancel': this.cancel
      }));
    }

    SuggestionList.prototype.addKeyboardInteraction = function() {
      var completionKey, keys, navigationKey, _ref1;
      this.removeKeyboardInteraction();
      keys = {
        'escape': 'autocomplete-plus:cancel'
      };
      completionKey = atom.config.get('autocomplete-plus.confirmCompletion') || '';
      navigationKey = atom.config.get('autocomplete-plus.navigateCompletions') || '';
      if (completionKey.indexOf('tab') > -1) {
        keys['tab'] = 'autocomplete-plus:confirm';
      }
      if (completionKey.indexOf('enter') > -1) {
        keys['enter'] = 'autocomplete-plus:confirm';
      }
      if (((_ref1 = this.items) != null ? _ref1.length : void 0) > 1 && navigationKey === 'up,down') {
        keys['up'] = 'autocomplete-plus:select-previous';
        keys['down'] = 'autocomplete-plus:select-next';
      } else {
        keys['ctrl-n'] = 'autocomplete-plus:select-next';
        keys['ctrl-p'] = 'autocomplete-plus:select-previous';
      }
      this.keymaps = atom.keymaps.add('autocomplete-suggestion-list', {
        'atom-text-editor:not(.mini) .autocomplete-plus': keys
      });
      return this.subscriptions.add(this.keymaps);
    };

    SuggestionList.prototype.removeKeyboardInteraction = function() {
      var _ref1;
      if ((_ref1 = this.keymaps) != null) {
        _ref1.dispose();
      }
      return this.subscriptions.remove(this.keymaps);
    };

    SuggestionList.prototype.confirmSelection = function() {
      return this.emitter.emit('did-confirm-selection');
    };

    SuggestionList.prototype.onDidConfirmSelection = function(fn) {
      return this.emitter.on('did-confirm-selection', fn);
    };

    SuggestionList.prototype.confirm = function(match) {
      return this.emitter.emit('did-confirm', match);
    };

    SuggestionList.prototype.onDidConfirm = function(fn) {
      return this.emitter.on('did-confirm', fn);
    };

    SuggestionList.prototype.selectNext = function() {
      return this.emitter.emit('did-select-next');
    };

    SuggestionList.prototype.onDidSelectNext = function(fn) {
      return this.emitter.on('did-select-next', fn);
    };

    SuggestionList.prototype.selectPrevious = function() {
      return this.emitter.emit('did-select-previous');
    };

    SuggestionList.prototype.onDidSelectPrevious = function(fn) {
      return this.emitter.on('did-select-previous', fn);
    };

    SuggestionList.prototype.cancel = function() {
      return this.emitter.emit('did-cancel');
    };

    SuggestionList.prototype.onDidCancel = function(fn) {
      return this.emitter.on('did-cancel', fn);
    };

    SuggestionList.prototype.show = function(editor) {
      var marker, _ref1;
      if (this.active) {
        return;
      }
      if (editor == null) {
        return;
      }
      this.destroyOverlay();
      marker = (_ref1 = editor.getLastCursor()) != null ? _ref1.getMarker() : void 0;
      if (marker == null) {
        return;
      }
      this.overlayDecoration = editor.decorateMarker(marker, {
        type: 'overlay',
        item: this
      });
      this.addKeyboardInteraction();
      return this.active = true;
    };

    SuggestionList.prototype.hideAndFocusOn = function(refocusTarget) {
      if (!this.active) {
        return;
      }
      this.destroyOverlay();
      this.removeKeyboardInteraction();
      if (refocusTarget != null) {
        if (typeof refocusTarget.focus === "function") {
          refocusTarget.focus();
        }
      }
      return this.active = false;
    };

    SuggestionList.prototype.destroyOverlay = function() {
      var _ref1;
      if ((_ref1 = this.overlayDecoration) != null) {
        _ref1.destroy();
      }
      return this.overlayDecoration = void 0;
    };

    SuggestionList.prototype.changeItems = function(items) {
      this.items = items;
      return this.emitter.emit('did-change-items', items);
    };

    SuggestionList.prototype.onDidChangeItems = function(fn) {
      return this.emitter.on('did-change-items', fn);
    };

    SuggestionList.prototype.destroy = function() {
      this.subscriptions.dispose();
      this.emitter.emit('did-destroy');
      return this.emitter.dispose();
    };

    SuggestionList.prototype.onDidDestroy = function(fn) {
      return this.emitter.on('did-destroy', fn);
    };

    return SuggestionList;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtEQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxPQUFpQyxPQUFBLENBQVEsTUFBUixDQUFqQyxFQUFDLGVBQUEsT0FBRCxFQUFVLDJCQUFBLG1CQUFWLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSx3QkFBQSxHQUFBO0FBQ1gsNkRBQUEsQ0FBQTtBQUFBLDZEQUFBLENBQUE7QUFBQSx5Q0FBQSxDQUFBO0FBQUEsNkNBQUEsQ0FBQTtBQUFBLDZEQUFBLENBQUE7QUFBQSxxREFBQSxDQUFBO0FBQUEsK0NBQUEsQ0FBQTtBQUFBLGlFQUFBLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxxQkFBRCxHQUF5QixLQUF6QixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxPQURYLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFGakIsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQiw4QkFBbEIsRUFDakI7QUFBQSxRQUFBLDJCQUFBLEVBQTZCLElBQUMsQ0FBQSxnQkFBOUI7QUFBQSxRQUNBLCtCQUFBLEVBQWlDLElBQUMsQ0FBQSxVQURsQztBQUFBLFFBRUEsbUNBQUEsRUFBcUMsSUFBQyxDQUFBLGNBRnRDO0FBQUEsUUFHQSwwQkFBQSxFQUE0QixJQUFDLENBQUEsTUFIN0I7T0FEaUIsQ0FBbkIsQ0FKQSxDQURXO0lBQUEsQ0FBYjs7QUFBQSw2QkFZQSxzQkFBQSxHQUF3QixTQUFBLEdBQUE7QUFDdEIsVUFBQSx5Q0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLHlCQUFELENBQUEsQ0FBQSxD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
//# sourceURL=/Users/sarah/.atom/packages/autocomplete-plus/lib/suggestion-list.coffee