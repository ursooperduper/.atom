(function() {
  var $, JekyllNewPostView, TextEditorView, View, fs, os, path, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TextEditorView = require('atom-space-pen-views').TextEditorView;

  path = require('path');

  fs = require('fs-plus');

  os = require('os');

  _ref = require('space-pen'), $ = _ref.$, View = _ref.View;

  module.exports = JekyllNewPostView = (function(_super) {
    __extends(JekyllNewPostView, _super);

    function JekyllNewPostView() {
      return JekyllNewPostView.__super__.constructor.apply(this, arguments);
    }

    JekyllNewPostView.content = function() {
      return this.div({
        "class": 'jekyll-new-post overlay from-top'
      }, (function(_this) {
        return function() {
          _this.label("Post Title", {
            "class": 'icon icon-file-add',
            outlet: 'promptText'
          });
          _this.subview('miniEditor', new TextEditorView({
            mini: true
          }));
          _this.label("Draft");
          _this.input({
            type: 'checkbox',
            outlet: 'draftCheckbox'
          });
          _this.button({
            outlet: 'createButton'
          }, 'Create');
          return _this.div({
            "class": 'error-message',
            outlet: 'errorMessage'
          });
        };
      })(this));
    };

    JekyllNewPostView.prototype.initialize = function() {
      atom.commands.add(this.element, {
        'core:confirm': (function(_this) {
          return function() {
            return _this.onConfirm(_this.miniEditor.getText());
          };
        })(this),
        'core:cancel': (function(_this) {
          return function() {
            return _this.destroy();
          };
        })(this)
      });
      return this.createButton.on('click', (function(_this) {
        return function() {
          return _this.onConfirm(_this.miniEditor.getText());
        };
      })(this));
    };

    JekyllNewPostView.prototype.serialize = function() {};

    JekyllNewPostView.prototype.attach = function() {
      return this.panel = atom.workspace.addModalPanel({
        item: this
      });
    };

    JekyllNewPostView.prototype.destroy = function() {
      this.panel.destroy();
      return atom.workspace.getActivePane().activate();
    };

    JekyllNewPostView.prototype.toggle = function() {
      if (this.hasParent()) {
        return this.detach();
      } else {
        atom.workspaceView.append(this);
        return this.miniEditor.focus();
      }
    };

    JekyllNewPostView.prototype.showError = function(error) {
      this.errorMessage.text(error);
      if (error) {
        return this.flashError();
      }
    };

    JekyllNewPostView.prototype.generateFileName = function(title, draft) {
      var titleName;
      titleName = title.toLowerCase().replace(/[^\w\s]|_/g, "").replace(RegExp(" ", 'g'), "-");
      title = titleName;
      if (!draft) {
        title = this.generateDateString() + "-" + titleName;
      }
      return title;
    };

    JekyllNewPostView.prototype.generateDateString = function(currentTime) {
      if (currentTime == null) {
        currentTime = new Date();
      }
      return currentTime.getFullYear() + "-" + ("0" + (currentTime.getMonth() + 1)).slice(-2) + "-" + ("0" + currentTime.getDate()).slice(-2);
    };

    JekyllNewPostView.prototype.onConfirm = function(title) {
      var draft, endsWithDirectorySeparator, error, fileName, pathToCreate, relativePath, _ref1;
      draft = !!this.draftCheckbox.prop('checked');
      fileName = this.generateFileName(title, draft);
      if (draft) {
        relativePath = atom.config.get('jekyll.draftsDir') + fileName + atom.config.get('jekyll.postsType');
      } else {
        relativePath = atom.config.get('jekyll.postsDir') + fileName + atom.config.get('jekyll.postsType');
      }
      endsWithDirectorySeparator = /\/$/.test(relativePath);
      pathToCreate = (_ref1 = atom.project.getDirectories()[0]) != null ? _ref1.resolve(relativePath) : void 0;
      if (!pathToCreate) {
        return;
      }
      try {
        if (fs.existsSync(pathToCreate)) {
          return this.showError("'" + pathToCreate + "' already exists.");
        } else {
          if (endsWithDirectorySeparator) {
            return this.showError("File names must not end with a '/' character.");
          } else {
            fs.writeFileSync(pathToCreate, this.fileContents(title, this.generateDateString()));
            atom.workspace.open(pathToCreate);
            return this.destroy();
          }
        }
      } catch (_error) {
        error = _error;
        return this.showError("" + error.message + ".");
      }
    };

    JekyllNewPostView.prototype.fileContents = function(title, dateString) {
      return ['---', 'layout: post', "title: \"" + title + "\"", "date: \"" + dateString + "\"", '---'].join(os.EOL);
    };

    return JekyllNewPostView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2pla3lsbC9saWIvbmV3LXBvc3Qtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsOERBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLGlCQUFrQixPQUFBLENBQVEsc0JBQVIsRUFBbEIsY0FBRCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUZMLENBQUE7O0FBQUEsRUFHQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FITCxDQUFBOztBQUFBLEVBS0EsT0FBWSxPQUFBLENBQVEsV0FBUixDQUFaLEVBQUMsU0FBQSxDQUFELEVBQUksWUFBQSxJQUxKLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osd0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsaUJBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLGtDQUFQO09BQUwsRUFBZ0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUM5QyxVQUFBLEtBQUMsQ0FBQSxLQUFELENBQU8sWUFBUCxFQUFxQjtBQUFBLFlBQUEsT0FBQSxFQUFPLG9CQUFQO0FBQUEsWUFBNkIsTUFBQSxFQUFRLFlBQXJDO1dBQXJCLENBQUEsQ0FBQTtBQUFBLFVBQ0EsS0FBQyxDQUFBLE9BQUQsQ0FBUyxZQUFULEVBQTJCLElBQUEsY0FBQSxDQUFlO0FBQUEsWUFBQSxJQUFBLEVBQU0sSUFBTjtXQUFmLENBQTNCLENBREEsQ0FBQTtBQUFBLFVBRUEsS0FBQyxDQUFBLEtBQUQsQ0FBTyxPQUFQ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

//# sourceURL=/Users/sarah/.atom/packages/jekyll/lib/new-post-view.coffee
