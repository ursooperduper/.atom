(function() {
  var $, Point, Tabularize, TabularizeView, TextEditorView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Tabularize = require('./tabularize');

  Point = require('atom').Point;

  _ref = require('atom-space-pen-views'), $ = _ref.$, TextEditorView = _ref.TextEditorView, View = _ref.View;

  module.exports = TabularizeView = (function(_super) {
    __extends(TabularizeView, _super);

    function TabularizeView() {
      return TabularizeView.__super__.constructor.apply(this, arguments);
    }

    TabularizeView.activate = function() {
      return new TabularizeView;
    };

    TabularizeView.content = function() {
      return this.div({
        "class": 'tabularize overlay from-top mini'
      }, (function(_this) {
        return function() {
          _this.subview('miniEditor', new TextEditorView({
            mini: true
          }));
          _this.div({
            "class": 'message',
            outlet: 'message'
          });
          return _this.div({
            "class": 'block'
          }, function() {
            return _this.div({
              "class": 'btn-group centered'
            }, function() {
              _this.button({
                "class": 'btn selected'
              }, 'Left');
              _this.button({
                "class": 'btn disabled'
              }, 'Center');
              return _this.button({
                "class": 'btn disabled'
              }, 'Right');
            });
          });
        };
      })(this));
    };

    TabularizeView.prototype.detaching = false;

    TabularizeView.prototype.initialize = function() {
      this.panel = atom.workspace.addModalPanel({
        item: this,
        visible: false
      });
      atom.commands.add('atom-text-editor', 'tabularize:toggle', (function(_this) {
        return function() {
          _this.toggle();
          return false;
        };
      })(this));
      this.miniEditor.on('blur', (function(_this) {
        return function() {
          return _this.close();
        };
      })(this));
      atom.commands.add(this.miniEditor.element, 'core:confirm', (function(_this) {
        return function() {
          return _this.confirm();
        };
      })(this));
      return atom.commands.add(this.miniEditor.element, 'core:cancel', (function(_this) {
        return function() {
          return _this.close();
        };
      })(this));
    };

    TabularizeView.prototype.toggle = function() {
      if (this.panel.isVisible()) {
        return this.close();
      } else {
        return this.open();
      }
    };

    TabularizeView.prototype.close = function() {
      var miniEditorFocused;
      if (!this.panel.isVisible()) {
        return;
      }
      miniEditorFocused = this.miniEditor.hasFocus();
      this.miniEditor.setText('');
      this.panel.hide();
      if (miniEditorFocused) {
        return this.restoreFocus();
      }
    };

    TabularizeView.prototype.confirm = function() {
      var editor, regex;
      regex = this.miniEditor.getText();
      editor = atom.workspace.getActiveTextEditor();
      this.close();
      if (!(editor && regex.length)) {
        return;
      }
      return Tabularize.tabularize(regex, editor);
    };

    TabularizeView.prototype.storeFocusedElement = function() {
      return this.previouslyFocusedElement = $(':focus');
    };

    TabularizeView.prototype.restoreFocus = function() {
      var _ref1;
      if ((_ref1 = this.previouslyFocusedElement) != null ? _ref1.isOnDom() : void 0) {
        return this.previouslyFocusedElement.focus();
      } else {
        return atom.views.getView(atom.workspace).focus();
      }
    };

    TabularizeView.prototype.open = function() {
      var editor;
      if (this.panel.isVisible()) {
        return;
      }
      if (editor = atom.workspace.getActiveTextEditor()) {
        this.storeFocusedElement();
        this.panel.show();
        this.message.text("Use a regex to select the separator");
        return this.miniEditor.focus();
      }
    };

    return TabularizeView;

  })(View);

}).call(this);
