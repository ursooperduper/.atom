(function() {
  var $, InsertTableView, TextEditorView, View, config, utils, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require("atom-space-pen-views"), $ = _ref.$, View = _ref.View, TextEditorView = _ref.TextEditorView;

  config = require("../config");

  utils = require("../utils");

  module.exports = InsertTableView = (function(_super) {
    __extends(InsertTableView, _super);

    function InsertTableView() {
      return InsertTableView.__super__.constructor.apply(this, arguments);
    }

    InsertTableView.content = function() {
      return this.div({
        "class": "markdown-writer markdown-writer-dialog"
      }, (function(_this) {
        return function() {
          _this.label("Insert Table", {
            "class": "icon icon-diff-added"
          });
          return _this.div(function() {
            _this.label("Rows", {
              "class": "message"
            });
            _this.subview("rowEditor", new TextEditorView({
              mini: true
            }));
            _this.label("Columns", {
              "class": "message"
            });
            return _this.subview("columnEditor", new TextEditorView({
              mini: true
            }));
          });
        };
      })(this));
    };

    InsertTableView.prototype.initialize = function() {
      utils.setTabIndex([this.rowEditor, this.columnEditor]);
      return atom.commands.add(this.element, {
        "core:confirm": (function(_this) {
          return function() {
            return _this.onConfirm();
          };
        })(this),
        "core:cancel": (function(_this) {
          return function() {
            return _this.detach();
          };
        })(this)
      });
    };

    InsertTableView.prototype.onConfirm = function() {
      var col, row;
      row = parseInt(this.rowEditor.getText(), 10);
      col = parseInt(this.columnEditor.getText(), 10);
      if (this.isValidRange(row, col)) {
        this.insertTable(row, col);
      }
      return this.detach();
    };

    InsertTableView.prototype.display = function() {
      this.editor = atom.workspace.getActiveTextEditor();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: false
        });
      }
      this.previouslyFocusedElement = $(document.activeElement);
      this.rowEditor.setText("3");
      this.columnEditor.setText("3");
      this.panel.show();
      return this.rowEditor.focus();
    };

    InsertTableView.prototype.detach = function() {
      var _ref1;
      if (!this.panel.isVisible()) {
        return;
      }
      this.panel.hide();
      if ((_ref1 = this.previouslyFocusedElement) != null) {
        _ref1.focus();
      }
      return InsertTableView.__super__.detach.apply(this, arguments);
    };

    InsertTableView.prototype.insertTable = function(row, col) {
      var cursor;
      cursor = this.editor.getCursorBufferPosition();
      this.editor.insertText(this.createTable(row, col));
      return this.editor.setCursorBufferPosition(cursor);
    };

    InsertTableView.prototype.createTable = function(row, col) {
      var options, table, _i, _ref1;
      options = {
        numOfColumns: col,
        extraPipes: config.get("tableExtraPipes"),
        columnWidth: 1,
        alignment: config.get("tableAlignment")
      };
      table = [];
      table.push(utils.createTableRow([], options));
      table.push(utils.createTableSeparator(options));
      for (_i = 0, _ref1 = row - 2; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; 0 <= _ref1 ? _i++ : _i--) {
        table.push(utils.createTableRow([], options));
      }
      return table.join("\n");
    };

    InsertTableView.prototype.isValidRange = function(row, col) {
      if (isNaN(row) || isNaN(col)) {
        return false;
      }
      if (row < 2 || col < 1) {
        return false;
      }
      return true;
    };

    return InsertTableView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvdmlld3MvaW5zZXJ0LXRhYmxlLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUE0QixPQUFBLENBQVEsc0JBQVIsQ0FBNUIsRUFBQyxTQUFBLENBQUQsRUFBSSxZQUFBLElBQUosRUFBVSxzQkFBQSxjQUFWLENBQUE7O0FBQUEsRUFFQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFdBQVIsQ0FGVCxDQUFBOztBQUFBLEVBR0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxVQUFSLENBSFIsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixzQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxlQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyx3Q0FBUDtPQUFMLEVBQXNELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDcEQsVUFBQSxLQUFDLENBQUEsS0FBRCxDQUFPLGNBQVAsRUFBdUI7QUFBQSxZQUFBLE9BQUEsRUFBTyxzQkFBUDtXQUF2QixDQUFBLENBQUE7aUJBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSyxTQUFBLEdBQUE7QUFDSCxZQUFBLEtBQUMsQ0FBQSxLQUFELENBQU8sTUFBUCxFQUFlO0FBQUEsY0FBQSxPQUFBLEVBQU8sU0FBUDthQUFmLENBQUEsQ0FBQTtBQUFBLFlBQ0EsS0FBQyxDQUFBLE9BQUQsQ0FBUyxXQUFULEVBQTBCLElBQUEsY0FBQSxDQUFlO0FBQUEsY0FBQSxJQUFBLEVBQU0sSUFBTjthQUFmLENBQTFCLENBREEsQ0FBQTtBQUFB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

//# sourceURL=/Users/sarah/.atom/packages/markdown-writer/lib/views/insert-table-view.coffee
