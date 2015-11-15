(function() {
  var fs,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fs = require('fs');

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
      atom.commands.add('atom-workspace', {
        'project-manager:toggle': (function(_this) {
          return function() {
            return _this.createProjectManagerView(state).toggle(_this);
          };
        })(this),
        'project-manager:save-project': (function(_this) {
          return function() {
            return _this.createProjectManagerAddView(state).toggle(_this);
          };
        })(this),
        'project-manager:edit-projects': (function(_this) {
          return function() {
            return atom.workspaceView.open(_this.file());
          };
        })(this),
        'project-manager:reload-project-settings': (function(_this) {
          return function() {
            return _this.loadCurrentProject();
          };
        })(this)
      });
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
    loadCurrentProject: function(done) {
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
                _this.enableSettings(project.settings);
              }
            }
          }
          return typeof done === "function" ? done() : void 0;
        };
      })(this));
    },
    getCurrentProject: function(projects) {
      var path, project, title, _i, _len, _ref;
      for (title in projects) {
        project = projects[title];
        if (project.paths == null) {
          continue;
        }
        _ref = project.paths;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          path = _ref[_i];
          if (__indexOf.call(atom.project.getPaths(), path) >= 0) {
            return project;
          }
        }
      }
      return false;
    },
    flattenSettings: function(root, dict, path) {
      var dotPath, isObject, key, value, _, _results;
      _ = require('underscore-plus');
      _results = [];
      for (key in dict) {
        value = dict[key];
        dotPath = key;
        if (path != null) {
          dotPath = "" + path + "." + key;
        }
        isObject = !_.isArray(value) && _.isObject(value);
        if (!isObject) {
          _results.push(root[dotPath] = value);
        } else {
          _results.push(this.flattenSettings(root, dict[key], dotPath));
        }
      }
      return _results;
    },
    enableSettings: function(settings) {
      var currentValue, flatSettings, setting, value, _;
      _ = require('underscore-plus');
      flatSettings = {};
      this.flattenSettings(flatSettings, settings);
      for (setting in flatSettings) {
        value = flatSettings[setting];
        if (_.isArray(value)) {
          currentValue = atom.config.get(setting);
          value = _.union(currentValue, value);
        }
        atom.config.setRawValue(setting, value);
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
    openProject: function(project) {
      var options;
      return atom.open(options = {
        pathsToOpen: project.paths,
        devMode: project.devMode
      });
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLEVBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUFMLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO09BREY7QUFBQSxNQUlBLFlBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO0FBQUEsUUFFQSxXQUFBLEVBQ0UsaUZBSEY7T0FMRjtBQUFBLE1BV0EsMkJBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO09BWkY7QUFBQSxNQWVBLE1BQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFdBQUEsRUFBYSx3REFEYjtBQUFBLFFBRUEsU0FBQSxFQUFTLFNBRlQ7QUFBQSxRQUdBLE1BQUEsRUFBTSxDQUNKLFNBREksRUFFSixPQUZJLEVBR0osT0FISSxDQUhOO09BaEJGO0tBREY7QUFBQSxJQTBCQSxrQkFBQSxFQUFvQixJQTFCcEI7QUFBQSxJQTJCQSxxQkFBQSxFQUF1QixJQTNCdkI7QUFBQSxJQTZCQSxRQUFBLEVBQVUsSUE3QlY7QUFBQSxJQStCQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixNQUFBLEVBQUUsQ0FBQyxNQUFILENBQVUsSUFBQyxDQUFBLElBQUQsQ0FBQSxDQUFWLEVBQW1CLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE1BQUQsR0FBQTtBQUNqQixVQUFBLElBQUEsQ0FBQSxNQUFB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
//# sourceURL=/Users/sarah/.atom/packages/project-manager/lib/project-manager.coffee