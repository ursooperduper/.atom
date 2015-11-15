(function() {
  var $, FrontMatter, ManageFrontMatterView, TextEditorView, View, config, utils, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require("atom-space-pen-views"), $ = _ref.$, View = _ref.View, TextEditorView = _ref.TextEditorView;

  config = require("../config");

  utils = require("../utils");

  FrontMatter = require("../helpers/front-matter");

  module.exports = ManageFrontMatterView = (function(_super) {
    __extends(ManageFrontMatterView, _super);

    function ManageFrontMatterView() {
      return ManageFrontMatterView.__super__.constructor.apply(this, arguments);
    }

    ManageFrontMatterView.labelName = "Manage Field";

    ManageFrontMatterView.fieldName = "fieldName";

    ManageFrontMatterView.content = function() {
      return this.div({
        "class": "markdown-writer markdown-writer-selection"
      }, (function(_this) {
        return function() {
          _this.label(_this.labelName, {
            "class": "icon icon-book"
          });
          _this.p({
            "class": "error",
            outlet: "error"
          });
          _this.subview("fieldEditor", new TextEditorView({
            mini: true
          }));
          return _this.ul({
            "class": "candidates",
            outlet: "candidates"
          }, function() {
            return _this.li("Loading...");
          });
        };
      })(this));
    };

    ManageFrontMatterView.prototype.initialize = function() {
      this.candidates.on("click", "li", (function(_this) {
        return function(e) {
          return _this.appendFieldItem(e);
        };
      })(this));
      return atom.commands.add(this.element, {
        "core:confirm": (function(_this) {
          return function() {
            return _this.saveFrontMatter();
          };
        })(this),
        "core:cancel": (function(_this) {
          return function() {
            return _this.detach();
          };
        })(this)
      });
    };

    ManageFrontMatterView.prototype.display = function() {
      this.editor = atom.workspace.getActiveTextEditor();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: false
        });
      }
      this.previouslyFocusedElement = $(document.activeElement);
      this.fetchSiteFieldCandidates();
      this.frontMatter = new FrontMatter(this.editor);
      if (this.frontMatter.parseError) {
        return this.detach();
      }
      this.frontMatter.normalizeField(this.constructor.fieldName);
      this.setEditorFieldItems(this.frontMatter.get(this.constructor.fieldName));
      this.panel.show();
      return this.fieldEditor.focus();
    };

    ManageFrontMatterView.prototype.detach = function() {
      var _ref1;
      if (this.panel.isVisible()) {
        this.panel.hide();
        if ((_ref1 = this.previouslyFocusedElement) != null) {
          _ref1.focus();
        }
      }
      return ManageFrontMatterView.__super__.detach.apply(this, arguments);
    };

    ManageFrontMatterView.prototype.saveFrontMatter = function() {
      this.frontMatter.set(this.constructor.fieldName, this.getEditorFieldItems());
      this.frontMatter.save();
      return this.detach();
    };

    ManageFrontMatterView.prototype.setEditorFieldItems = function(fieldItems) {
      return this.fieldEditor.setText(fieldItems.join(","));
    };

    ManageFrontMatterView.prototype.getEditorFieldItems = function() {
      return this.fieldEditor.getText().split(/\s*,\s*/).filter(function(c) {
        return !!c.trim();
      });
    };

    ManageFrontMatterView.prototype.fetchSiteFieldCandidates = function() {};

    ManageFrontMatterView.prototype.displaySiteFieldItems = function(siteFieldItems) {
      var fieldItems, tagElems;
      fieldItems = this.frontMatter.get(this.constructor.fieldName) || [];
      tagElems = siteFieldItems.map(function(tag) {
        if (fieldItems.indexOf(tag) < 0) {
          return "<li>" + tag + "</li>";
        } else {
          return "<li class='selected'>" + tag + "</li>";
        }
      });
      return this.candidates.empty().append(tagElems.join(""));
    };

    ManageFrontMatterView.prototype.appendFieldItem = function(e) {
      var fieldItem, fieldItems, idx;
      fieldItem = e.target.textContent;
      fieldItems = this.getEditorFieldItems();
      idx = fieldItems.indexOf(fieldItem);
      if (idx < 0) {
        fieldItems.push(fieldItem);
        e.target.classList.add("selected");
      } else {
        fieldItems.splice(idx, 1);
        e.target.classList.remove("selected");
      }
      this.setEditorFieldItems(fieldItems);
      return this.fieldEditor.focus();
    };

    return ManageFrontMatterView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvdmlld3MvbWFuYWdlLWZyb250LW1hdHRlci12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnRkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBNEIsT0FBQSxDQUFRLHNCQUFSLENBQTVCLEVBQUMsU0FBQSxDQUFELEVBQUksWUFBQSxJQUFKLEVBQVUsc0JBQUEsY0FBVixDQUFBOztBQUFBLEVBRUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxXQUFSLENBRlQsQ0FBQTs7QUFBQSxFQUdBLEtBQUEsR0FBUSxPQUFBLENBQVEsVUFBUixDQUhSLENBQUE7O0FBQUEsRUFJQSxXQUFBLEdBQWMsT0FBQSxDQUFRLHlCQUFSLENBSmQsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiw0Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxxQkFBQyxDQUFBLFNBQUQsR0FBWSxjQUFaLENBQUE7O0FBQUEsSUFDQSxxQkFBQyxDQUFBLFNBQUQsR0FBWSxXQURaLENBQUE7O0FBQUEsSUFHQSxxQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sMkNBQVA7T0FBTCxFQUF5RCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3ZELFVBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBTyxLQUFDLENBQUEsU0FBUixFQUFtQjtBQUFBLFlBQUEsT0FBQSxFQUFPLGdCQUFQO1dBQW5CLENBQUEsQ0FBQTtBQUFBLFVBQ0EsS0FBQyxDQUFBLENBQUQsQ0FBRztBQUFBLFlBQUEsT0FBQSxFQUFPLE9BQVA7QUFBQSxZQUFnQixNQUFBLEVB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

//# sourceURL=/Users/sarah/.atom/packages/markdown-writer/lib/views/manage-front-matter-view.coffee
