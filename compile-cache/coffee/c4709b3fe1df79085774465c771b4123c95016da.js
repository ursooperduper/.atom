(function() {
  var CompositeDisposable, Emitter, Model, SuggestionList, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('theorist').Model;

  _ref = require('event-kit'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;

  module.exports = SuggestionList = (function(_super) {
    __extends(SuggestionList, _super);

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

    SuggestionList.prototype.destroyed = function() {
      this.subscriptions.dispose();
      this.emitter.emit('did-destroy');
      return this.emitter.dispose();
    };

    SuggestionList.prototype.onDidDestroy = function(fn) {
      return this.emitter.on('did-destroy', fn);
    };

    return SuggestionList;

  })(Model);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlEQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsUUFBUyxPQUFBLENBQVEsVUFBUixFQUFULEtBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQWlDLE9BQUEsQ0FBUSxXQUFSLENBQWpDLEVBQUMsZUFBQSxPQUFELEVBQVUsMkJBQUEsbUJBRFYsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixxQ0FBQSxDQUFBOztBQUFhLElBQUEsd0JBQUEsR0FBQTtBQUNYLDZEQUFBLENBQUE7QUFBQSw2REFBQSxDQUFBO0FBQUEseUNBQUEsQ0FBQTtBQUFBLDZDQUFBLENBQUE7QUFBQSw2REFBQSxDQUFBO0FBQUEscURBQUEsQ0FBQTtBQUFBLCtDQUFBLENBQUE7QUFBQSxpRUFBQSxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEscUJBQUQsR0FBeUIsS0FBekIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUFBLENBQUEsT0FEWCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBRmpCLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsOEJBQWxCLEVBQ2pCO0FBQUEsUUFBQSwyQkFBQSxFQUE2QixJQUFDLENBQUEsZ0JBQTlCO0FBQUEsUUFDQSwrQkFBQSxFQUFpQyxJQUFDLENBQUEsVUFEbEM7QUFBQSxRQUVBLG1DQUFBLEVBQXFDLElBQUMsQ0FBQSxjQUZ0QztBQUFBLFFBR0EsMEJBQUEsRUFBNEIsSUFBQyxDQUFBLE1BSDdCO09BRGlCLENBQW5CLENBSkEsQ0FEVztJQUFBLENBQWI7O0FBQUEsNkJBWUEsc0JBQUEsR0FBd0IsU0FBQSxHQUFBO0FBQ3RCLFVBQUEseUNBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSx5QkFBRCxDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQSxHQUNFO0FBQUEsUUFBQSxRQUFBLEVBQVUsMEJBQVY7T0FGRixDQUFBO0FBQUEsTUFJQSxhQUFBLEdBQWdCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixxQ0FBaEIsQ0FBQSxJQUEwRCxFQUoxRSxDQUFBO0FBQUEsTUFLQSxhQUFBLEdBQWdCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1Q0FBaEIsQ0FBQSxJQUE0RCxFQUw1RSxDQUFBO0FBUUEsTUFBQSxJQUE2QyxhQUFhLENBQUMsT0FBZCxDQUFzQixLQUF0QixDQUFBLEdBQStCLENBQUEsQ0FBNUU7QUFBQSxRQUFBLElBQUssQ0FBQSxLQUFBLENBQUwsR0FBYywyQkFBZCxDQUFBO09BUkE7QUFTQSxNQUFBLElBQStDLGFBQWEsQ0FBQyxPQUFkLENBQXNCLE9BQXRCLENBQUEsR0FBaUMsQ0FBQSxDQUFoRjtBQUFBLFFBQUEsSUFBSyxDQUFBLE9BQUEsQ0FBTCxHQUFnQiwyQkFBaEIsQ0FBQTtPQVRBO0FBV0EsTUFBQSx5Q0FBUyxDQUFFLGdCQUFSLEdBQWlCLENBQWpCLElBQXVCLGFBQUEsS0FBaUIsU0FBM0M7QUFDRSxRQUFBLElBQUssQ0FBQSxJQUFBLENBQUwsR0FBYyxtQ0FBZCxDQUFBO0FBQUEsUUFDQSxJQUFLLENBQUEsTUFBQSxDQUFMLEdBQWUsK0JBRGYsQ0FERjtPQUFBLE1BQUE7QUFJRSxRQUFBLElBQUssQ0FBQSxRQUFBLENBQUwsR0FBaUIsK0JBQWpCLENBQUE7QUFBQSxRQUNBLElBQUssQ0FBQSxRQUFBLENBQUwsR0FBaUIsbUNBRGpCLENBSkY7T0FYQTtBQUFBLE1Ba0JBLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFiLENBQ1QsOEJBRFMsRUFFVDtBQUFBLFFBQUEsZ0RBQUEsRUFBa0QsSUFBbEQ7T0FGUyxDQWxCWCxDQUFBO2FBdUJBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsT0FBcEIsRUF4QnNCO0lBQUEsQ0FaeEIsQ0FBQTs7QUFBQSw2QkFzQ0EseUJBQUEsR0FBMkIsU0FBQSxHQUFBO0FBQ3pCLFVBQUEsS0FBQTs7YUFBUSxDQUFFLE9BQVYsQ0FBQTtPQUFBO2FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxNQUFmLENBQXNCLElBQUMsQ0FBQSxPQUF2QixFQUZ5QjtJQUFBLENBdEMzQixDQUFBOztBQUFBLDZCQTBDQSxnQkFBQSxHQUFrQixTQUFBLEdBQUE7YUFDaEIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsdUJBQWQsRUFEZ0I7SUFBQSxDQTFDbEIsQ0FBQTs7QUFBQSw2QkE2Q0EscUJBQUEsR0FBdUIsU0FBQyxFQUFELEdBQUE7YUFDckIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksdUJBQVosRUFBcUMsRUFBckMsRUFEcUI7SUFBQSxDQTdDdkIsQ0FBQTs7QUFBQSw2QkFnREEsT0FBQSxHQUFTLFNBQUMsS0FBRCxHQUFBO2FBQ1AsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsYUFBZCxFQUE2QixLQUE3QixFQURPO0lBQUEsQ0FoRFQsQ0FBQTs7QUFBQSw2QkFtREEsWUFBQSxHQUFjLFNBQUMsRUFBRCxHQUFBO2FBQ1osSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksYUFBWixFQUEyQixFQUEzQixFQURZO0lBQUEsQ0FuRGQsQ0FBQTs7QUFBQSw2QkFzREEsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUNWLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLGlCQUFkLEVBRFU7SUFBQSxDQXREWixDQUFBOztBQUFBLDZCQXlEQSxlQUFBLEdBQWlCLFNBQUMsRUFBRCxHQUFBO2FBQ2YsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksaUJBQVosRUFBK0IsRUFBL0IsRUFEZTtJQUFBLENBekRqQixDQUFBOztBQUFBLDZCQTREQSxjQUFBLEdBQWdCLFNBQUEsR0FBQTthQUNkLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLHFCQUFkLEVBRGM7SUFBQSxDQTVEaEIsQ0FBQTs7QUFBQSw2QkErREEsbUJBQUEsR0FBcUIsU0FBQyxFQUFELEdBQUE7YUFDbkIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVkscUJBQVosRUFBbUMsRUFBbkMsRUFEbUI7SUFBQSxDQS9EckIsQ0FBQTs7QUFBQSw2QkFrRUEsTUFBQSxHQUFRLFNBQUEsR0FBQTthQUNOLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLFlBQWQsRUFETTtJQUFBLENBbEVSLENBQUE7O0FBQUEsNkJBcUVBLFdBQUEsR0FBYSxTQUFDLEVBQUQsR0FBQTthQUNYLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLFlBQVosRUFBMEIsRUFBMUIsRUFEVztJQUFBLENBckViLENBQUE7O0FBQUEsNkJBd0VBLElBQUEsR0FBTSxTQUFDLE1BQUQsR0FBQTtBQUNKLFVBQUEsYUFBQTtBQUFBLE1BQUEsSUFBVSxJQUFDLENBQUEsTUFBWDtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQ0EsTUFBQSxJQUFjLGNBQWQ7QUFBQSxjQUFBLENBQUE7T0FEQTtBQUFBLE1BRUEsSUFBQyxDQUFBLGNBQUQsQ0FBQSxDQUZBLENBQUE7QUFBQSxNQUlBLE1BQUEsbURBQStCLENBQUUsU0FBeEIsQ0FBQSxVQUpULENBQUE7QUFLQSxNQUFBLElBQWMsY0FBZDtBQUFBLGNBQUEsQ0FBQTtPQUxBO0FBQUEsTUFNQSxJQUFDLENBQUEsaUJBQUQsR0FBcUIsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsTUFBdEIsRUFBOEI7QUFBQSxRQUFDLElBQUEsRUFBTSxTQUFQO0FBQUEsUUFBa0IsSUFBQSxFQUFNLElBQXhCO09BQTlCLENBTnJCLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxzQkFBRCxDQUFBLENBUEEsQ0FBQTthQVFBLElBQUMsQ0FBQSxNQUFELEdBQVUsS0FUTjtJQUFBLENBeEVOLENBQUE7O0FBQUEsNkJBbUZBLGNBQUEsR0FBZ0IsU0FBQyxhQUFELEdBQUE7QUFDZCxNQUFBLElBQUEsQ0FBQSxJQUFlLENBQUEsTUFBZjtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsY0FBRCxDQUFBLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLHlCQUFELENBQUEsQ0FGQSxDQUFBOzs7VUFHQSxhQUFhLENBQUU7O09BSGY7YUFJQSxJQUFDLENBQUEsTUFBRCxHQUFVLE1BTEk7SUFBQSxDQW5GaEIsQ0FBQTs7QUFBQSw2QkEwRkEsY0FBQSxHQUFnQixTQUFBLEdBQUE7QUFDZCxVQUFBLEtBQUE7O2FBQWtCLENBQUUsT0FBcEIsQ0FBQTtPQUFBO2FBQ0EsSUFBQyxDQUFBLGlCQUFELEdBQXFCLE9BRlA7SUFBQSxDQTFGaEIsQ0FBQTs7QUFBQSw2QkE4RkEsV0FBQSxHQUFhLFNBQUUsS0FBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsUUFBQSxLQUNiLENBQUE7YUFBQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxrQkFBZCxFQUFrQyxLQUFsQyxFQURXO0lBQUEsQ0E5RmIsQ0FBQTs7QUFBQSw2QkFpR0EsZ0JBQUEsR0FBa0IsU0FBQyxFQUFELEdBQUE7YUFDaEIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksa0JBQVosRUFBZ0MsRUFBaEMsRUFEZ0I7SUFBQSxDQWpHbEIsQ0FBQTs7QUFBQSw2QkFxR0EsU0FBQSxHQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxhQUFkLENBREEsQ0FBQTthQUVBLElBQUMsQ0FBQSxPQUFPLENBQUMsT0FBVCxDQUFBLEVBSFM7SUFBQSxDQXJHWCxDQUFBOztBQUFBLDZCQTBHQSxZQUFBLEdBQWMsU0FBQyxFQUFELEdBQUE7YUFDWixJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxhQUFaLEVBQTJCLEVBQTNCLEVBRFk7SUFBQSxDQTFHZCxDQUFBOzswQkFBQTs7S0FEMkIsTUFKN0IsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/sarah/.atom/packages/autocomplete-plus/lib/suggestion-list.coffee