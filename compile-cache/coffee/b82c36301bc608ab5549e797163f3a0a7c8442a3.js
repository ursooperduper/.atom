(function() {
  var fs;

  fs = require('fs');

  module.exports = {
    configDefaults: {
      showPath: false,
      closeCurrent: false,
      sortByTitle: false,
      environmentSpecificProjects: false
    },
    projectManagerView: null,
    projectManagerAddView: null,
    filepath: null,
    activate: function(state) {
      fs.exists(this.file(), (function(_this) {
        return function(exists) {
          if (!exists) {
            return fs.writeFile(_this.file(), '{}', function(error) {
              if (error) {
                return console.log("Error: Could not create " + (this.file()) + " - " + error);
              }
            });
          } else {
            _this.subscribeToProjectsFile();
            return _this.loadCurrentProject();
          }
        };
      })(this));
      atom.workspaceView.command('project-manager:save-project', (function(_this) {
        return function() {
          return _this.createProjectManagerAddView(state).toggle(_this);
        };
      })(this));
      atom.workspaceView.command('project-manager:toggle', (function(_this) {
        return function() {
          return _this.createProjectManagerView(state).toggle(_this);
        };
      })(this));
      atom.workspaceView.command('project-manager:edit-projects', (function(_this) {
        return function() {
          return atom.workspaceView.open(_this.file());
        };
      })(this));
      atom.workspaceView.command('project-manager:reload-project-settings', (function(_this) {
        return function() {
          return _this.loadCurrentProject();
        };
      })(this));
      return atom.config.observe('project-manager.environmentSpecificProjects', (function(_this) {
        return function(newValue, obj) {
          var previous;
          if (obj == null) {
            obj = {};
          }
          previous = obj.previous != null ? obj.previous : newValue;
          if (newValue !== previous) {
            _this.updateFile();
            return _this.subscribeToProjectsFile();
          }
        };
      })(this));
    },
    file: function(update) {
      var filedir, filename, hostname, os;
      if (update == null) {
        update = false;
      }
      if (update) {
        this.filepath = null;
      }
      if (this.filepath == null) {
        filename = 'projects.cson';
        filedir = atom.getConfigDirPath();
        if (atom.config.get('project-manager.environmentSpecificProjects')) {
          os = require('os');
          hostname = os.hostname().split('.').shift().toLowerCase();
          filename = "projects." + hostname + ".cson";
        }
        this.filepath = "" + filedir + "/" + filename;
      }
      return this.filepath;
    },
    updateFile: function() {
      return fs.exists(this.file(true), (function(_this) {
        return function(exists) {
          if (!exists) {
            return fs.writeFile(_this.file(), '{}', function(error) {
              if (error) {
                return console.log("Error: Could not create " + (this.file()) + " - " + error);
              }
            });
          }
        };
      })(this));
    },
    subscribeToProjectsFile: function() {
      if (this.fileWatcher != null) {
        this.fileWatcher.close();
      }
      return this.fileWatcher = fs.watch(this.file(), (function(_this) {
        return function(event, filename) {
          return _this.loadCurrentProject();
        };
      })(this));
    },
    loadCurrentProject: function() {
      var CSON, _;
      CSON = require('season');
      _ = require('underscore-plus');
      return CSON.readFile(this.file(), (function(_this) {
        return function(error, data) {
          var project;
          if (!error) {
            project = _this.getCurrentProject(data);
            if (project) {
              if ((project.template != null) && (data[project.template] != null)) {
                project = _.deepExtend(project, data[project.template]);
              }
              if (project.settings != null) {
                return _this.enableSettings(project.settings);
              }
            }
          }
        };
      })(this));
    },
    getCurrentProject: function(projects) {
      var path, project, title, _i, _len, _ref;
      for (title in projects) {
        project = projects[title];
        _ref = project.paths;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          path = _ref[_i];
          if (path === atom.project.getPath()) {
            return project;
          }
        }
      }
      return false;
    },
    enableSettings: function(settings) {
      var projectSettings, setting, value, _;
      _ = require('underscore-plus');
      projectSettings = {};
      for (setting in settings) {
        value = settings[setting];
        _.setValueForKeyPath(projectSettings, setting, value);
        atom.config.settings = _.deepExtend(projectSettings, atom.config.settings);
      }
      return atom.config.emit('updated');
    },
    addProject: function(project) {
      var CSON, projects;
      CSON = require('season');
      projects = CSON.readFileSync(this.file()) || {};
      projects[project.title] = project;
      return CSON.writeFileSync(this.file(), projects);
    },
    openProject: function(_arg) {
      var devMode, options, paths, title;
      title = _arg.title, paths = _arg.paths, devMode = _arg.devMode;
      atom.open(options = {
        pathsToOpen: paths,
        devMode: devMode
      });
      if (atom.config.get('project-manager.closeCurrent')) {
        return setTimeout(function() {
          return atom.close();
        }, 200);
      }
    },
    createProjectManagerView: function(state) {
      var ProjectManagerView;
      if (this.projectManagerView == null) {
        ProjectManagerView = require('./project-manager-view');
        this.projectManagerView = new ProjectManagerView();
      }
      return this.projectManagerView;
    },
    createProjectManagerAddView: function(state) {
      var ProjectManagerAddView;
      if (this.projectManagerAddView == null) {
        ProjectManagerAddView = require('./project-manager-add-view');
        this.projectManagerAddView = new ProjectManagerAddView();
      }
      return this.projectManagerAddView;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLEVBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FBTCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsY0FBQSxFQUNFO0FBQUEsTUFBQSxRQUFBLEVBQVUsS0FBVjtBQUFBLE1BQ0EsWUFBQSxFQUFjLEtBRGQ7QUFBQSxNQUVBLFdBQUEsRUFBYSxLQUZiO0FBQUEsTUFHQSwyQkFBQSxFQUE2QixLQUg3QjtLQURGO0FBQUEsSUFNQSxrQkFBQSxFQUFvQixJQU5wQjtBQUFBLElBT0EscUJBQUEsRUFBdUIsSUFQdkI7QUFBQSxJQVNBLFFBQUEsRUFBVSxJQVRWO0FBQUEsSUFXQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixNQUFBLEVBQUUsQ0FBQyxNQUFILENBQVUsSUFBQyxDQUFBLElBQUQsQ0FBQSxDQUFWLEVBQW1CLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE1BQUQsR0FBQTtBQUNqQixVQUFBLElBQUEsQ0FBQSxNQUFBO21CQUNFLEVBQUUsQ0FBQyxTQUFILENBQWEsS0FBQyxDQUFBLElBQUQsQ0FBQSxDQUFiLEVBQXNCLElBQXRCLEVBQTRCLFNBQUMsS0FBRCxHQUFBO0FBQzFCLGNBQUEsSUFBRyxLQUFIO3VCQUNFLE9BQU8sQ0FBQyxHQUFSLENBQWEsMEJBQUEsR0FBeUIsQ0FBQSxJQUFDLENBQUEsSUFBRCxDQUFBLENBQUEsQ0FBekIsR0FBa0MsS0FBbEMsR0FBc0MsS0FBbkQsRUFERjtlQUQwQjtZQUFBLENBQTVCLEVBREY7V0FBQSxNQUFBO0FBS0UsWUFBQSxLQUFDLENBQUEsdUJBQUQsQ0FBQSxDQUFBLENBQUE7bUJBQ0EsS0FBQyxDQUFBLGtCQUFELENBQUEsRUFORjtXQURpQjtRQUFB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
//# sourceURL=/Users/sarah/.atom/packages/project-manager/lib/project-manager.coffee