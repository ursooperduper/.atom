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
          return atom.workspaceView.open(_this.file());
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
      if (this.fileWatcher != null) {
        this.fileWatcher.close();
      }
      return this.fileWatcher = fs.watch(this.file(), (function(_this) {
        return function(event, filename) {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLEVBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FBTCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsY0FBQSxFQUNFO0FBQUEsTUFBQSxRQUFBLEVBQVUsS0FBVjtBQUFBLE1BQ0EsWUFBQSxFQUFjLEtBRGQ7QUFBQSxNQUVBLFdBQUEsRUFBYSxLQUZiO0FBQUEsTUFHQSwyQkFBQSxFQUE2QixLQUg3QjtLQURGO0FBQUEsSUFNQSxrQkFBQSxFQUFvQixJQU5wQjtBQUFBLElBT0EscUJBQUEsRUFBdUIsSUFQdkI7QUFBQSxJQVNBLFFBQUEsRUFBVSxJQVRWO0FBQUEsSUFXQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixNQUFBLEVBQUUsQ0FBQyxNQUFILENBQVUsSUFBQyxDQUFBLElBQUQsQ0FBQSxDQUFWLEVBQW1CLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE1BQUQsR0FBQTtBQUNqQixVQUFBLElBQUEsQ0FBQSxNQUFBO21CQUNFLEVBQUUsQ0FBQyxTQUFILENBQWEsS0FBQyxDQUFBLElBQUQsQ0FBQSxDQUFiLEVBQXNCLElBQXRCLEVBQTRCLFNBQUMsS0FBRCxHQUFBO0FBQzFCLGNBQUEsSUFBRyxLQUFIO3VCQUNFLE9BQU8sQ0FBQyxHQUFSLENBQWEsMEJBQUEsR0FBeUIsQ0FBQSxJQUFDLENBQUEsSUFBRCxDQUFBLENBQUEsQ0FBekIsR0FBa0MsS0FBbEMsR0FBc0MsS0FBbkQsRUFERjtlQUQwQjtZQUFBLENBQTVCLEVBREY7V0FBQSxNQUFBO0FBS0UsWUFBQSxLQUFDLENBQUEsdUJBQUQsQ0FBQSxDQUFBLENBQUE7bUJBQ0EsS0FBQyxDQUFBLFlBQUQsQ0FBQSxFQU5GO1dBRGlCO1FBQUEs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
//# sourceURL=/Users/sarah/.atom/packages/project-manager/lib/project-manager.coffee