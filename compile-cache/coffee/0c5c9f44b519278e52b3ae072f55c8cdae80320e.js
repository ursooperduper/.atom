(function() {
  var fs;

  fs = require('fs');

  module.exports = {
    config: {
      showPath: {
        type: 'boolean',
        "default": true
      },
      closeCurrent: {
        type: 'boolean',
        "default": false
      },
      environmentSpecificProjects: {
        type: 'boolean',
        "default": false
      },
      sortBy: {
        type: 'string',
        description: 'Default sorting is the order in which the projects are',
        "default": 'default',
        "enum": ['default', 'title']
      }
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLEVBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FBTCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxRQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtPQURGO0FBQUEsTUFJQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtPQUxGO0FBQUEsTUFRQSwyQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7T0FURjtBQUFBLE1BWUEsTUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsV0FBQSxFQUFhLHdEQURiO0FBQUEsUUFFQSxTQUFBLEVBQVMsU0FGVDtBQUFBLFFBR0EsTUFBQSxFQUFNLENBQ0osU0FESSxFQUVKLE9BRkksQ0FITjtPQWJGO0tBREY7QUFBQSxJQXNCQSxrQkFBQSxFQUFvQixJQXRCcEI7QUFBQSxJQXVCQSxxQkFBQSxFQUF1QixJQXZCdkI7QUFBQSxJQXlCQSxRQUFBLEVBQVUsSUF6QlY7QUFBQSxJQTJCQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixNQUFBLEVBQUUsQ0FBQyxNQUFILENBQVUsSUFBQyxDQUFBLElBQUQsQ0FBQSxDQUFWLEVBQW1CLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE1BQUQsR0FBQTtBQUNqQixVQUFBLElBQUEsQ0FBQSxNQUFBO21CQUNFLEVBQUUsQ0FBQyxTQUFILENBQWEsS0FBQyxDQUFBLElBQUQsQ0FBQSxD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
//# sourceURL=/Users/sarah/.atom/packages/project-manager/lib/project-manager.coffee