(function() {
  var CompositeDisposable, SuggestionListElement, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('event-kit').CompositeDisposable;

  _ = require('underscore-plus');

  SuggestionListElement = (function(_super) {
    __extends(SuggestionListElement, _super);

    function SuggestionListElement() {
      return SuggestionListElement.__super__.constructor.apply(this, arguments);
    }

    SuggestionListElement.prototype.maxItems = 10;

    SuggestionListElement.prototype.createdCallback = function() {
      this.subscriptions = new CompositeDisposable;
      this.classList.add('popover-list');
      this.classList.add('select-list');
      this.classList.add('autocomplete-plus');
      this.classList.add('autocomplete-suggestion-list');
      this.subscriptions.add(atom.config.observe('autocomplete-plus.maxSuggestions', (function(_this) {
        return function() {
          return _this.maxItems = atom.config.get('autocomplete-plus.maxSuggestions');
        };
      })(this)));
      return this.registerMouseHandling();
    };

    SuggestionListElement.prototype.attachedCallback = function() {
      if (!this.input) {
        this.renderInput();
      }
      if (!this.ol) {
        this.renderList();
      }
      return this.itemsChanged();
    };

    SuggestionListElement.prototype.detachedCallback = function() {};

    SuggestionListElement.prototype.initialize = function(model) {
      this.model = model;
      if (model == null) {
        return;
      }
      this.subscriptions.add(this.model.onDidChangeItems(this.itemsChanged.bind(this)));
      this.subscriptions.add(this.model.onDidSelectNext(this.moveSelectionDown.bind(this)));
      this.subscriptions.add(this.model.onDidSelectPrevious(this.moveSelectionUp.bind(this)));
      this.subscriptions.add(this.model.onDidConfirmSelection(this.confirmSelection.bind(this)));
      this.subscriptions.add(this.model.onDidDestroy(this.dispose.bind(this)));
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
      this.renderItems();
      return setTimeout((function(_this) {
        return function() {
          return _this.input.focus();
        };
      })(this), 0);
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
      item = this.getSelectedItem();
      if (item != null) {
        return this.model.confirm(item);
      } else {
        return this.model.cancel();
      }
    };

    SuggestionListElement.prototype.renderInput = function() {
      this.input = document.createElement('input');
      this.appendChild(this.input);
      this.input.addEventListener('compositionstart', (function(_this) {
        return function() {
          _this.model.compositionInProgress = true;
          return null;
        };
      })(this));
      return this.input.addEventListener('compositionend', (function(_this) {
        return function() {
          _this.model.compositionInProgress = false;
          return null;
        };
      })(this));
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
          var className, label, labelSpan, li, renderLabelAsHtml, word, wordSpan;
          word = _arg.word, label = _arg.label, renderLabelAsHtml = _arg.renderLabelAsHtml, className = _arg.className;
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
          wordSpan.textContent = word;
          labelSpan = li.childNodes[1];
          if (label) {
            if (!labelSpan) {
              labelSpan = document.createElement('span');
              if (label) {
                li.appendChild(labelSpan);
              }
              labelSpan.className = 'label';
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLFdBQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FESixDQUFBOztBQUFBLEVBR007QUFDSiw0Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsb0NBQUEsUUFBQSxHQUFVLEVBQVYsQ0FBQTs7QUFBQSxvQ0FFQSxlQUFBLEdBQWlCLFNBQUEsR0FBQTtBQUNmLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUFqQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsU0FBUyxDQUFDLEdBQVgsQ0FBZSxjQUFmLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxHQUFYLENBQWUsYUFBZixDQUZBLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWCxDQUFlLG1CQUFmLENBSEEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxHQUFYLENBQWUsOEJBQWYsQ0FKQSxDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLGtDQUFwQixFQUF3RCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxRQUFELEdBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGtDQUFoQixFQUFmO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEQsQ0FBbkIsQ0FMQSxDQUFBO2FBTUEsSUFBQyxDQUFBLHFCQUFELENBQUEsRUFQZTtJQUFBLENBRmpC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
//# sourceURL=/Users/sarah/.atom/packages/autocomplete-plus/lib/suggestion-list-element.coffee