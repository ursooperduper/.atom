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
            return _this.updateFile();
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
      var setting, value, _results;
      _results = [];
      for (setting in settings) {
        value = settings[setting];
        _results.push(atom.workspace.eachEditor(function(editor) {
          return editor[setting](value);
        }));
      }
      return _results;
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
      if (atom.config.get('project-manager.closeCurrent') || !atom.project.getPath()) {
        return atom.close();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLEVBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FBTCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsY0FBQSxFQUNFO0FBQUEsTUFBQSxRQUFBLEVBQVUsS0FBVjtBQUFBLE1BQ0EsWUFBQSxFQUFjLEtBRGQ7QUFBQSxNQUVBLFdBQUEsRUFBYSxLQUZiO0FBQUEsTUFHQSwyQkFBQSxFQUE2QixLQUg3QjtLQURGO0FBQUEsSUFNQSxrQkFBQSxFQUFvQixJQU5wQjtBQUFBLElBT0EscUJBQUEsRUFBdUIsSUFQdkI7QUFBQSxJQVNBLFFBQUEsRUFBVSxJQVRWO0FBQUEsSUFXQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixNQUFBLEVBQUUsQ0FBQyxNQUFILENBQVUsSUFBQyxDQUFBLElBQUQsQ0FBQSxDQUFWLEVBQW1CLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE1BQUQsR0FBQTtBQUNqQixVQUFBLElBQUEsQ0FBQSxNQUFBO21CQUNFLEVBQUUsQ0FBQyxTQUFILENBQWEsS0FBQyxDQUFBLElBQUQsQ0FBQSxDQUFiLEVBQXNCLElBQXRCLEVBQTRCLFNBQUMsS0FBRCxHQUFBO0FBQzFCLGNBQUEsSUFBRyxLQUFIO3VCQUNFLE9BQU8sQ0FBQyxHQUFSLENBQWEsMEJBQUEsR0FBeUIsQ0FBQSxJQUFDLENBQUEsSUFBRCxDQUFBLENBQUEsQ0FBekIsR0FBa0MsS0FBbEMsR0FBc0MsS0FBbkQsRUFERjtlQUQwQjtZQUFBLENBQTVCLEVBREY7V0FBQSxNQUFBO21CQUtFLEtBQUMsQ0FBQSxZQUFELENBQUEsRUFMRjtXQURpQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5CLENBQUEs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
//# sourceURL=/Users/sarah/.atom/packages/project-manager/lib/project-manager.coffee