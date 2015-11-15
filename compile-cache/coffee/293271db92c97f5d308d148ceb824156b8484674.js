(function() {
  var $, $$, CSON, ProjectManagerView, SelectListView, View, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), $ = _ref.$, $$ = _ref.$$, SelectListView = _ref.SelectListView, View = _ref.View;

  CSON = require('season');

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
      var currentProjects, project, projects, title;
      projects = [];
      currentProjects = CSON.readFileSync(this.projectManager.file());
      for (title in currentProjects) {
        project = currentProjects[title];
        projects.push(project);
      }
      if (atom.config.get('project-manager.sortByTitle')) {
        projects = this.sortBy(projects, 'title');
      }
      this.setItems(projects);
      atom.workspaceView.append(this);
      return this.focusFilterEditor();
    };

    ProjectManagerView.prototype.viewForItem = function(_arg) {
      var icon, paths, title;
      title = _arg.title, paths = _arg.paths, icon = _arg.icon;
      icon = icon || 'icon-chevron-right';
      return $$(function() {
        return this.li({
          "class": 'two-lines',
          'data-project-title': title
        }, (function(_this) {
          return function() {
            var path, _i, _len, _results;
            _this.div({
              "class": "primary-line icon " + icon
            }, title);
            if (atom.config.get('project-manager.showPath')) {
              _results = [];
              for (_i = 0, _len = paths.length; _i < _len; _i++) {
                path = paths[_i];
                _results.push(_this.div({
                  "class": 'secondary-line no-icon'
                }, path));
              }
              return _results;
            }
          };
        })(this));
      });
    };

    ProjectManagerView.prototype.confirmed = function(_arg) {
      var paths, title;
      title = _arg.title, paths = _arg.paths;
      this.cancel();
      return this.projectManager.openProject({
        title: title,
        paths: paths
      });
    };

    ProjectManagerView.prototype.sortBy = function(arr, key) {
      return arr.sort(function(a, b) {
        return a[key].toUpperCase() > b[key].toUpperCase();
      });
    };

    return ProjectManagerView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJEQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBZ0MsT0FBQSxDQUFRLE1BQVIsQ0FBaEMsRUFBQyxTQUFBLENBQUQsRUFBSSxVQUFBLEVBQUosRUFBUSxzQkFBQSxjQUFSLEVBQXdCLFlBQUEsSUFBeEIsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUixDQURQLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0oseUNBQUEsQ0FBQTs7Ozs7S0FBQTs7QUFBQSxpQ0FBQSxjQUFBLEdBQWdCLElBQWhCLENBQUE7O0FBQUEsaUNBQ0EsUUFBQSxHQUFVLFNBQUEsR0FBQTthQUNSLEdBQUEsQ0FBQSxtQkFEUTtJQUFBLENBRFYsQ0FBQTs7QUFBQSxpQ0FJQSxVQUFBLEdBQVksU0FBQyxjQUFELEdBQUE7QUFDVixNQUFBLG9EQUFBLFNBQUEsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxrQ0FBVixFQUZVO0lBQUEsQ0FKWixDQUFBOztBQUFBLGlDQVFBLFNBQUEsR0FBVyxTQUFBLEdBQUEsQ0FSWCxDQUFBOztBQUFBLGlDQVVBLFlBQUEsR0FBYyxTQUFBLEdBQUE7YUFDWixRQURZO0lBQUEsQ0FWZCxDQUFBOztBQUFBLGlDQWFBLE9BQUEsR0FBUyxTQUFBLEdBQUE7YUFDUCxJQUFDLENBQUEsTUFBRCxDQUFBLEVBRE87SUFBQSxDQWJULENBQUE7O0FBQUEsaUNBZ0JBLGVBQUEsR0FBaUIsU0FBQyxTQUFELEVBQVksaUJBQVosR0FBQTtBQUNmLE1BQUEsSUFBRyxDQUFBLFNBQUg7ZUFDRSx3QkFERjtPQUFBLE1BQUE7ZUFHRSx5REFBQSxTQUFBLEVBSEY7T0FEZTtJQUFBLENBaEJqQixDQUFBOztBQUFBLGlDQXNCQSxN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
//# sourceURL=/Users/sarah/.atom/packages/project-manager/lib/project-manager-view.coffee