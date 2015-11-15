(function() {
  var $, InsertImageView, TextEditorView, View, config, dialog, fs, imageExtensions, lastInsertImageDir, path, remote, utils, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require("atom-space-pen-views"), $ = _ref.$, View = _ref.View, TextEditorView = _ref.TextEditorView;

  path = require("path");

  fs = require("fs-plus");

  remote = require("remote");

  dialog = remote.require("dialog");

  config = require("../config");

  utils = require("../utils");

  imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".ico"];

  lastInsertImageDir = null;

  module.exports = InsertImageView = (function(_super) {
    __extends(InsertImageView, _super);

    function InsertImageView() {
      return InsertImageView.__super__.constructor.apply(this, arguments);
    }

    InsertImageView.content = function() {
      return this.div({
        "class": "markdown-writer markdown-writer-dialog"
      }, (function(_this) {
        return function() {
          _this.label("Insert Image", {
            "class": "icon icon-device-camera"
          });
          _this.div(function() {
            _this.label("Image Path (src)", {
              "class": "message"
            });
            _this.subview("imageEditor", new TextEditorView({
              mini: true
            }));
            _this.div({
              "class": "dialog-row"
            }, function() {
              _this.button("Choose Local Image", {
                outlet: "openImageButton",
                "class": "btn"
              });
              return _this.label({
                outlet: "message",
                "class": "side-label"
              });
            });
            _this.label("Title (alt)", {
              "class": "message"
            });
            _this.subview("titleEditor", new TextEditorView({
              mini: true
            }));
            _this.div({
              "class": "col-1"
            }, function() {
              _this.label("Width (px)", {
                "class": "message"
              });
              return _this.subview("widthEditor", new TextEditorView({
                mini: true
              }));
            });
            _this.div({
              "class": "col-1"
            }, function() {
              _this.label("Height (px)", {
                "class": "message"
              });
              return _this.subview("heightEditor", new TextEditorView({
                mini: true
              }));
            });
            return _this.div({
              "class": "col-2"
            }, function() {
              _this.label("Alignment", {
                "class": "message"
              });
              return _this.subview("alignEditor", new TextEditorView({
                mini: true
              }));
            });
          });
          _this.div({
            outlet: "copyImagePanel",
            "class": "hidden dialog-row"
          }, function() {
            return _this.label({
              "for": "markdown-writer-copy-image-checkbox"
            }, function() {
              _this.input({
                id: "markdown-writer-copy-image-checkbox"
              }, {
                type: "checkbox",
                outlet: "copyImageCheckbox"
              });
              return _this.span("Copy Image to Site Image Directory", {
                "class": "side-label"
              });
            });
          });
          return _this.div({
            "class": "image-container"
          }, function() {
            return _this.img({
              outlet: 'imagePreview'
            });
          });
        };
      })(this));
    };

    InsertImageView.prototype.initialize = function() {
      utils.setTabIndex([this.imageEditor, this.openImageButton, this.titleEditor, this.widthEditor, this.heightEditor, this.alignEditor, this.copyImageCheckbox]);
      this.imageEditor.on("blur", (function(_this) {
        return function() {
          return _this.updateImageSource(_this.imageEditor.getText().trim());
        };
      })(this));
      this.openImageButton.on("click", (function(_this) {
        return function() {
          return _this.openImageDialog();
        };
      })(this));
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

    InsertImageView.prototype.onConfirm = function() {
      var callback, imgUrl;
      imgUrl = this.imageEditor.getText().trim();
      if (!imgUrl) {
        return;
      }
      callback = (function(_this) {
        return function() {
          _this.insertImage();
          return _this.detach();
        };
      })(this);
      if (this.copyImageCheckbox.prop("checked")) {
        return this.copyImage(this.resolveImageUrl(imgUrl), callback);
      } else {
        return callback();
      }
    };

    InsertImageView.prototype.insertImage = function() {
      var img, text;
      img = {
        src: this.generateImageUrl(this.imageEditor.getText().trim()),
        alt: this.titleEditor.getText(),
        width: this.widthEditor.getText(),
        height: this.heightEditor.getText(),
        align: this.alignEditor.getText(),
        slug: utils.getTitleSlug(this.editor.getPath()),
        site: config.get("siteUrl")
      };
      text = img.src ? this.generateImageTag(img) : img.alt;
      return this.editor.setTextInBufferRange(this.range, text);
    };

    InsertImageView.prototype.copyImage = function(file, callback) {
      var destFile, error;
      if (utils.isUrl(file) || !fs.existsSync(file)) {
        return callback();
      }
      try {
        destFile = path.join(config.get("siteLocalDir"), this.imagesDir(), path.basename(file));
        if (fs.existsSync(destFile)) {
          return atom.confirm({
            message: "File already exists!",
            detailedMessage: "Another file already exists at:\n" + destPath,
            buttons: ['OK']
          });
        } else {
          return fs.copy(file, destFile, (function(_this) {
            return function() {
              _this.imageEditor.setText(destFile);
              return callback();
            };
          })(this));
        }
      } catch (_error) {
        error = _error;
        return atom.confirm({
          message: "[Markdown Writer] Error!",
          detailedMessage: "Copy Image:\n" + error.message,
          buttons: ['OK']
        });
      }
    };

    InsertImageView.prototype.display = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: false
        });
      }
      this.previouslyFocusedElement = $(document.activeElement);
      this.editor = atom.workspace.getActiveTextEditor();
      this.setFieldsFromSelection();
      this.panel.show();
      return this.imageEditor.focus();
    };

    InsertImageView.prototype.detach = function() {
      var _ref1;
      if (!this.panel.isVisible()) {
        return;
      }
      this.panel.hide();
      if ((_ref1 = this.previouslyFocusedElement) != null) {
        _ref1.focus();
      }
      return InsertImageView.__super__.detach.apply(this, arguments);
    };

    InsertImageView.prototype.setFieldsFromSelection = function() {
      var selection;
      this.range = utils.getTextBufferRange(this.editor, "link");
      selection = this.editor.getTextInRange(this.range);
      if (selection) {
        return this._setFieldsFromSelection(selection);
      }
    };

    InsertImageView.prototype._setFieldsFromSelection = function(selection) {
      var img;
      if (utils.isImage(selection)) {
        img = utils.parseImage(selection);
      } else if (utils.isImageTag(selection)) {
        img = utils.parseImageTag(selection);
      } else {
        img = {
          alt: selection
        };
      }
      this.titleEditor.setText(img.alt || "");
      this.widthEditor.setText(img.width || "");
      this.heightEditor.setText(img.height || "");
      this.imageEditor.setText(img.src || "");
      return this.updateImageSource(img.src);
    };

    InsertImageView.prototype.openImageDialog = function() {
      var files;
      files = dialog.showOpenDialog({
        properties: ['openFile'],
        defaultPath: lastInsertImageDir || atom.project.getPaths()[0]
      });
      if (!files) {
        return;
      }
      lastInsertImageDir = path.dirname(files[0]);
      this.imageEditor.setText(files[0]);
      this.updateImageSource(files[0]);
      return this.titleEditor.focus();
    };

    InsertImageView.prototype.updateImageSource = function(file) {
      if (!file) {
        return;
      }
      this.displayImagePreview(file);
      if (utils.isUrl(file) || this.isInSiteDir(this.resolveImageUrl(file))) {
        return this.copyImagePanel.addClass("hidden");
      } else {
        return this.copyImagePanel.removeClass("hidden");
      }
    };

    InsertImageView.prototype.displayImagePreview = function(file) {
      if (this.imageOnPreview === file) {
        return;
      }
      if (this.isValidImageFile(file)) {
        this.message.text("Opening Image Preview ...");
        this.imagePreview.attr("src", this.resolveImageUrl(file));
        this.imagePreview.load((function(_this) {
          return function() {
            _this.setImageContext();
            return _this.message.text("");
          };
        })(this));
        this.imagePreview.error((function(_this) {
          return function() {
            _this.message.text("Error: Failed to Load Image.");
            return _this.imagePreview.attr("src", "");
          };
        })(this));
      } else {
        if (file) {
          this.message.text("Error: Invalid Image File.");
        }
        this.imagePreview.attr("src", "");
        this.widthEditor.setText("");
        this.heightEditor.setText("");
        this.alignEditor.setText("");
      }
      return this.imageOnPreview = file;
    };

    InsertImageView.prototype.isValidImageFile = function(file) {
      var _ref1;
      return file && (_ref1 = path.extname(file).toLowerCase(), __indexOf.call(imageExtensions, _ref1) >= 0);
    };

    InsertImageView.prototype.setImageContext = function() {
      var naturalHeight, naturalWidth, position, _ref1;
      _ref1 = this.imagePreview.context, naturalWidth = _ref1.naturalWidth, naturalHeight = _ref1.naturalHeight;
      this.widthEditor.setText("" + naturalWidth);
      this.heightEditor.setText("" + naturalHeight);
      position = naturalWidth > 300 ? "center" : "right";
      return this.alignEditor.setText(position);
    };

    InsertImageView.prototype.isInSiteDir = function(file) {
      return file && file.startsWith(config.get("siteLocalDir"));
    };

    InsertImageView.prototype.imagesDir = function() {
      return utils.dirTemplate(config.get("siteImagesDir"));
    };

    InsertImageView.prototype.resolveImageUrl = function(file) {
      if (!file) {
        return "";
      }
      if (utils.isUrl(file) || fs.existsSync(file)) {
        return file;
      }
      return path.join(config.get("siteLocalDir"), file);
    };

    InsertImageView.prototype.generateImageUrl = function(file) {
      var filePath;
      if (!file) {
        return "";
      }
      if (utils.isUrl(file)) {
        return file;
      }
      if (this.isInSiteDir(file)) {
        filePath = path.relative(config.get("siteLocalDir"), file);
      } else {
        filePath = path.join(this.imagesDir(), path.basename(file));
      }
      return path.join("/", filePath);
    };

    InsertImageView.prototype.generateImageTag = function(data) {
      return utils.template(config.get("imageTag"), data);
    };

    return InsertImageView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvdmlld3MvaW5zZXJ0LWltYWdlLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRIQUFBO0lBQUE7O3lKQUFBOztBQUFBLEVBQUEsT0FBNEIsT0FBQSxDQUFRLHNCQUFSLENBQTVCLEVBQUMsU0FBQSxDQUFELEVBQUksWUFBQSxJQUFKLEVBQVUsc0JBQUEsY0FBVixDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUZMLENBQUE7O0FBQUEsRUFHQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVIsQ0FIVCxDQUFBOztBQUFBLEVBSUEsTUFBQSxHQUFTLE1BQU0sQ0FBQyxPQUFQLENBQWUsUUFBZixDQUpULENBQUE7O0FBQUEsRUFNQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFdBQVIsQ0FOVCxDQUFBOztBQUFBLEVBT0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxVQUFSLENBUFIsQ0FBQTs7QUFBQSxFQVNBLGVBQUEsR0FBa0IsQ0FBQyxNQUFELEVBQVMsT0FBVCxFQUFrQixNQUFsQixFQUEwQixNQUExQixFQUFrQyxNQUFsQyxDQVRsQixDQUFBOztBQUFBLEVBVUEsa0JBQUEsR0FBcUIsSUFWckIsQ0FBQTs7QUFBQSxFQVlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixzQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxlQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyx3Q0FBUDtPQUFMLEVBQXNELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDcEQsVUFBQSxLQUFDLENBQUEsS0FBRCxDQUFPLGNBQVAsRUFBdUI7QUFBQSxZQUFBLE9BQUEsRUFBTyx5QkFBUDtXQUF2QixDQUFBLENBQUE7QUFBQSxVQUNBLEtBQUMsQ0FBQSxHQUFELENBQUssU0FBQSxHQUFBO0FBQ0gsWUFBQSxLQUFDLENBQUEsS0FBRCxDQUFPLGtCQUFQLEVBQTJCO0FBQUEsY0FBQSxPQUFBLEVBQU8sU0FBUDthQUEzQixDQUFBLENBQUE7QUFBQSxZQUNBLEtBQUMsQ0FBQSxPQUFELENBQVMsYUFBVCxFQUE0QixJQUFBLGNBQUEsQ0FBZTtBQUFBLGNBQUEsSUFBQSxFQUFNLElBQU47YUFBZixDQUE1QixDQURBLENBQUE7QUFBQSxZQUVBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxZQUFQO2FBQUwsRUFBMEIsU0FBQSxHQUFBO0FBQ3hCLGNBQUEsS0FBQyxDQUFBLE1BQUQsQ0FBUSxvQkFBUixFQUE4QjtBQUFBLGdCQUFBLE1BQUEsRUFBUSxpQkFBUjtBQUFBLGdCQUEyQixPQUFBLEVBQU8sS0FBbEM7ZUFBOUIsQ0FBQSxDQUFBO3FCQUNBLEtBQUMsQ0FBQSxLQUFELENBQU87QUFBQSxnQkFBQSxNQUFBLEVBQVEsU0FBUjtBQUFBLGdCQUFtQixPQUFBLEVBQU8sWUFBMUI7ZUFBUCxFQUZ3QjtZQUFBLENBQTFCLENBRkEsQ0FBQTtBQUFBLFlBS0EsS0FBQyxDQUFBLEtBQUQsQ0FBTyxhQUFQLEVBQXNCO0FBQUEsY0FBQSxPQUFBLEVBQU8sU0FBUDthQUF0QixDQUxBLENBQUE7QUFBQSxZQU1BLEtBQUMsQ0FBQSxPQUFELENBQVMsYUFBVCxFQUE0QixJQUFBLGNBQUEsQ0FBZTtBQUFBLGNBQUEsSUFBQSxFQUFNLElBQU47YUFBZixDQUE1QixDQU5BLENBQUE7QUFBQSxZQU9BLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxPQUFQO2FBQUwsRUFBcUIsU0FBQSxHQUFBO0FBQ25CLGNBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBTyxZQUFQLEVBQXFCO0FBQUEsZ0JBQUEsT0FBQSxFQUFPLFNBQVA7ZUFBckIsQ0FBQSxDQUFBO3FCQUNBLEtBQUMsQ0FBQSxPQUFELENBQVMsYUFBVCxFQUE0QixJQUFBLGNBQUEsQ0FBZTtBQUFBLGdCQUFBLElBQUEsRUFBTSxJQUFOO2VBQWYsQ0FBNUIsRUFGbUI7WUFBQSxDQUFyQixDQVBBLENBQUE7QUFBQSxZQVVBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxPQUFQO2FBQUwsRUFBcUIsU0FBQSxHQUFBO0FBQ25CLGNBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBTyxhQUFQLEVBQXNCO0FBQUEsZ0JBQUEsT0FBQSxFQUFPLFNBQVA7ZUFBdEIsQ0FBQSxDQUFBO3FCQUNBLEtBQUMsQ0FBQSxPQUFELENBQVMsY0FBVCxFQUE2QixJQUFBLGNBQUEsQ0FBZTtBQUFBLGdCQUFBLElBQUEsRUFBTSxJQUFOO2VBQWYsQ0FBN0IsRUFGbUI7WUFBQSxDQUFyQixDQVZBLENBQUE7bUJBYUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLE9BQVA7YUFBTCxFQUFxQixTQUFBLEdBQUE7QUFDbkIsY0FBQSxLQUFDLENBQUEsS0FBRCxDQUFPLFdBQVAsRUFBb0I7QUFBQSxnQkFBQSxPQUFBLEVBQU8sU0FBUDtlQUFwQixDQUFBLENBQUE7cUJBQ0EsS0FBQyxDQUFBLE9BQUQsQ0FBUyxhQUFULEVBQTRCLElBQUEsY0FBQSxDQUFlO0FBQUEsZ0JBQUEsSUFBQSxFQUFNLElBQU47ZUFBZixDQUE1QixFQUZtQjtZQUFBLENBQXJCLEVBZEc7VUFBQSxDQUFMLENBREEsQ0FBQTtBQUFBLFVBa0JBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE1BQUEsRUFBUSxnQkFBUjtBQUFBLFlBQTBCLE9BQUEsRUFBTyxtQkFBakM7V0FBTCxFQUEyRCxTQUFBLEdBQUE7bUJBQ3pELEtBQUMsQ0FBQSxLQUFELENBQU87QUFBQSxjQUFBLEtBQUEsRUFBSyxxQ0FBTDthQUFQLEVBQW1ELFNBQUEsR0FBQTtBQUNqRCxjQUFBLEtBQUMsQ0FBQSxLQUFELENBQU87QUFBQSxnQkFBQSxFQUFBLEVBQUkscUNBQUo7ZUFBUCxFQUNFO0FBQUEsZ0JBQUEsSUFBQSxFQUFLLFVBQUw7QUFBQSxnQkFBaUIsTUFBQSxFQUFRLG1CQUF6QjtlQURGLENBQUEsQ0FBQTtxQkFFQSxLQUFDLENBQUEsSUFBRCxDQUFNLG9DQUFOLEVBQTRDO0FBQUEsZ0JBQUEsT0FBQSxFQUFPLFlBQVA7ZUFBNUMsRUFIaUQ7WUFBQSxDQUFuRCxFQUR5RDtVQUFBLENBQTNELENBbEJBLENBQUE7aUJBdUJBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxpQkFBUDtXQUFMLEVBQStCLFNBQUEsR0FBQTttQkFDN0IsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsTUFBQSxFQUFRLGNBQVI7YUFBTCxFQUQ2QjtVQUFBLENBQS9CLEVBeEJvRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXRELEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsOEJBNEJBLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFDVixNQUFBLEtBQUssQ0FBQyxXQUFOLENBQWtCLENBQUMsSUFBQyxDQUFBLFdBQUYsRUFBZSxJQUFDLENBQUEsZUFBaEIsRUFBaUMsSUFBQyxDQUFBLFdBQWxDLEVBQ2hCLElBQUMsQ0FBQSxXQURlLEVBQ0YsSUFBQyxDQUFBLFlBREMsRUFDYSxJQUFDLENBQUEsV0FEZCxFQUMyQixJQUFDLENBQUEsaUJBRDVCLENBQWxCLENBQUEsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxFQUFiLENBQWdCLE1BQWhCLEVBQXdCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLGlCQUFELENBQW1CLEtBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBLENBQXNCLENBQUMsSUFBdkIsQ0FBQSxDQUFuQixFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEIsQ0FIQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsZUFBZSxDQUFDLEVBQWpCLENBQW9CLE9BQXBCLEVBQTZCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLGVBQUQsQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBN0IsQ0FKQSxDQUFBO2FBTUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLElBQUMsQ0FBQSxPQUFuQixFQUNFO0FBQUEsUUFBQSxjQUFBLEVBQWdCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxTQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhCO0FBQUEsUUFDQSxhQUFBLEVBQWdCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxNQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRGhCO09BREYsRUFQVTtJQUFBLENBNUJaLENBQUE7O0FBQUEsOEJBdUNBLFNBQUEsR0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLGdCQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUEsQ0FBc0IsQ0FBQyxJQUF2QixDQUFBLENBQVQsQ0FBQTtBQUNBLE1BQUEsSUFBQSxDQUFBLE1BQUE7QUFBQSxjQUFBLENBQUE7T0FEQTtBQUFBLE1BR0EsUUFBQSxHQUFXLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFBRyxVQUFBLEtBQUMsQ0FBQSxXQUFELENBQUEsQ0FBQSxDQUFBO2lCQUFnQixLQUFDLENBQUEsTUFBRCxDQUFBLEVBQW5CO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FIWCxDQUFBO0FBSUEsTUFBQSxJQUFHLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxJQUFuQixDQUF3QixTQUF4QixDQUFIO2VBQ0UsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFDLENBQUEsZUFBRCxDQUFpQixNQUFqQixDQUFYLEVBQXFDLFFBQXJDLEVBREY7T0FBQSxNQUFBO2VBR0UsUUFBQSxDQUFBLEVBSEY7T0FMUztJQUFBLENBdkNYLENBQUE7O0FBQUEsOEJBaURBLFdBQUEsR0FBYSxTQUFBLEdBQUE7QUFDWCxVQUFBLFNBQUE7QUFBQSxNQUFBLEdBQUEsR0FDRTtBQUFBLFFBQUEsR0FBQSxFQUFLLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQSxDQUFzQixDQUFDLElBQXZCLENBQUEsQ0FBbEIsQ0FBTDtBQUFBLFFBQ0EsR0FBQSxFQUFLLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBLENBREw7QUFBQSxRQUVBLEtBQUEsRUFBTyxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQSxDQUZQO0FBQUEsUUFHQSxNQUFBLEVBQVEsSUFBQyxDQUFBLFlBQVksQ0FBQyxPQUFkLENBQUEsQ0FIUjtBQUFBLFFBSUEsS0FBQSxFQUFPLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBLENBSlA7QUFBQSxRQUtBLElBQUEsRUFBTSxLQUFLLENBQUMsWUFBTixDQUFtQixJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBQSxDQUFuQixDQUxOO0FBQUEsUUFNQSxJQUFBLEVBQU0sTUFBTSxDQUFDLEdBQVAsQ0FBVyxTQUFYLENBTk47T0FERixDQUFBO0FBQUEsTUFRQSxJQUFBLEdBQVUsR0FBRyxDQUFDLEdBQVAsR0FBZ0IsSUFBQyxDQUFBLGdCQUFELENBQWtCLEdBQWxCLENBQWhCLEdBQTRDLEdBQUcsQ0FBQyxHQVJ2RCxDQUFBO2FBU0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixJQUFDLENBQUEsS0FBOUIsRUFBcUMsSUFBckMsRUFWVztJQUFBLENBakRiLENBQUE7O0FBQUEsOEJBNkRBLFNBQUEsR0FBVyxTQUFDLElBQUQsRUFBTyxRQUFQLEdBQUE7QUFDVCxVQUFBLGVBQUE7QUFBQSxNQUFBLElBQXFCLEtBQUssQ0FBQyxLQUFOLENBQVksSUFBWixDQUFBLElBQXFCLENBQUEsRUFBRyxDQUFDLFVBQUgsQ0FBYyxJQUFkLENBQTNDO0FBQUEsZUFBTyxRQUFBLENBQUEsQ0FBUCxDQUFBO09BQUE7QUFFQTtBQUNFLFFBQUEsUUFBQSxHQUFXLElBQUksQ0FBQyxJQUFMLENBQVUsTUFBTSxDQUFDLEdBQVAsQ0FBVyxjQUFYLENBQVYsRUFBc0MsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUF0QyxFQUFvRCxJQUFJLENBQUMsUUFBTCxDQUFjLElBQWQsQ0FBcEQsQ0FBWCxDQUFBO0FBRUEsUUFBQSxJQUFHLEVBQUUsQ0FBQyxVQUFILENBQWMsUUFBZCxDQUFIO2lCQUNFLElBQUksQ0FBQyxPQUFMLENBQ0U7QUFBQSxZQUFBLE9BQUEsRUFBUyxzQkFBVDtBQUFBLFlBQ0EsZUFBQSxFQUFrQixtQ0FBQSxHQUFtQyxRQURyRDtBQUFBLFlBRUEsT0FBQSxFQUFTLENBQUMsSUFBRCxDQUZUO1dBREYsRUFERjtTQUFBLE1BQUE7aUJBTUUsRUFBRSxDQUFDLElBQUgsQ0FBUSxJQUFSLEVBQWMsUUFBZCxFQUF3QixDQUFBLFNBQUEsS0FBQSxHQUFBO21CQUFBLFNBQUEsR0FBQTtBQUN0QixjQUFBLEtBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFxQixRQUFyQixDQUFBLENBQUE7cUJBQ0EsUUFBQSxDQUFBLEVBRnNCO1lBQUEsRUFBQTtVQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEIsRUFORjtTQUhGO09BQUEsY0FBQTtBQWFFLFFBREksY0FDSixDQUFBO2VBQUEsSUFBSSxDQUFDLE9BQUwsQ0FDRTtBQUFBLFVBQUEsT0FBQSxFQUFTLDBCQUFUO0FBQUEsVUFDQSxlQUFBLEVBQWtCLGVBQUEsR0FBZSxLQUFLLENBQUMsT0FEdkM7QUFBQSxVQUVBLE9BQUEsRUFBUyxDQUFDLElBQUQsQ0FGVDtTQURGLEVBYkY7T0FIUztJQUFBLENBN0RYLENBQUE7O0FBQUEsOEJBa0ZBLE9BQUEsR0FBUyxTQUFBLEdBQUE7O1FBQ1AsSUFBQyxDQUFBLFFBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO0FBQUEsVUFBQSxJQUFBLEVBQU0sSUFBTjtBQUFBLFVBQVksT0FBQSxFQUFTLEtBQXJCO1NBQTdCO09BQVY7QUFBQSxNQUNBLElBQUMsQ0FBQSx3QkFBRCxHQUE0QixDQUFBLENBQUUsUUFBUSxDQUFDLGFBQVgsQ0FENUIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FGVixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsc0JBQUQsQ0FBQSxDQUhBLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBLENBSkEsQ0FBQTthQUtBLElBQUMsQ0FBQSxXQUFXLENBQUMsS0FBYixDQUFBLEVBTk87SUFBQSxDQWxGVCxDQUFBOztBQUFBLDhCQTBGQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ04sVUFBQSxLQUFBO0FBQUEsTUFBQSxJQUFBLENBQUEsSUFBZSxDQUFBLEtBQUssQ0FBQyxTQUFQLENBQUEsQ0FBZDtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQSxDQURBLENBQUE7O2FBRXlCLENBQUUsS0FBM0IsQ0FBQTtPQUZBO2FBR0EsNkNBQUEsU0FBQSxFQUpNO0lBQUEsQ0ExRlIsQ0FBQTs7QUFBQSw4QkFnR0Esc0JBQUEsR0FBd0IsU0FBQSxHQUFBO0FBQ3RCLFVBQUEsU0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxLQUFLLENBQUMsa0JBQU4sQ0FBeUIsSUFBQyxDQUFBLE1BQTFCLEVBQWtDLE1BQWxDLENBQVQsQ0FBQTtBQUFBLE1BQ0EsU0FBQSxHQUFZLElBQUMsQ0FBQSxNQUFNLENBQUMsY0FBUixDQUF1QixJQUFDLENBQUEsS0FBeEIsQ0FEWixDQUFBO0FBRUEsTUFBQSxJQUF1QyxTQUF2QztlQUFBLElBQUMsQ0FBQSx1QkFBRCxDQUF5QixTQUF6QixFQUFBO09BSHNCO0lBQUEsQ0FoR3hCLENBQUE7O0FBQUEsOEJBcUdBLHVCQUFBLEdBQXlCLFNBQUMsU0FBRCxHQUFBO0FBQ3ZCLFVBQUEsR0FBQTtBQUFBLE1BQUEsSUFBRyxLQUFLLENBQUMsT0FBTixDQUFjLFNBQWQsQ0FBSDtBQUNFLFFBQUEsR0FBQSxHQUFNLEtBQUssQ0FBQyxVQUFOLENBQWlCLFNBQWpCLENBQU4sQ0FERjtPQUFBLE1BRUssSUFBRyxLQUFLLENBQUMsVUFBTixDQUFpQixTQUFqQixDQUFIO0FBQ0gsUUFBQSxHQUFBLEdBQU0sS0FBSyxDQUFDLGFBQU4sQ0FBb0IsU0FBcEIsQ0FBTixDQURHO09BQUEsTUFBQTtBQUdILFFBQUEsR0FBQSxHQUFNO0FBQUEsVUFBRSxHQUFBLEVBQUssU0FBUDtTQUFOLENBSEc7T0FGTDtBQUFBLE1BT0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQXFCLEdBQUcsQ0FBQyxHQUFKLElBQVcsRUFBaEMsQ0FQQSxDQUFBO0FBQUEsTUFRQSxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBcUIsR0FBRyxDQUFDLEtBQUosSUFBYSxFQUFsQyxDQVJBLENBQUE7QUFBQSxNQVNBLElBQUMsQ0FBQSxZQUFZLENBQUMsT0FBZCxDQUFzQixHQUFHLENBQUMsTUFBSixJQUFjLEVBQXBDLENBVEEsQ0FBQTtBQUFBLE1BVUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQXFCLEdBQUcsQ0FBQyxHQUFKLElBQVcsRUFBaEMsQ0FWQSxDQUFBO2FBV0EsSUFBQyxDQUFBLGlCQUFELENBQW1CLEdBQUcsQ0FBQyxHQUF2QixFQVp1QjtJQUFBLENBckd6QixDQUFBOztBQUFBLDhCQW1IQSxlQUFBLEdBQWlCLFNBQUEsR0FBQTtBQUNmLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLE1BQU0sQ0FBQyxjQUFQLENBQ047QUFBQSxRQUFBLFVBQUEsRUFBWSxDQUFDLFVBQUQsQ0FBWjtBQUFBLFFBQ0EsV0FBQSxFQUFhLGtCQUFBLElBQXNCLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUQzRDtPQURNLENBQVIsQ0FBQTtBQUdBLE1BQUEsSUFBQSxDQUFBLEtBQUE7QUFBQSxjQUFBLENBQUE7T0FIQTtBQUFBLE1BSUEsa0JBQUEsR0FBcUIsSUFBSSxDQUFDLE9BQUwsQ0FBYSxLQUFNLENBQUEsQ0FBQSxDQUFuQixDQUpyQixDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBcUIsS0FBTSxDQUFBLENBQUEsQ0FBM0IsQ0FMQSxDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsaUJBQUQsQ0FBbUIsS0FBTSxDQUFBLENBQUEsQ0FBekIsQ0FOQSxDQUFBO2FBT0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxLQUFiLENBQUEsRUFSZTtJQUFBLENBbkhqQixDQUFBOztBQUFBLDhCQTZIQSxpQkFBQSxHQUFtQixTQUFDLElBQUQsR0FBQTtBQUNqQixNQUFBLElBQUEsQ0FBQSxJQUFBO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxtQkFBRCxDQUFxQixJQUFyQixDQUZBLENBQUE7QUFHQSxNQUFBLElBQUcsS0FBSyxDQUFDLEtBQU4sQ0FBWSxJQUFaLENBQUEsSUFBcUIsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsZUFBRCxDQUFpQixJQUFqQixDQUFiLENBQXhCO2VBQ0UsSUFBQyxDQUFBLGNBQWMsQ0FBQyxRQUFoQixDQUF5QixRQUF6QixFQURGO09BQUEsTUFBQTtlQUdFLElBQUMsQ0FBQSxjQUFjLENBQUMsV0FBaEIsQ0FBNEIsUUFBNUIsRUFIRjtPQUppQjtJQUFBLENBN0huQixDQUFBOztBQUFBLDhCQXNJQSxtQkFBQSxHQUFxQixTQUFDLElBQUQsR0FBQTtBQUNuQixNQUFBLElBQVUsSUFBQyxDQUFBLGNBQUQsS0FBbUIsSUFBN0I7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUVBLE1BQUEsSUFBRyxJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsSUFBbEIsQ0FBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsMkJBQWQsQ0FBQSxDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsWUFBWSxDQUFDLElBQWQsQ0FBbUIsS0FBbkIsRUFBMEIsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsSUFBakIsQ0FBMUIsQ0FEQSxDQUFBO0FBQUEsUUFFQSxJQUFDLENBQUEsWUFBWSxDQUFDLElBQWQsQ0FBbUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7QUFBRyxZQUFBLEtBQUMsQ0FBQSxlQUFELENBQUEsQ0FBQSxDQUFBO21CQUFvQixLQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxFQUFkLEVBQXZCO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkIsQ0FGQSxDQUFBO0FBQUEsUUFHQSxJQUFDLENBQUEsWUFBWSxDQUFDLEtBQWQsQ0FBb0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7QUFDbEIsWUFBQSxLQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyw4QkFBZCxDQUFBLENBQUE7bUJBQ0EsS0FBQyxDQUFBLFlBQVksQ0FBQyxJQUFkLENBQW1CLEtBQW5CLEVBQTBCLEVBQTFCLEVBRmtCO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBcEIsQ0FIQSxDQURGO09BQUEsTUFBQTtBQVFFLFFBQUEsSUFBK0MsSUFBL0M7QUFBQSxVQUFBLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLDRCQUFkLENBQUEsQ0FBQTtTQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsWUFBWSxDQUFDLElBQWQsQ0FBbUIsS0FBbkIsRUFBMEIsRUFBMUIsQ0FEQSxDQUFBO0FBQUEsUUFFQSxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBcUIsRUFBckIsQ0FGQSxDQUFBO0FBQUEsUUFHQSxJQUFDLENBQUEsWUFBWSxDQUFDLE9BQWQsQ0FBc0IsRUFBdEIsQ0FIQSxDQUFBO0FBQUEsUUFJQSxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBcUIsRUFBckIsQ0FKQSxDQVJGO09BRkE7YUFnQkEsSUFBQyxDQUFBLGNBQUQsR0FBa0IsS0FqQkM7SUFBQSxDQXRJckIsQ0FBQTs7QUFBQSw4QkF5SkEsZ0JBQUEsR0FBa0IsU0FBQyxJQUFELEdBQUE7QUFDaEIsVUFBQSxLQUFBO2FBQUEsSUFBQSxJQUFRLFNBQUMsSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFiLENBQWtCLENBQUMsV0FBbkIsQ0FBQSxDQUFBLEVBQUEsZUFBb0MsZUFBcEMsRUFBQSxLQUFBLE1BQUQsRUFEUTtJQUFBLENBekpsQixDQUFBOztBQUFBLDhCQTRKQSxlQUFBLEdBQWlCLFNBQUEsR0FBQTtBQUNmLFVBQUEsNENBQUE7QUFBQSxNQUFBLFFBQWtDLElBQUMsQ0FBQSxZQUFZLENBQUMsT0FBaEQsRUFBRSxxQkFBQSxZQUFGLEVBQWdCLHNCQUFBLGFBQWhCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFxQixFQUFBLEdBQUssWUFBMUIsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsWUFBWSxDQUFDLE9BQWQsQ0FBc0IsRUFBQSxHQUFLLGFBQTNCLENBRkEsQ0FBQTtBQUFBLE1BSUEsUUFBQSxHQUFjLFlBQUEsR0FBZSxHQUFsQixHQUEyQixRQUEzQixHQUF5QyxPQUpwRCxDQUFBO2FBS0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQXFCLFFBQXJCLEVBTmU7SUFBQSxDQTVKakIsQ0FBQTs7QUFBQSw4QkFvS0EsV0FBQSxHQUFhLFNBQUMsSUFBRCxHQUFBO2FBQVUsSUFBQSxJQUFRLElBQUksQ0FBQyxVQUFMLENBQWdCLE1BQU0sQ0FBQyxHQUFQLENBQVcsY0FBWCxDQUFoQixFQUFsQjtJQUFBLENBcEtiLENBQUE7O0FBQUEsOEJBc0tBLFNBQUEsR0FBVyxTQUFBLEdBQUE7YUFBRyxLQUFLLENBQUMsV0FBTixDQUFrQixNQUFNLENBQUMsR0FBUCxDQUFXLGVBQVgsQ0FBbEIsRUFBSDtJQUFBLENBdEtYLENBQUE7O0FBQUEsOEJBd0tBLGVBQUEsR0FBaUIsU0FBQyxJQUFELEdBQUE7QUFDZixNQUFBLElBQWEsQ0FBQSxJQUFiO0FBQUEsZUFBTyxFQUFQLENBQUE7T0FBQTtBQUNBLE1BQUEsSUFBZSxLQUFLLENBQUMsS0FBTixDQUFZLElBQVosQ0FBQSxJQUFxQixFQUFFLENBQUMsVUFBSCxDQUFjLElBQWQsQ0FBcEM7QUFBQSxlQUFPLElBQVAsQ0FBQTtPQURBO0FBRUEsYUFBTyxJQUFJLENBQUMsSUFBTCxDQUFVLE1BQU0sQ0FBQyxHQUFQLENBQVcsY0FBWCxDQUFWLEVBQXNDLElBQXRDLENBQVAsQ0FIZTtJQUFBLENBeEtqQixDQUFBOztBQUFBLDhCQTZLQSxnQkFBQSxHQUFrQixTQUFDLElBQUQsR0FBQTtBQUNoQixVQUFBLFFBQUE7QUFBQSxNQUFBLElBQWEsQ0FBQSxJQUFiO0FBQUEsZUFBTyxFQUFQLENBQUE7T0FBQTtBQUNBLE1BQUEsSUFBZSxLQUFLLENBQUMsS0FBTixDQUFZLElBQVosQ0FBZjtBQUFBLGVBQU8sSUFBUCxDQUFBO09BREE7QUFHQSxNQUFBLElBQUcsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFiLENBQUg7QUFDRSxRQUFBLFFBQUEsR0FBVyxJQUFJLENBQUMsUUFBTCxDQUFjLE1BQU0sQ0FBQyxHQUFQLENBQVcsY0FBWCxDQUFkLEVBQTBDLElBQTFDLENBQVgsQ0FERjtPQUFBLE1BQUE7QUFHRSxRQUFBLFFBQUEsR0FBVyxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUMsQ0FBQSxTQUFELENBQUEsQ0FBVixFQUF3QixJQUFJLENBQUMsUUFBTCxDQUFjLElBQWQsQ0FBeEIsQ0FBWCxDQUhGO09BSEE7QUFPQSxhQUFPLElBQUksQ0FBQyxJQUFMLENBQVUsR0FBVixFQUFlLFFBQWYsQ0FBUCxDQVJnQjtJQUFBLENBN0tsQixDQUFBOztBQUFBLDhCQXVMQSxnQkFBQSxHQUFrQixTQUFDLElBQUQsR0FBQTthQUFVLEtBQUssQ0FBQyxRQUFOLENBQWUsTUFBTSxDQUFDLEdBQVAsQ0FBVyxVQUFYLENBQWYsRUFBdUMsSUFBdkMsRUFBVjtJQUFBLENBdkxsQixDQUFBOzsyQkFBQTs7S0FENEIsS0FiOUIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/sarah/.atom/packages/markdown-writer/lib/views/insert-image-view.coffee
