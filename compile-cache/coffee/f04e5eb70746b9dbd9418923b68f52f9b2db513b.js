(function() {
  var $, NewFileView, TextEditorView, View, config, fs, path, utils, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require("atom-space-pen-views"), $ = _ref.$, View = _ref.View, TextEditorView = _ref.TextEditorView;

  path = require("path");

  fs = require("fs-plus");

  config = require("../config");

  utils = require("../utils");

  module.exports = NewFileView = (function(_super) {
    __extends(NewFileView, _super);

    function NewFileView() {
      return NewFileView.__super__.constructor.apply(this, arguments);
    }

    NewFileView.fileType = "File";

    NewFileView.pathConfig = "siteFilesDir";

    NewFileView.fileNameConfig = "newFileFileName";

    NewFileView.content = function() {
      return this.div({
        "class": "markdown-writer"
      }, (function(_this) {
        return function() {
          _this.label("Add New " + _this.fileType, {
            "class": "icon icon-file-add"
          });
          _this.div(function() {
            _this.label("Directory", {
              "class": "message"
            });
            _this.subview("pathEditor", new TextEditorView({
              mini: true
            }));
            _this.label("Date", {
              "class": "message"
            });
            _this.subview("dateEditor", new TextEditorView({
              mini: true
            }));
            _this.label("Title", {
              "class": "message"
            });
            return _this.subview("titleEditor", new TextEditorView({
              mini: true
            }));
          });
          _this.p({
            "class": "message",
            outlet: "message"
          });
          return _this.p({
            "class": "error",
            outlet: "error"
          });
        };
      })(this));
    };

    NewFileView.prototype.initialize = function() {
      utils.setTabIndex([this.titleEditor, this.pathEditor, this.dateEditor]);
      this.pathEditor.getModel().onDidChange((function(_this) {
        return function() {
          return _this.updatePath();
        };
      })(this));
      this.dateEditor.getModel().onDidChange((function(_this) {
        return function() {
          return _this.updatePath();
        };
      })(this));
      this.titleEditor.getModel().onDidChange((function(_this) {
        return function() {
          return _this.updatePath();
        };
      })(this));
      return atom.commands.add(this.element, {
        "core:confirm": (function(_this) {
          return function() {
            return _this.createPost();
          };
        })(this),
        "core:cancel": (function(_this) {
          return function() {
            return _this.detach();
          };
        })(this)
      });
    };

    NewFileView.prototype.display = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: false
        });
      }
      this.previouslyFocusedElement = $(document.activeElement);
      this.dateEditor.setText(utils.getDateStr());
      this.pathEditor.setText(utils.dirTemplate(config.get(this.constructor.pathConfig)));
      this.panel.show();
      return this.titleEditor.focus();
    };

    NewFileView.prototype.detach = function() {
      var _ref1;
      if (this.panel.isVisible()) {
        this.panel.hide();
        if ((_ref1 = this.previouslyFocusedElement) != null) {
          _ref1.focus();
        }
      }
      return NewFileView.__super__.detach.apply(this, arguments);
    };

    NewFileView.prototype.createPost = function() {
      var error, post;
      try {
        post = this.getFullPath();
        if (fs.existsSync(post)) {
          return this.error.text("File " + (this.getFullPath()) + " already exists!");
        } else {
          fs.writeFileSync(post, this.generateFrontMatter(this.getFrontMatter()));
          atom.workspace.open(post);
          return this.detach();
        }
      } catch (_error) {
        error = _error;
        return this.error.text("" + error.message);
      }
    };

    NewFileView.prototype.updatePath = function() {
      return this.message.html("<b>Site Directory:</b> " + (config.get('siteLocalDir')) + "/<br/>\n<b>Create " + this.constructor.fileType + " At:</b> " + (this.getPostPath()));
    };

    NewFileView.prototype.getFullPath = function() {
      return path.join(config.get("siteLocalDir"), this.getPostPath());
    };

    NewFileView.prototype.getPostPath = function() {
      return path.join(this.pathEditor.getText(), this.getFileName());
    };

    NewFileView.prototype.getFileName = function() {
      var info, template;
      template = config.get(this.constructor.fileNameConfig);
      info = {
        title: utils.dasherize(this.getTitle()),
        extension: config.get("fileExtension")
      };
      return utils.template(template, $.extend(info, this.getDate()));
    };

    NewFileView.prototype.getTitle = function() {
      return this.titleEditor.getText() || ("New " + this.constructor.fileType);
    };

    NewFileView.prototype.getDate = function() {
      return utils.parseDateStr(this.dateEditor.getText());
    };

    NewFileView.prototype.getPublished = function() {
      return this.constructor.fileType === 'Post';
    };

    NewFileView.prototype.generateFrontMatter = function(data) {
      return utils.template(config.get("frontMatter"), data);
    };

    NewFileView.prototype.getFrontMatter = function() {
      return {
        layout: "post",
        published: this.getPublished(),
        title: this.getTitle(),
        slug: utils.dasherize(this.getTitle()),
        date: "" + (this.dateEditor.getText()) + " " + (utils.getTimeStr()),
        dateTime: this.getDate()
      };
    };

    return NewFileView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvdmlld3MvbmV3LWZpbGUtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUVBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQTRCLE9BQUEsQ0FBUSxzQkFBUixDQUE1QixFQUFDLFNBQUEsQ0FBRCxFQUFJLFlBQUEsSUFBSixFQUFVLHNCQUFBLGNBQVYsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FGTCxDQUFBOztBQUFBLEVBSUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxXQUFSLENBSlQsQ0FBQTs7QUFBQSxFQUtBLEtBQUEsR0FBUSxPQUFBLENBQVEsVUFBUixDQUxSLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osa0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsV0FBQyxDQUFBLFFBQUQsR0FBWSxNQUFaLENBQUE7O0FBQUEsSUFDQSxXQUFDLENBQUEsVUFBRCxHQUFjLGNBRGQsQ0FBQTs7QUFBQSxJQUVBLFdBQUMsQ0FBQSxjQUFELEdBQWtCLGlCQUZsQixDQUFBOztBQUFBLElBSUEsV0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8saUJBQVA7T0FBTCxFQUErQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQzdCLFVBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBUSxVQUFBLEdBQVUsS0FBQyxDQUFBLFFBQW5CLEVBQStCO0FBQUEsWUFBQSxPQUFBLEVBQU8sb0JBQVA7V0FB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

//# sourceURL=/Users/sarah/.atom/packages/markdown-writer/lib/views/new-file-view.coffee
