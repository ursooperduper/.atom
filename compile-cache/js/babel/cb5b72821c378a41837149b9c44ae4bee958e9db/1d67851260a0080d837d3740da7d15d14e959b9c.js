Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _messageElement = require('./message-element');

'use babel';

var BottomPanel = (function () {
  function BottomPanel(scope) {
    var _this = this;

    _classCallCheck(this, BottomPanel);

    this.subscriptions = new _atom.CompositeDisposable();
    this.element = document.createElement('linter-panel'); // TODO(steelbrain): Make this a `div`
    this.panel = atom.workspace.addBottomPanel({ item: this.element, visible: false, priority: 500 });
    this.visibility = false;
    this.scope = scope;
    this.messages = new Map();

    this.subscriptions.add(atom.config.observe('linter.showErrorPanel', function (value) {
      _this.configVisibility = value;
      _this.setVisibility(true);
    }));
    this.subscriptions.add(atom.workspace.observeActivePaneItem(function (paneItem) {
      _this.paneVisibility = paneItem === atom.workspace.getActiveTextEditor();
      _this.setVisibility(true);
    }));
  }

  _createClass(BottomPanel, [{
    key: 'refresh',
    value: function refresh(scope) {
      this.scope = scope;
      for (var message of this.messages) {
        message[1].updateVisibility(scope);
      }
    }
  }, {
    key: 'setMessages',
    value: function setMessages(_ref) {
      var added = _ref.added;
      var removed = _ref.removed;

      if (removed.length) this.removeMessages(removed);
      for (var message of added) {
        var messageElement = _messageElement.Message.fromMessage(message, this.scope);
        this.messages.set(message, messageElement);
        this.element.appendChild(messageElement);
      }
    }
  }, {
    key: 'removeMessages',
    value: function removeMessages(removed) {
      for (var message of removed) {
        if (this.messages.has(message)) {
          this.element.removeChild(this.messages.get(message));
          this.messages['delete'](message);
        }
      }
    }
  }, {
    key: 'getVisibility',
    value: function getVisibility() {
      return this.visibility;
    }
  }, {
    key: 'setVisibility',
    value: function setVisibility(value) {
      this.visibility = value && this.configVisibility && this.paneVisibility;
      if (this.visibility) {
        this.panel.show();
      } else {
        this.panel.hide();
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      this.messages.clear();
      this.panel.destroy();
    }
  }]);

  return BottomPanel;
})();

exports.BottomPanel = BottomPanel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYXJhaC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3VpL2JvdHRvbS1wYW5lbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztvQkFFa0MsTUFBTTs7OEJBQ2xCLG1CQUFtQjs7QUFIekMsV0FBVyxDQUFBOztJQUtFLFdBQVc7QUFDWCxXQURBLFdBQVcsQ0FDVixLQUFLLEVBQUU7OzswQkFEUixXQUFXOztBQUVwQixRQUFJLENBQUMsYUFBYSxHQUFHLFVBTGpCLG1CQUFtQixFQUtxQixDQUFBO0FBQzVDLFFBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUNyRCxRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQTtBQUMvRixRQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQTtBQUN2QixRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtBQUNsQixRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7O0FBRXpCLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHVCQUF1QixFQUFFLFVBQUEsS0FBSyxFQUFJO0FBQzNFLFlBQUssZ0JBQWdCLEdBQUcsS0FBSyxDQUFBO0FBQzdCLFlBQUssYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ3pCLENBQUMsQ0FBQyxDQUFBO0FBQ0gsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxVQUFBLFFBQVEsRUFBSTtBQUN0RSxZQUFLLGNBQWMsR0FBRyxRQUFRLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO0FBQ3ZFLFlBQUssYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ3pCLENBQUMsQ0FBQyxDQUFBO0dBQ0o7O2VBakJVLFdBQVc7O1dBa0JmLGlCQUFDLEtBQUssRUFBRTtBQUNiLFVBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO0FBQ2xCLFdBQUssSUFBSSxPQUFPLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNqQyxlQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUE7T0FDbkM7S0FDRjs7O1dBQ1UscUJBQUMsSUFBZ0IsRUFBRTtVQUFqQixLQUFLLEdBQU4sSUFBZ0IsQ0FBZixLQUFLO1VBQUUsT0FBTyxHQUFmLElBQWdCLENBQVIsT0FBTzs7QUFDekIsVUFBSSxPQUFPLENBQUMsTUFBTSxFQUNoQixJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQzlCLFdBQUssSUFBSSxPQUFPLElBQUksS0FBSyxFQUFFO0FBQ3pCLFlBQU0sY0FBYyxHQUFHLGdCQTlCckIsT0FBTyxDQThCc0IsV0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDL0QsWUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFBO0FBQzFDLFlBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFBO09BQ3pDO0tBQ0Y7OztXQUNhLHdCQUFDLE9BQU8sRUFBRTtBQUN0QixXQUFLLElBQUksT0FBTyxJQUFJLE9BQU8sRUFBRTtBQUMzQixZQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQzlCLGNBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUE7QUFDcEQsY0FBSSxDQUFDLFFBQVEsVUFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1NBQzlCO09BQ0Y7S0FDRjs7O1dBQ1kseUJBQUc7QUFDZCxhQUFPLElBQUksQ0FBQyxVQUFVLENBQUE7S0FDdkI7OztXQUNZLHVCQUFDLEtBQUssRUFBQztBQUNsQixVQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssSUFBSSxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQTtBQUN2RSxVQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDbkIsWUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQTtPQUNsQixNQUFNO0FBQ0wsWUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQTtPQUNsQjtLQUNGOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDNUIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUNyQixVQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQ3JCOzs7U0F4RFUsV0FBVyIsImZpbGUiOiIvVXNlcnMvc2FyYWgvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi91aS9ib3R0b20tcGFuZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5pbXBvcnQge01lc3NhZ2V9IGZyb20gJy4vbWVzc2FnZS1lbGVtZW50J1xuXG5leHBvcnQgY2xhc3MgQm90dG9tUGFuZWwge1xuICBjb25zdHJ1Y3RvcihzY29wZSkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGludGVyLXBhbmVsJykgLy8gVE9ETyhzdGVlbGJyYWluKTogTWFrZSB0aGlzIGEgYGRpdmBcbiAgICB0aGlzLnBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkQm90dG9tUGFuZWwoe2l0ZW06IHRoaXMuZWxlbWVudCwgdmlzaWJsZTogZmFsc2UsIHByaW9yaXR5OiA1MDB9KVxuICAgIHRoaXMudmlzaWJpbGl0eSA9IGZhbHNlXG4gICAgdGhpcy5zY29wZSA9IHNjb3BlXG4gICAgdGhpcy5tZXNzYWdlcyA9IG5ldyBNYXAoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXIuc2hvd0Vycm9yUGFuZWwnLCB2YWx1ZSA9PiB7XG4gICAgICB0aGlzLmNvbmZpZ1Zpc2liaWxpdHkgPSB2YWx1ZVxuICAgICAgdGhpcy5zZXRWaXNpYmlsaXR5KHRydWUpXG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vYnNlcnZlQWN0aXZlUGFuZUl0ZW0ocGFuZUl0ZW0gPT4ge1xuICAgICAgdGhpcy5wYW5lVmlzaWJpbGl0eSA9IHBhbmVJdGVtID09PSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIHRoaXMuc2V0VmlzaWJpbGl0eSh0cnVlKVxuICAgIH0pKVxuICB9XG4gIHJlZnJlc2goc2NvcGUpIHtcbiAgICB0aGlzLnNjb3BlID0gc2NvcGVcbiAgICBmb3IgKGxldCBtZXNzYWdlIG9mIHRoaXMubWVzc2FnZXMpIHtcbiAgICAgIG1lc3NhZ2VbMV0udXBkYXRlVmlzaWJpbGl0eShzY29wZSlcbiAgICB9XG4gIH1cbiAgc2V0TWVzc2FnZXMoe2FkZGVkLCByZW1vdmVkfSkge1xuICAgIGlmIChyZW1vdmVkLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTWVzc2FnZXMocmVtb3ZlZClcbiAgICBmb3IgKGxldCBtZXNzYWdlIG9mIGFkZGVkKSB7XG4gICAgICBjb25zdCBtZXNzYWdlRWxlbWVudCA9IE1lc3NhZ2UuZnJvbU1lc3NhZ2UobWVzc2FnZSwgdGhpcy5zY29wZSlcbiAgICAgIHRoaXMubWVzc2FnZXMuc2V0KG1lc3NhZ2UsIG1lc3NhZ2VFbGVtZW50KVxuICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKG1lc3NhZ2VFbGVtZW50KVxuICAgIH1cbiAgfVxuICByZW1vdmVNZXNzYWdlcyhyZW1vdmVkKSB7XG4gICAgZm9yIChsZXQgbWVzc2FnZSBvZiByZW1vdmVkKSB7XG4gICAgICBpZiAodGhpcy5tZXNzYWdlcy5oYXMobWVzc2FnZSkpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMubWVzc2FnZXMuZ2V0KG1lc3NhZ2UpKVxuICAgICAgICB0aGlzLm1lc3NhZ2VzLmRlbGV0ZShtZXNzYWdlKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBnZXRWaXNpYmlsaXR5KCkge1xuICAgIHJldHVybiB0aGlzLnZpc2liaWxpdHlcbiAgfVxuICBzZXRWaXNpYmlsaXR5KHZhbHVlKXtcbiAgICB0aGlzLnZpc2liaWxpdHkgPSB2YWx1ZSAmJiB0aGlzLmNvbmZpZ1Zpc2liaWxpdHkgJiYgdGhpcy5wYW5lVmlzaWJpbGl0eVxuICAgIGlmICh0aGlzLnZpc2liaWxpdHkpIHtcbiAgICAgIHRoaXMucGFuZWwuc2hvdygpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucGFuZWwuaGlkZSgpXG4gICAgfVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIHRoaXMubWVzc2FnZXMuY2xlYXIoKVxuICAgIHRoaXMucGFuZWwuZGVzdHJveSgpXG4gIH1cbn1cbiJdfQ==