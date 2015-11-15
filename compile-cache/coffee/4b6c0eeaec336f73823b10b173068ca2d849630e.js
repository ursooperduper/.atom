(function() {
  var EditorView, ProjectManagerAddView, View, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), View = _ref.View, EditorView = _ref.EditorView;

  module.exports = ProjectManagerAddView = (function(_super) {
    __extends(ProjectManagerAddView, _super);

    function ProjectManagerAddView() {
      this.remove = __bind(this.remove, this);
      this.confirm = __bind(this.confirm, this);
      this.focus = __bind(this.focus, this);
      return ProjectManagerAddView.__super__.constructor.apply(this, arguments);
    }

    ProjectManagerAddView.prototype.projectManager = null;

    ProjectManagerAddView.content = function() {
      return this.div({
        "class": 'project-manager overlay from-top'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'editor-container',
            outlet: 'editorContainer'
          }, function() {
            _this.subview('editor', new EditorView({
              mini: true,
              placeholderText: 'Project title'
            }));
            return _this.div(function() {
              var _ref1;
              _this.span('Path: ');
              return _this.span({
                "class": 'text-highlight'
              }, (_ref1 = atom.project) != null ? _ref1.getPath() : void 0);
            });
          });
        };
      })(this));
    };

    ProjectManagerAddView.prototype.initialize = function() {};

    ProjectManagerAddView.prototype.handleEvents = function() {
      this.editor.on('core:confirm', this.confirm);
      this.editor.on('core:cancel', this.remove);
      return this.editor.find('input').on('blur', this.remove);
    };

    ProjectManagerAddView.prototype.focus = function() {
      this.removeClass('hidden');
      return this.editorContainer.find('.editor').focus();
    };

    ProjectManagerAddView.prototype.confirm = function() {
      var project, _ref1;
      project = {
        title: this.editor.getText(),
        paths: [(_ref1 = atom.project) != null ? _ref1.getPath() : void 0]
      };
      if (project.title) {
        this.projectManager.addProject(project);
      }
      if (project.title) {
        return this.remove();
      }
    };

    ProjectManagerAddView.prototype.remove = function() {
      this.editor.setText('');
      if (atom.workspaceView != null) {
        atom.workspaceView.focus();
      }
      return this.addClass('hidden');
    };

    ProjectManagerAddView.prototype.toggle = function(projectManager) {
      this.projectManager = projectManager;
      atom.workspaceView.append(this);
      this.focus();
      return this.handleEvents();
    };

    return ProjectManagerAddView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZDQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBcUIsT0FBQSxDQUFRLE1BQVIsQ0FBckIsRUFBQyxZQUFBLElBQUQsRUFBTyxrQkFBQSxVQUFQLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osNENBQUEsQ0FBQTs7Ozs7OztLQUFBOztBQUFBLG9DQUFBLGNBQUEsR0FBZ0IsSUFBaEIsQ0FBQTs7QUFBQSxJQUVBLHFCQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxrQ0FBUDtPQUFMLEVBQWdELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQzlDLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxrQkFBUDtBQUFBLFlBQTJCLE1BQUEsRUFBUSxpQkFBbkM7V0FBTCxFQUEyRCxTQUFBLEdBQUE7QUFDekQsWUFBQSxLQUFDLENBQUEsT0FBRCxDQUFTLFFBQVQsRUFDTSxJQUFBLFVBQUEsQ0FBVztBQUFBLGNBQUEsSUFBQSxFQUFNLElBQU47QUFBQSxjQUFZLGVBQUEsRUFBaUIsZUFBN0I7YUFBWCxDQUROLENBQUEsQ0FBQTttQkFFQSxLQUFDLENBQUEsR0FBRCxDQUFLLFNBQUEsR0FBQTtBQUNILGtCQUFBLEtBQUE7QUFBQSxjQUFBLEtBQUMsQ0FBQSxJQUFELENBQU0sUUFBTixDQUFBLENBQUE7cUJBQ0EsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLGdCQUFBLE9BQUEsRUFBTyxnQkFBUDtlQUFOLHdDQUEyQyxDQUFFLE9BQWQsQ0FBQSxVQUEvQixFQUZHO1lBQUEsQ0FBTCxFQUh5RDtVQUFBLENBQTNELEVBRDhDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEQsRUFEUTtJQUFBLENBRlYsQ0FBQTs7QUFBQSxvQ0FXQSxVQUFBLEdBQVksU0FBQSxHQUFBLENBWFosQ0FBQTs7QUFBQSxvQ0FhQSxZQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ1osTUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLEVBQVIsQ0FBVyxjQUFYLEVBQTJCLElBQUMsQ0FBQSxPQUE1QixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsRUFBUixDQUFXLGFBQVgsRUFBMEIsSUFBQyxDQUFBLE1BQTNCLENBREEsQ0FBQTthQUVBLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBUixDQUFhLE9BQWIsQ0FBcUIsQ0FBQyxFQUF0QixDQUF5QixNQUF6QixFQUFpQyxJQUFDLENBQUEsTUFBbEMsRUFIWTtJQUFBLENBYmQsQ0FBQTs7QUFBQSxvQ0FrQkEsS0FBQSxHQUFPLFNBQUEsR0FBQTtBQUNMLE1BQUEsSUFBQyxDQUFBLFdBQUQsQ0FBYSxRQUFiLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxlQUFlLENBQUMsSUFBakIsQ0FBc0IsU0FBdEIsQ0FBZ0MsQ0FBQyxLQUFqQyxDQUFBLEVBRks7SUFBQSxDQWxCUCxDQUFBOztBQUFBLG9DQXNCQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsVUFBQSxjQUFBO0FBQUEsTUFBQSxPQUFBLEdBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBQSxDQUFQO0FBQUEsUUFDQSxLQUFBLEVBQU8sdUNBQWEsQ0FBRSxPQUFkLENBQUEsVUFBRCxDQURQO09BREYsQ0FBQTtBQUlBLE1BQUEsSUFBdUMsT0FBTyxDQUFDLEtBQS9DO0FBQUEsUUFBQSxJQUFDLENBQUEsY0FBYyxDQUFDLFVBQWhCLENBQTJCLE9BQTNCLENBQUEsQ0FBQTtPQUpBO0FBS0EsTUFBQSxJQUFhLE9BQU8sQ0FBQyxLQUFyQjtlQUFBLElBQUMsQ0FBQSxNQUFELENBQUEsRUFBQTtPQU5PO0lBQUEsQ0F0QlQsQ0FBQTs7QUFBQSxvQ0E4QkEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLE1BQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFSLENBQWdCLEVBQWhCLENBQUEsQ0FBQTtBQUNBLE1BQUEsSUFBOEIsMEJBQTlCO0FBQUEsUUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQW5CLENBQUEsQ0FBQSxDQUFBO09BREE7YUFFQSxJQUFDLENBQUEsUUFBRCxDQUFVLFFBQVYsRUFITTtJQUFBLENBOUJSLENBQUE7O0FBQUEsb0NBbUNBLE1BQUEsR0FBUSxTQUFDLGNBQUQsR0FBQTtBQUNOLE1BQUEsSUFBQyxDQUFBLGNBQUQsR0FBa0IsY0FBbEIsQ0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFuQixDQUEwQixJQUExQixDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FGQSxDQUFBO2FBR0EsSUFBQyxDQUFBLFlBQUQsQ0FBQSxFQUpNO0lBQUEsQ0FuQ1IsQ0FBQTs7aUNBQUE7O0tBRGtDLEtBSHBDLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/sarah/.atom/packages/project-manager/lib/project-manager-add-view.coffee