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
            return _this.loadSettings();
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
          return _this.editProjects();
        };
      })(this));
      atom.workspaceView.command('project-manager:reload-project-settings', (function(_this) {
        return function() {
          return _this.loadSettings();
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
      var PathWatcher, filePath;
      PathWatcher = require('pathwatcher');
      filePath = this.file();
      if (this.pathWatcher != null) {
        this.pathWatcher.close();
      }
      return this.pathWatcher = PathWatcher.watch(filePath, (function(_this) {
        return function(event, path) {
          return _this.loadSettings();
        };
      })(this));
    },
    loadSettings: function() {
      var CSON;
      CSON = require('season');
      return CSON.readFile(this.file(), (function(_this) {
        return function(error, data) {
          var path, project, title, _results;
          if (!error) {
            _results = [];
            for (title in data) {
              project = data[title];
              _results.push((function() {
                var _i, _len, _ref, _results1;
                _ref = project.paths;
                _results1 = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  path = _ref[_i];
                  if (path === atom.project.getPath()) {
                    if (project.settings != null) {
                      this.enableSettings(project.settings);
                    }
                    break;
                  } else {
                    _results1.push(void 0);
                  }
                }
                return _results1;
              }).call(_this));
            }
            return _results;
          }
        };
      })(this));
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
      var options, paths, title;
      title = _arg.title, paths = _arg.paths;
      atom.open(options = {
        pathsToOpen: paths
      });
      if (atom.config.get('project-manager.closeCurrent')) {
        return setTimeout(function() {
          return atom.close();
        }, 200);
      }
    },
    editProjects: function() {
      var config;
      config = {
        title: 'Config',
        paths: [this.file()]
      };
      return this.openProject(config);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLEVBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FBTCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsY0FBQSxFQUNFO0FBQUEsTUFBQSxRQUFBLEVBQVUsS0FBVjtBQUFBLE1BQ0EsWUFBQSxFQUFjLEtBRGQ7QUFBQSxNQUVBLFdBQUEsRUFBYSxLQUZiO0FBQUEsTUFHQSwyQkFBQSxFQUE2QixLQUg3QjtLQURGO0FBQUEsSUFNQSxrQkFBQSxFQUFvQixJQU5wQjtBQUFBLElBT0EscUJBQUEsRUFBdUIsSUFQdkI7QUFBQSxJQVNBLFFBQUEsRUFBVSxJQVRWO0FBQUEsSUFXQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixNQUFBLEVBQUUsQ0FBQyxNQUFILENBQVUsSUFBQyxDQUFBLElBQUQsQ0FBQSxDQUFWLEVBQW1CLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE1BQUQsR0FBQTtBQUNqQixVQUFBLElBQUEsQ0FBQSxNQUFBO21CQUNFLEVBQUUsQ0FBQyxTQUFILENBQWEsS0FBQyxDQUFBLElBQUQsQ0FBQSxDQUFiLEVBQXNCLElBQXRCLEVBQTRCLFNBQUMsS0FBRCxHQUFBO0FBQzFCLGNBQUEsSUFBRyxLQUFIO3VCQUNFLE9BQU8sQ0FBQyxHQUFSLENBQWEsMEJBQUEsR0FBeUIsQ0FBQSxJQUFDLENBQUEsSUFBRCxDQUFBLENBQUEsQ0FBekIsR0FBa0MsS0FBbEMsR0FBc0MsS0FBbkQsRUFERjtlQUQwQjtZQUFBLENBQTVCLEVBREY7V0FBQSxNQUFBO0FBS0UsWUFBQSxLQUFDLENBQUEsdUJBQUQsQ0FBQSxDQUFBLENBQUE7bUJBQ0EsS0FBQyxDQUFBLFlBQUQsQ0FBQSxFQU5GO1dBRGlCO1FBQUEs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
//# sourceURL=/Users/sarah/.atom/packages/project-manager/lib/project-manager.coffee