(function() {
  var $, FrontMatter, PublishDraft, config, fs, path, shell, utils;

  $ = require("atom-space-pen-views").$;

  fs = require("fs-plus");

  path = require("path");

  shell = require("shell");

  config = require("../config");

  utils = require("../utils");

  FrontMatter = require("../helpers/front-matter");

  module.exports = PublishDraft = (function() {
    function PublishDraft() {
      this.editor = atom.workspace.getActiveTextEditor();
      this.frontMatter = new FrontMatter(this.editor);
    }

    PublishDraft.prototype.trigger = function(e) {
      this.updateFrontMatter();
      this.draftPath = this.editor.getPath();
      this.postPath = this.getPostPath();
      return this.confirmPublish((function(_this) {
        return function() {
          var error;
          try {
            _this.editor.saveAs(_this.postPath);
            if (_this.draftPath) {
              return shell.moveItemToTrash(_this.draftPath);
            }
          } catch (_error) {
            error = _error;
            return atom.confirm({
              message: "[Markdown Writer] Error!",
              detailedMessage: "Publish Draft:\n" + error.message,
              buttons: ['OK']
            });
          }
        };
      })(this));
    };

    PublishDraft.prototype.confirmPublish = function(callback) {
      if (fs.existsSync(this.postPath)) {
        return atom.confirm({
          message: "Do you want to overwrite file?",
          detailedMessage: "Another file already exists at:\n" + this.postPath,
          buttons: {
            "Confirm": callback,
            "Cancel": null
          }
        });
      } else if (this.draftPath === this.postPath) {
        return atom.confirm({
          message: "This file is published!",
          detailedMessage: "This file already published at:\n" + this.draftPath,
          buttons: ['OK']
        });
      } else {
        return callback();
      }
    };

    PublishDraft.prototype.updateFrontMatter = function() {
      if (this.frontMatter.isEmpty) {
        return;
      }
      this.frontMatter.setIfExists("published", true);
      this.frontMatter.setIfExists("date", "" + (utils.getDateStr()) + " " + (utils.getTimeStr()));
      return this.frontMatter.save();
    };

    PublishDraft.prototype.getPostPath = function() {
      var localDir, postsDir;
      localDir = config.get("siteLocalDir");
      postsDir = utils.dirTemplate(config.get("sitePostsDir"));
      return path.join(localDir, postsDir, this._getPostName());
    };

    PublishDraft.prototype._getPostName = function() {
      var date, info, template;
      template = config.get("newPostFileName");
      date = utils.getDate();
      info = {
        title: this._getPostTitle(),
        extension: this._getPostExtension()
      };
      return utils.template(template, $.extend(info, date));
    };

    PublishDraft.prototype._getPostTitle = function() {
      var title, useFrontMatter;
      useFrontMatter = !this.draftPath || !!config.get("publishRenameBasedOnTitle");
      if (useFrontMatter) {
        title = utils.dasherize(this.frontMatter.get("title"));
      }
      return title || utils.getTitleSlug(this.draftPath) || utils.dasherize("New Post");
    };

    PublishDraft.prototype._getPostExtension = function() {
      var extname;
      if (!!config.get("publishKeepFileExtname")) {
        extname = path.extname(this.draftPath);
      }
      return extname || config.get("fileExtension");
    };

    return PublishDraft;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvY29tbWFuZHMvcHVibGlzaC1kcmFmdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNERBQUE7O0FBQUEsRUFBQyxJQUFLLE9BQUEsQ0FBUSxzQkFBUixFQUFMLENBQUQsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSLENBSFIsQ0FBQTs7QUFBQSxFQUtBLE1BQUEsR0FBUyxPQUFBLENBQVEsV0FBUixDQUxULENBQUE7O0FBQUEsRUFNQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFVBQVIsQ0FOUixDQUFBOztBQUFBLEVBT0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSx5QkFBUixDQVBkLENBQUE7O0FBQUEsRUFTQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSxzQkFBQSxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFWLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxXQUFELEdBQW1CLElBQUEsV0FBQSxDQUFZLElBQUMsQ0FBQSxNQUFiLENBRG5CLENBRFc7SUFBQSxDQUFiOztBQUFBLDJCQUlBLE9BQUEsR0FBUyxTQUFDLENBQUQsR0FBQTtBQUNQLE1BQUEsSUFBQyxDQUFBLGlCQUFELENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsU0FBRCxHQUFhLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFBLENBRmIsQ0FBQTtBQUFBLE1BR0EsSUFBQyxD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

//# sourceURL=/Users/sarah/.atom/packages/markdown-writer/lib/commands/publish-draft.coffee
