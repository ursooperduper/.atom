(function() {
  var CompositeDisposable, DB, Project, Projects, ProjectsListView, SaveDialog;

  CompositeDisposable = require('atom').CompositeDisposable;

  Projects = null;

  Project = null;

  SaveDialog = null;

  DB = null;

  ProjectsListView = null;

  module.exports = {
    config: {
      showPath: {
        type: 'boolean',
        "default": true
      },
      closeCurrent: {
        type: 'boolean',
        "default": false,
        description: "Currently disabled since it's broken. Waiting for a better way to implement it."
      },
      environmentSpecificProjects: {
        type: 'boolean',
        "default": false
      },
      sortBy: {
        type: 'string',
        description: 'Default sorting is the order in which the projects are',
        "default": 'default',
        "enum": ['default', 'title', 'group']
      }
    },
    projects: null,
    project: null,
    projectsListView: null,
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'project-manager:list-projects': function() {
          var projectsListView;
          if (ProjectsListView == null) {
            ProjectsListView = require('./projects-list-view');
          }
          projectsListView = new ProjectsListView();
          return projectsListView.toggle();
        },
        'project-manager:save-project': function() {
          var saveDialog;
          if (SaveDialog == null) {
            SaveDialog = require('./save-dialog');
          }
          saveDialog = new SaveDialog();
          return saveDialog.attach();
        },
        'project-manager:edit-projects': function() {
          var db;
          if (DB == null) {
            DB = require('./db');
          }
          db = new DB();
          return atom.workspace.open(db.file());
        },
        'project-manager:reload-project-settings': (function(_this) {
          return function() {
            return _this.loadProject();
          };
        })(this)
      }));
      atom.project.onDidChangePaths(this.updatePaths);
      return this.loadProject();
    },
    loadProject: (function(_this) {
      return function() {
        if (Projects == null) {
          Projects = require('./projects');
        }
        _this.projects = new Projects();
        return _this.projects.getCurrent(function(project) {
          if (project) {
            _this.project = project;
            return _this.project.load();
          }
        });
      };
    })(this),
    updatePaths: (function(_this) {
      return function() {
        var paths;
        paths = atom.project.getPaths();
        if (_this.project && paths.length) {
          return _this.project.set('paths', paths);
        }
      };
    })(this),
    provideProjects: function() {
      return {
        projects: new Projects()
      };
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvcHJvamVjdC1tYW5hZ2VyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3RUFBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBRUEsUUFBQSxHQUFXLElBRlgsQ0FBQTs7QUFBQSxFQUdBLE9BQUEsR0FBVSxJQUhWLENBQUE7O0FBQUEsRUFJQSxVQUFBLEdBQWEsSUFKYixDQUFBOztBQUFBLEVBS0EsRUFBQSxHQUFLLElBTEwsQ0FBQTs7QUFBQSxFQU1BLGdCQUFBLEdBQW1CLElBTm5CLENBQUE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO09BREY7QUFBQSxNQUlBLFlBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO0FBQUEsUUFFQSxXQUFBLEVBQ0UsaUZBSEY7T0FMRjtBQUFBLE1BV0EsMkJBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO09BWkY7QUFBQSxNQWVBLE1BQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFdBQUEsRUFBYSx3REFEYjtBQUFBLFFBRUEsU0FBQSxFQUFTLFNBRlQ7QUFBQSxRQUdBLE1BQUEsRUFBTSxDQUNKLFNBREksRUFFSixPQUZJLEVBR0osT0FISSxDQUhOO09BaEJGO0tBREY7QUFBQSxJQTBCQSxRQUFBLEVBQVUsSUExQlY7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

//# sourceURL=/Users/sarah/.atom/packages/project-manager/lib/project-manager.coffee
