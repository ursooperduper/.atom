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
      this.classList.add('popover-list', 'select-list', 'autocomplete-plus', 'autocomplete-suggestion-list');
      this.subscriptions.add(atom.config.observe('autocomplete-plus.maxSuggestions', (function(_this) {
        return function() {
          return _this.maxItems = atom.config.get('autocomplete-plus.maxSuggestions');
        };
      })(this)));
      return this.registerMouseHandling();
    };

    SuggestionListElement.prototype.attachedCallback = function() {
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
      return editorElement.classList.add('autocomplete-active');
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FESixDQUFBOztBQUFBLEVBR007QUFDSiw0Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsb0NBQUEsUUFBQSxHQUFVLEVBQVYsQ0FBQTs7QUFBQSxvQ0FFQSxlQUFBLEdBQWlCLFNBQUEsR0FBQTtBQUNmLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUFqQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsU0FBUyxDQUFDLEdBQVgsQ0FBZSxjQUFmLEVBQStCLGFBQS9CLEVBQThDLG1CQUE5QyxFQUFtRSw4QkFBbkUsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLGtDQUFwQixFQUF3RCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxRQUFELEdBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGtDQUFoQixFQUFmO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEQsQ0FBbkIsQ0FGQSxDQUFBO2FBR0EsSUFBQyxDQUFBLHFCQUFELENBQUEsRUFKZTtJQUFBLENBRmpCLENBQUE7O0FBQUEsb0NBUUEsZ0JBQUEsR0FBa0IsU0FBQSxHQUFBO0FBQ2hCLE1BQUEsSUFBQyxDQUFBLHNCQUFELENBQUEsQ0FBQSxDQUFBO0FBQ0EsTUFBQSxJQUFBLENBQUEsSUFBc0IsQ0FBQSxFQUF0QjtBQUFBLFFBQUEs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
//# sourceURL=/Users/sarah/.atom/packages/autocomplete-plus/lib/suggestion-list-element.coffee