(function() {
  var ProjectManagerAddView, ProjectManagerView, fs,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fs = require('fs');

  ProjectManagerAddView = require('./project-manager-add-view');

  ProjectManagerView = require('./project-manager-view');

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
            return atom.workspace.open(_this.file());
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
      if (this.projectManagerView == null) {
        this.projectManagerView = new ProjectManagerView();
      }
      return this.projectManagerView;
    },
    createProjectManagerAddView: function(state) {
      if (this.projectManagerAddView == null) {
        this.projectManagerAddView = new ProjectManagerAddView();
      }
      return this.projectManagerAddView;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZDQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EscUJBQUEsR0FBd0IsT0FBQSxDQUFRLDRCQUFSLENBRHhCLENBQUE7O0FBQUEsRUFFQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsd0JBQVIsQ0FGckIsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7T0FERjtBQUFBLE1BSUEsWUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7QUFBQSxRQUVBLFdBQUEsRUFDRSxpRkFIRjtPQUxGO0FBQUEsTUFXQSwyQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7T0FaRjtBQUFBLE1BZUEsTUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsV0FBQSxFQUFhLHdEQURiO0FBQUEsUUFFQSxTQUFBLEVBQVMsU0FGVDtBQUFBLFFBR0EsTUFBQSxFQUFNLENBQ0osU0FESSxFQUVKLE9BRkksRUFHSixPQUhJLENBSE47T0FoQkY7S0FERjtBQUFBLElBMEJBLGtCQUFBLEVBQW9CLElBMUJwQjtBQUFBLElBMkJBLHFCQUFBLEVBQXVCLElBM0J2QjtBQUFBLElBNkJBLFFBQUEsRUFBVSxJQTdCVjtBQUFBLElBK0JBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLE1BQUEsRUFBRSxDQUFDLE1BQUgs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
//# sourceURL=/Users/sarah/.atom/packages/project-manager/lib/project-manager.coffee