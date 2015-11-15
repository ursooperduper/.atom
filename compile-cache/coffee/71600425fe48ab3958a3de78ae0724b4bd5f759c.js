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
              var options, _ref;
              if (error) {
                return (_ref = atom.notifications) != null ? _ref.addError("Project Manager", options = {
                  details: "Could not create " + (this.file())
                }) : void 0;
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
              var options, _ref;
              if (error) {
                return (_ref = atom.notifications) != null ? _ref.addError("Project Manager", options = {
                  details: "Could not create " + (this.file())
                }) : void 0;
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
      var CSON, errorMessage, projects, successMessage;
      CSON = require('season');
      projects = CSON.readFileSync(this.file()) || {};
      projects[project.title] = project;
      successMessage = "" + project.title + " has been added";
      errorMessage = "" + project.title + " could not be saved to " + (this.file());
      return CSON.writeFile(this.file(), projects, function(err) {
        var _ref, _ref1;
        if (!err) {
          return (_ref = atom.notifications) != null ? _ref.addSuccess(successMessage) : void 0;
        } else {
          return (_ref1 = atom.notifications) != null ? _ref1.addError(errorMessage) : void 0;
        }
      });
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