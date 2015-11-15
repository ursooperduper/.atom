(function() {
  var CompositeDisposable, ProjectsAddView, ProjectsListView, Settings, fs,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require('fs');

  Settings = null;

  ProjectsListView = null;

  ProjectsAddView = null;

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
    filepath: null,
    subscriptions: null,
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      this.handleEvents();
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
    handleEvents: function(state) {
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'project-manager:toggle': (function(_this) {
          return function() {
            var projectsListView;
            if (ProjectsListView == null) {
              ProjectsListView = require('./project-manager-view');
            }
            projectsListView = new ProjectsListView();
            return projectsListView.toggle(_this);
          };
        })(this),
        'project-manager:save-project': (function(_this) {
          return function() {
            var projectsAddView;
            if (ProjectsAddView == null) {
              ProjectsAddView = require('./project-manager-add-view');
            }
            projectsAddView = new ProjectsAddView();
            return projectsAddView.toggle(_this);
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
      }));
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
              if (Settings == null) {
                Settings = require('./settings');
              }
              if (project.settings != null) {
                Settings.enable(project.settings);
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
    deactivate: function() {
      return this.subscriptions.dispose();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvcHJvamVjdC1tYW5hZ2VyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxvRUFBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsUUFBQSxHQUFXLElBRlgsQ0FBQTs7QUFBQSxFQUdBLGdCQUFBLEdBQW1CLElBSG5CLENBQUE7O0FBQUEsRUFJQSxlQUFBLEdBQWtCLElBSmxCLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO09BREY7QUFBQSxNQUlBLFlBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO0FBQUEsUUFFQSxXQUFBLEVBQ0UsaUZBSEY7T0FMRjtBQUFBLE1BV0EsMkJBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO09BWkY7QUFBQSxNQWVBLE1BQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFdBQUEsRUFBYSx3REFEYjtBQUFBLFFBRUEsU0FBQSxFQUFTLFNBRlQ7QUFBQSxRQUdBLE1BQUEsRUFBTSxDQUNKLFNBREksRUFFSixPQUZJLEVBR0osT0FISSxDQUhOO09BaEJGO0tBREY7QUFBQSxJQTBCQSxRQUFBLEVBQVUsSUExQlY7QUFB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

//# sourceURL=/Users/sarah/.atom/packages/project-manager/lib/project-manager.coffee
