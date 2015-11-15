(function() {
  var CompositeDisposable, SuggestionListElement, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  _ = require('underscore-plus');

  SuggestionListElement = (function(_super) {
    __extends(SuggestionListElement, _super);

    function SuggestionListElement() {
      return SuggestionListElement.__super__.constructor.apply(this, arguments);
    }

    SuggestionListElement.prototype.maxItems = 10;

    SuggestionListElement.prototype.createdCallback = function() {
      this.subscriptions = new CompositeDisposable;
      this.classList.add('popover-list', 'select-list', 'autocomplete-suggestion-list');
      this.subscriptions.add(atom.config.observe('autocomplete-plus.maxSuggestions', (function(_this) {
        return function() {
          return _this.maxItems = atom.config.get('autocomplete-plus.maxSuggestions');
        };
      })(this)));
      return this.registerMouseHandling();
    };

    SuggestionListElement.prototype.attachedCallback = function() {
      this.parentElement.classList.add('autocomplete-plus');
      this.addActiveClassToEditor();
      if (!this.ol) {
        this.renderList();
      }
      return this.itemsChanged();
    };

    SuggestionListElement.prototype.detachedCallback = function() {
      return this.removeActiveClassFromEditor();
    };

    SuggestionListElement.prototype.initialize = function(model) {
      this.model = model;
      if (model == null) {
        return;
      }
      this.subscriptions.add(this.model.onDidChangeItems(this.itemsChanged.bind(this)));
      this.subscriptions.add(this.model.onDidSelectNext(this.moveSelectionDown.bind(this)));
      this.subscriptions.add(this.model.onDidSelectPrevious(this.moveSelectionUp.bind(this)));
      this.subscriptions.add(this.model.onDidConfirmSelection(this.confirmSelection.bind(this)));
      this.subscriptions.add(this.model.onDidDispose(this.dispose.bind(this)));
      return this;
    };

    SuggestionListElement.prototype.registerMouseHandling = function() {
      this.onmousewheel = function(event) {
        return event.stopPropagation();
      };
      this.onmousedown = function(event) {
        var item, _ref, _ref1;
        item = event.target;
        while (!((_ref = item.dataset) != null ? _ref.index : void 0) && item !== this) {
          item = item.parentNode;
        }
        this.selectedIndex = (_ref1 = item.dataset) != null ? _ref1.index : void 0;
        return event.stopPropagation();
      };
      return this.onmouseup = function(event) {
        event.stopPropagation();
        return this.confirmSelection();
      };
    };

    SuggestionListElement.prototype.itemsChanged = function() {
      this.selectedIndex = 0;
      return this.renderItems();
    };

    SuggestionListElement.prototype.addActiveClassToEditor = function() {
      var editorElement;
      editorElement = atom.views.getView(atom.workspace.getActiveTextEditor());
      return editorElement.classList.add('autocomplete-active');
    };

    SuggestionListElement.prototype.removeActiveClassFromEditor = function() {
      var editorElement;
      editorElement = atom.views.getView(atom.workspace.getActiveTextEditor());
      return editorElement.classList.remove('autocomplete-active');
    };

    SuggestionListElement.prototype.moveSelectionUp = function() {
      if (!(this.selectedIndex <= 0)) {
        return this.setSelectedIndex(this.selectedIndex - 1);
      } else {
        return this.setSelectedIndex(this.visibleItems().length - 1);
      }
    };

    SuggestionListElement.prototype.moveSelectionDown = function() {
      if (!(this.selectedIndex >= (this.visibleItems().length - 1))) {
        return this.setSelectedIndex(this.selectedIndex + 1);
      } else {
        return this.setSelectedIndex(0);
      }
    };

    SuggestionListElement.prototype.setSelectedIndex = function(index) {
      this.selectedIndex = index;
      return this.renderItems();
    };

    SuggestionListElement.prototype.visibleItems = function() {
      var _ref, _ref1;
      return (_ref = this.model) != null ? (_ref1 = _ref.items) != null ? _ref1.slice(0, this.maxItems) : void 0 : void 0;
    };

    SuggestionListElement.prototype.getSelectedItem = function() {
      var _ref, _ref1;
      return (_ref = this.model) != null ? (_ref1 = _ref.items) != null ? _ref1[this.selectedIndex] : void 0 : void 0;
    };

    SuggestionListElement.prototype.confirmSelection = function() {
      var item;
      if (!this.model.isActive()) {
        return;
      }
      item = this.getSelectedItem();
      if (item != null) {
        return this.model.confirm(item);
      } else {
        return this.model.cancel();
      }
    };

    SuggestionListElement.prototype.renderList = function() {
      this.ol = document.createElement('ol');
      this.appendChild(this.ol);
      return this.ol.className = 'list-group';
    };

    SuggestionListElement.prototype.renderItems = function() {
      var items, li, _ref;
      items = this.visibleItems() || [];
      items.forEach((function(_this) {
        return function(_arg, index) {
          var ch, className, i, label, labelSpan, li, prefix, renderLabelAsHtml, word, wordIndex, wordSpan, _i, _len, _ref;
          word = _arg.word, label = _arg.label, renderLabelAsHtml = _arg.renderLabelAsHtml, className = _arg.className, prefix = _arg.prefix;
          li = _this.ol.childNodes[index];
          if (!li) {
            li = document.createElement('li');
            _this.ol.appendChild(li);
            li.dataset.index = index;
          }
          li.className = '';
          if (className) {
            li.classList.add(className);
          }
          if (index === _this.selectedIndex) {
            li.classList.add('selected');
          }
          if (index === _this.selectedIndex) {
            _this.selectedLi = li;
          }
          wordSpan = li.childNodes[0];
          if (!wordSpan) {
            wordSpan = document.createElement('span');
            li.appendChild(wordSpan);
            wordSpan.className = 'word';
          }
          wordSpan.innerHTML = ((function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = word.length; _i < _len; _i++) {
              ch = word[_i];
              _results.push("<span>" + ch + "</span>");
            }
            return _results;
          })()).join('');
          wordIndex = 0;
          for (i = _i = 0, _len = prefix.length; _i < _len; i = ++_i) {
            ch = prefix[i];
            while (wordIndex < word.length && word[wordIndex].toLowerCase() !== ch.toLowerCase()) {
              wordIndex += 1;
            }
            if ((_ref = wordSpan.childNodes[wordIndex]) != null) {
              _ref.classList.add('character-match');
            }
            wordIndex += 1;
          }
          labelSpan = li.childNodes[1];
          if (label) {
            if (!labelSpan) {
              labelSpan = document.createElement('span');
              if (label) {
                li.appendChild(labelSpan);
              }
              labelSpan.className = 'completion-label text-smaller text-subtle';
            }
            if (renderLabelAsHtml) {
              return labelSpan.innerHTML = label;
            } else {
              return labelSpan.textContent = label;
            }
          } else {
            return labelSpan != null ? labelSpan.remove() : void 0;
          }
        };
      })(this));
      while (li = this.ol.childNodes[items.length]) {
        li.remove();
      }
      return (_ref = this.selectedLi) != null ? _ref.scrollIntoView(false) : void 0;
    };

    SuggestionListElement.prototype.dispose = function() {
      var _ref;
      this.subscriptions.dispose();
      return (_ref = this.parentNode) != null ? _ref.removeChild(this) : void 0;
    };

    return SuggestionListElement;

  })(HTMLElement);

  module.exports = SuggestionListElement = document.registerElement('autocomplete-suggestion-list', {
    prototype: SuggestionListElement.prototype
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FESixDQUFBOztBQUFBLEVBR007QUFDSiw0Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsb0NBQUEsUUFBQSxHQUFVLEVBQVYsQ0FBQTs7QUFBQSxvQ0FFQSxlQUFBLEdBQWlCLFNBQUEsR0FBQTtBQUNmLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUFqQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsU0FBUyxDQUFDLEdBQVgsQ0FBZSxjQUFmLEVBQStCLGFBQS9CLEVBQThDLDhCQUE5QyxDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0Isa0NBQXBCLEVBQXdELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLFFBQUQsR0FBWSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isa0NBQWhCLEVBQWY7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4RCxDQUFuQixDQUZBLENBQUE7YUFHQSxJQUFDLENBQUEscUJBQUQsQ0FBQSxFQUplO0lBQUEsQ0FGakIsQ0FBQTs7QUFBQSxvQ0FRQSxnQkFBQSxHQUFrQixTQUFBLEdBQUE7QUFFaEIsTUFBQSxJQUFDLENBQUEsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUF6QixDQUE2QixtQkFBN0IsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsc0JBQUQsQ0FBQSxD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
//# sourceURL=/Users/sarah/.atom/packages/autocomplete-plus/lib/suggestion-list-element.coffee