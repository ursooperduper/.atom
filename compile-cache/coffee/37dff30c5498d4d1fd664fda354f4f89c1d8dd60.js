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
              var _ref;
              _this.span('Path: ');
              return _this.span({
                "class": 'text-highlight'
              }, (_ref = atom.project) != null ? _ref.getPath() : void 0);
            });
          });
        };
      })(this));
    };

    ProjectManagerAddView.prototype.initialize = function() {
      this.editor.on('core:confirm', this.confirm);
      this.editor.on('core:cancel', this.hide);
      return this.editor.on('blur', this.hide);
    };

    ProjectManagerAddView.prototype.cancelled = function() {
      return this.hide();
    };

    ProjectManagerAddView.prototype.confirm = function() {
      var project, _ref;
      project = {
        title: this.editor.val(),
        paths: [(_ref = atom.project) != null ? _ref.getPath() : void 0]
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
      var basename;
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      basename = path.basename(atom.project.getPath());
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlDQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsc0JBQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDRDQUFBLENBQUE7Ozs7Ozs7O0tBQUE7O0FBQUEsb0NBQUEsY0FBQSxHQUFnQixJQUFoQixDQUFBOztBQUFBLElBRUEscUJBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLGlCQUFQO09BQUwsRUFBK0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDN0IsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLGtCQUFQO0FBQUEsWUFBMkIsTUFBQSxFQUFRLGlCQUFuQztXQUFMLEVBQTJELFNBQUEsR0FBQTtBQUN6RCxZQUFBLEtBQUMsQ0FBQSxHQUFELENBQUssU0FBQSxHQUFBO3FCQUNILEtBQUMsQ0FBQSxLQUFELENBQU87QUFBQSxnQkFBQSxNQUFBLEVBQU8sUUFBUDtBQUFBLGdCQUFpQixPQUFBLEVBQU0scUJBQXZCO0FBQUEsZ0JBQThDLGVBQUEsRUFBaUIsZUFBL0Q7ZUFBUCxFQURHO1lBQUEsQ0FBTCxDQUFBLENBQUE7bUJBRUEsS0FBQyxDQUFBLEdBQUQsQ0FBSyxTQUFBLEdBQUE7QUFDSCxrQkFBQSxJQUFBO0FBQUEsY0FBQSxLQUFDLENBQUEsSUFBRCxDQUFNLFFBQU4sQ0FBQSxDQUFBO3FCQUNBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxnQkFBQSxPQUFBLEVBQU8sZ0JBQVA7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
//# sourceURL=/Users/sarah/.atom/packages/project-manager/lib/project-manager-add-view.coffee