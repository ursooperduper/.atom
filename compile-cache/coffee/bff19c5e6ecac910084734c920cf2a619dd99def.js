(function() {
  var $, $$, CSON, ProjectManagerView, SelectListView, View, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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

    ProjectManagerView.prototype.activate = function() {
      return new ProjectManagerView;
    };

    ProjectManagerView.prototype.initialize = function(serializeState) {
      ProjectManagerView.__super__.initialize.apply(this, arguments);
      return this.addClass('project-manager overlay from-top');
    };

    ProjectManagerView.prototype.serialize = function() {};

    ProjectManagerView.prototype.getFilterKey = function() {
      return 'title';
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhEQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBZ0MsT0FBQSxDQUFRLE1BQVIsQ0FBaEMsRUFBQyxTQUFBLENBQUQsRUFBSSxVQUFBLEVBQUosRUFBUSxzQkFBQSxjQUFSLEVBQXdCLFlBQUEsSUFBeEIsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBRkosQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSix5Q0FBQSxDQUFBOzs7OztLQUFBOztBQUFBLGlDQUFBLGNBQUEsR0FBZ0IsSUFBaEIsQ0FBQTs7QUFBQSxpQ0FDQSxRQUFBLEdBQVUsU0FBQSxHQUFBO2FBQ1IsR0FBQSxDQUFBLG1CQURRO0lBQUEsQ0FEVixDQUFBOztBQUFBLGlDQUlBLFVBQUEsR0FBWSxTQUFDLGNBQUQsR0FBQTtBQUNWLE1BQUEsb0RBQUEsU0FBQSxDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLGtDQUFWLEVBRlU7SUFBQSxDQUpaLENBQUE7O0FBQUEsaUNBUUEsU0FBQSxHQUFXLFNBQUEsR0FBQSxDQVJYLENBQUE7O0FBQUEsaUNBVUEsWUFBQSxHQUFjLFNBQUEsR0FBQTthQUNaLFFBRFk7SUFBQSxDQVZkLENBQUE7O0FBQUEsaUNBYUEsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUNQLElBQUMsQ0FBQSxNQUFELENBQUEsRUFETztJQUFBLENBYlQsQ0FBQTs7QUFBQSxpQ0FnQkEsZUFBQSxHQUFpQixTQUFDLFNBQUQsRUFBWSxpQkFBWixHQUFBO0FBQ2YsTUFBQSxJQUFHLENBQUEsU0FBSDtlQUNFLHdCQURGO09BQUEsTUFBQTtlQUdFLHlEQUFB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
//# sourceURL=/Users/sarah/.atom/packages/project-manager/lib/project-manager-view.coffee