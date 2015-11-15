(function() {
  var ProjectManagerAddView, View, path,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  path = require('path');

  module.exports = ProjectManagerAddView = (function(_super) {
    __extends(ProjectManagerAddView, _super);

    function ProjectManagerAddView() {
      this.show = __bind(this.show, this);
      this.hide = __bind(this.hide, this);
      this.confirm = __bind(this.confirm, this);
      this.cancelled = __bind(this.cancelled, this);
      return ProjectManagerAddView.__super__.constructor.apply(this, arguments);
    }

    ProjectManagerAddView.prototype.projectManager = null;

    ProjectManagerAddView.content = function() {
      return this.div({
        "class": 'project-manager'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'editor-container',
            outlet: 'editorContainer'
          }, function() {
            _this.div(function() {
              return _this.input({
                outlet: 'editor',
                "class": 'native-key-bindings',
                placeholderText: 'Project title'
              });
            });
            return _this.div(function() {
              var projectPath, _i, _len, _ref, _ref1, _results;
              _ref1 = (_ref = atom.project) != null ? _ref.getPaths() : void 0;
              _results = [];
              for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                projectPath = _ref1[_i];
                _results.push(_this.span({
                  "class": 'text-highlight'
                }, projectPath));
              }
              return _results;
            });
          });
        };
      })(this));
    };

    ProjectManagerAddView.prototype.initialize = function() {
      atom.commands.add(this.element, {
        'core:confirm': (function(_this) {
          return function() {
            return _this.confirm();
          };
        })(this),
        'core:cancel': (function(_this) {
          return function() {
            return _this.hide();
          };
        })(this)
      });
      return this.editor.on('blur', this.hide);
    };

    ProjectManagerAddView.prototype.cancelled = function() {
      return this.hide();
    };

    ProjectManagerAddView.prototype.confirm = function() {
      var project;
      project = {
        title: this.editor.val(),
        paths: atom.project.getPaths()
      };
      if (project.title) {
        this.projectManager.addProject(project);
      }
      if (project.title) {
        return this.hide();
      }
    };

    ProjectManagerAddView.prototype.hide = function() {
      atom.commands.dispatch(atom.views.getView(atom.workspace), 'focus');
      return this.panel.hide();
    };

    ProjectManagerAddView.prototype.show = function() {
      var basename, firstPath;
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      firstPath = atom.project.getPaths()[0];
      basename = path.basename(firstPath);
      this.editor.val(basename);
      this.editor.focus();
      return this.editor.select();
    };

    ProjectManagerAddView.prototype.toggle = function(projectManager) {
      var _ref;
      this.projectManager = projectManager;
      if ((_ref = this.panel) != null ? _ref.isVisible() : void 0) {
        return this.hide();
      } else {
        return this.show();
      }
    };

    return ProjectManagerAddView;

  })(View);

}).call(this);
