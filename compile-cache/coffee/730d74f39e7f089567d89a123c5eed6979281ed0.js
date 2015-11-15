(function() {
  var $, $$, CSON, ProjectManagerView, SelectListView, View, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('atom'), $ = _ref.$, $$ = _ref.$$, SelectListView = _ref.SelectListView, View = _ref.View;

  CSON = require('season');

  _ = require('underscore-plus');

  module.exports = ProjectManagerView = (function(_super) {
    __extends(ProjectManagerView, _super);

    function ProjectManagerView() {
      this.getEmptyMessage = __bind(this.getEmptyMessage, this);
      return ProjectManagerView.__super__.constructor.apply(this, arguments);
    }

    ProjectManagerView.prototype.projectManager = null;

    ProjectManagerView.prototype.possibleFilterKeys = ['title', 'group', 'template'];

    ProjectManagerView.prototype.activate = function() {
      return new ProjectManagerView;
    };

    ProjectManagerView.prototype.initialize = function(serializeState) {
      ProjectManagerView.__super__.initialize.apply(this, arguments);
      return this.addClass('project-manager overlay from-top');
    };

    ProjectManagerView.prototype.serialize = function() {};

    ProjectManagerView.prototype.getFilterKey = function() {
      var filter, input, inputArr, _ref1;
      filter = 'title';
      input = this.filterEditorView.getText();
      inputArr = input.split(':');
      if (inputArr.length > 1 && (_ref1 = inputArr[0], __indexOf.call(this.possibleFilterKeys, _ref1) >= 0)) {
        filter = inputArr[0];
      }
      return filter;
    };

    ProjectManagerView.prototype.getFilterQuery = function() {
      var input, inputArr;
      input = this.filterEditorView.getText();
      inputArr = input.split(':');
      if (inputArr.length > 1) {
        input = inputArr[1];
      }
      return input;
    };

    ProjectManagerView.prototype.destroy = function() {
      return this.detach();
    };

    ProjectManagerView.prototype.getEmptyMessage = function(itemCount, filteredItemCount) {
      if (!itemCount) {
        return 'No projects saved yet';
      } else {
        return ProjectManagerView.__super__.getEmptyMessage.apply(this, arguments);
      }
    };

    ProjectManagerView.prototype.toggle = function(projectManager) {
      this.projectManager = projectManager;
      if (this.hasParent()) {
        return this.cancel();
      } else {
        return this.attach();
      }
    };

    ProjectManagerView.prototype.attach = function() {
      var currentProjects, project, projects, sortBy, title;
      projects = [];
      currentProjects = CSON.readFileSync(this.projectManager.file());
      for (title in currentProjects) {
        project = currentProjects[title];
        if (project.template != null) {
          project = _.deepExtend(project, currentProjects[project.template]);
        }
        if (project.paths != null) {
          projects.push(project);
        }
      }
      sortBy = atom.config.get('project-manager.sortBy');
      if (sortBy !== 'default') {
        projects = this.sortBy(projects, sortBy);
      }
      this.setItems(projects);
      atom.workspaceView.append(this);
      return this.focusFilterEditor();
    };

    ProjectManagerView.prototype.viewForItem = function(_arg) {
      var devMode, group, icon, paths, title;
      title = _arg.title, paths = _arg.paths, icon = _arg.icon, group = _arg.group, devMode = _arg.devMode;
      icon = icon || 'icon-chevron-right';
      return $$(function() {
        return this.li({
          "class": 'two-lines',
          'data-project-title': title
        }, (function(_this) {
          return function() {
            var path, _i, _len, _results;
            _this.div({
              "class": 'primary-line'
            }, function() {
              if (devMode) {
                _this.span({
                  "class": 'project-manager-devmode'
                });
              }
              return _this.div({
                "class": "icon " + icon
              }, function() {
                _this.span(title);
                if (group != null) {
                  return _this.span({
                    "class": 'project-manager-list-group'
                  }, group);
                }
              });
            });
            if (atom.config.get('project-manager.showPath')) {
              _results = [];
              for (_i = 0, _len = paths.length; _i < _len; _i++) {
                path = paths[_i];
                _results.push(_this.div({
                  "class": 'secondary-line'
                }, function() {
                  return _this.div({
                    "class": 'no-icon'
                  }, path);
                }));
              }
              return _results;
            }
          };
        })(this));
      });
    };

    ProjectManagerView.prototype.confirmed = function(project) {
      this.cancel();
      return this.projectManager.openProject(project);
    };

    ProjectManagerView.prototype.sortBy = function(arr, key) {
      return arr.sort(function(a, b) {
        return (a[key] || '\uffff').toUpperCase() > (b[key] || '\uffff').toUpperCase();
      });
    };

    return ProjectManagerView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhEQUFBO0lBQUE7Ozt5SkFBQTs7QUFBQSxFQUFBLE9BQWdDLE9BQUEsQ0FBUSxNQUFSLENBQWhDLEVBQUMsU0FBQSxDQUFELEVBQUksVUFBQSxFQUFKLEVBQVEsc0JBQUEsY0FBUixFQUF3QixZQUFBLElBQXhCLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUZKLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0oseUNBQUEsQ0FBQTs7Ozs7S0FBQTs7QUFBQSxpQ0FBQSxjQUFBLEdBQWdCLElBQWhCLENBQUE7O0FBQUEsaUNBQ0Esa0JBQUEsR0FBb0IsQ0FBQyxPQUFELEVBQVUsT0FBVixFQUFtQixVQUFuQixDQURwQixDQUFBOztBQUFBLGlDQUVBLFFBQUEsR0FBVSxTQUFBLEdBQUE7YUFDUixHQUFBLENBQUEsbUJBRFE7SUFBQSxDQUZWLENBQUE7O0FBQUEsaUNBS0EsVUFBQSxHQUFZLFNBQUMsY0FBRCxHQUFBO0FBQ1YsTUFBQSxvREFBQSxTQUFBLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxRQUFELENBQVUsa0NBQVYsRUFGVTtJQUFBLENBTFosQ0FBQTs7QUFBQSxpQ0FTQSxTQUFBLEdBQVcsU0FBQSxHQUFBLENBVFgsQ0FBQTs7QUFBQSxpQ0FXQSxZQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ1osVUFBQSw4QkFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLE9BQVQsQ0FBQTtBQUFBLE1BQ0EsS0FBQSxHQUFRLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxPQUFsQixDQUFBLENBRFIsQ0FBQTtBQUFBLE1BRUEsUUFBQSxHQUFXLEtBQUssQ0FBQyxL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
//# sourceURL=/Users/sarah/.atom/packages/project-manager/lib/project-manager-view.coffee