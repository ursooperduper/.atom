(function() {
  var CSON, DB, Emitter, fs, path, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Emitter = require('atom').Emitter;

  CSON = require('season');

  fs = require('fs');

  path = require('path');

  _ = require('underscore-plus');

  module.exports = DB = (function() {
    DB.prototype.filepath = null;

    function DB(searchKey, searchValue) {
      this.searchKey = searchKey;
      this.searchValue = searchValue;
      this.subscribeToProjectsFile = __bind(this.subscribeToProjectsFile, this);
      this.lookForChanges = __bind(this.lookForChanges, this);
      this.find = __bind(this.find, this);
      this.emitter = new Emitter;
      fs.exists(this.file(), (function(_this) {
        return function(exists) {
          if (!exists) {
            return _this.writeFile({});
          } else {
            return _this.subscribeToProjectsFile();
          }
        };
      })(this));
    }

    DB.prototype.setSearchQuery = function(searchKey, searchValue) {
      this.searchKey = searchKey;
      this.searchValue = searchValue;
    };

    DB.prototype.find = function(callback) {
      return this.readFile((function(_this) {
        return function(results) {
          var found, key, project, projects, result;
          found = false;
          projects = [];
          for (key in results) {
            result = results[key];
            result._id = key;
            if ((result.template != null) && (results[result.template] != null)) {
              result = _.deepExtend(result, results[result.template]);
            }
            projects.push(result);
          }
          if (_this.searchKey && _this.searchValue) {
            for (key in projects) {
              project = projects[key];
              if (_.isEqual(project[_this.searchKey], _this.searchValue)) {
                found = project;
              }
            }
          } else {
            found = projects;
          }
          return typeof callback === "function" ? callback(found) : void 0;
        };
      })(this));
    };

    DB.prototype.add = function(props, callback) {
      return this.readFile((function(_this) {
        return function(projects) {
          var id;
          id = _this.generateID(props.title);
          projects[id] = props;
          return _this.writeFile(projects, function() {
            var _ref;
            if ((_ref = atom.notifications) != null) {
              _ref.addSuccess("" + props.title + " has been added");
            }
            return typeof callback === "function" ? callback(id) : void 0;
          });
        };
      })(this));
    };

    DB.prototype.update = function(props, callback) {
      if (!props._id) {
        return false;
      }
      return this.readFile((function(_this) {
        return function(projects) {
          var data, key;
          for (key in projects) {
            data = projects[key];
            if (key === props._id) {
              delete props._id;
              projects[key] = props;
            }
          }
          return _this.writeFile(projects, function() {
            return typeof callback === "function" ? callback() : void 0;
          });
        };
      })(this));
    };

    DB.prototype["delete"] = function(id, callback) {
      return this.readFile((function(_this) {
        return function(projects) {
          var data, key;
          for (key in projects) {
            data = projects[key];
            if (key === id) {
              delete projects[key];
            }
          }
          return _this.writeFile(projects, function() {
            return typeof callback === "function" ? callback() : void 0;
          });
        };
      })(this));
    };

    DB.prototype.onUpdate = function(callback) {
      return this.emitter.on('db-updated', (function(_this) {
        return function() {
          return _this.find(callback);
        };
      })(this));
    };

    DB.prototype.lookForChanges = function() {
      return atom.config.observe('project-manager.environmentSpecificProjects', (function(_this) {
        return function(newValue, obj) {
          var previous;
          if (obj == null) {
            obj = {};
          }
          previous = obj.previous != null ? obj.previous : newValue;
          if (newValue !== previous) {
            _this.subscribeToProjectsFile();
            return _this.updateFile();
          }
        };
      })(this));
    };

    DB.prototype.subscribeToProjectsFile = function() {
      var error, watchErrorUrl, _ref;
      if (this.fileWatcher != null) {
        this.fileWatcher.close();
      }
      try {
        return this.fileWatcher = fs.watch(this.file(), (function(_this) {
          return function(event, filename) {
            return _this.emitter.emit('db-updated');
          };
        })(this));
      } catch (_error) {
        error = _error;
        watchErrorUrl = 'https://github.com/atom/atom/blob/master/docs/build-instructions/linux.md#typeerror-unable-to-watch-path';
        return (_ref = atom.notifications) != null ? _ref.addError("<b>Project Manager</b><br>\nCould not watch for changes to `" + (path.basename(this.file())) + "`.\nMake sure you have permissions to `" + (this.file()) + "`. On linux there\ncan be problems with watch sizes. See <a href='" + watchErrorUrl + "'>\nthis document</a> for more info.", {
          dismissable: true
        }) : void 0;
      }
    };

    DB.prototype.updateFile = function() {
      return fs.exists(this.file(true), (function(_this) {
        return function(exists) {
          if (!exists) {
            return fs.writeFile(_this.file(), '{}', function(error) {
              var options, _ref;
              if (error) {
                return (_ref = atom.notifications) != null ? _ref.addError("Project Manager", options = {
                  details: "Could not create the file for storing projects"
                }) : void 0;
              }
            });
          }
        };
      })(this));
    };

    DB.prototype.generateID = function(string) {
      return string.replace(/\s+/g, '').toLowerCase();
    };

    DB.prototype.file = function(update) {
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
    };

    DB.prototype.readFile = function(callback) {
      return fs.exists(this.file(), (function(_this) {
        return function(exists) {
          var projects;
          if (exists) {
            projects = CSON.readFileSync(_this.file()) || {};
            return typeof callback === "function" ? callback(projects) : void 0;
          } else {
            return fs.writeFile(_this.file(), '{}', function(error) {
              return typeof callback === "function" ? callback({}) : void 0;
            });
          }
        };
      })(this));
    };

    DB.prototype.writeFile = function(projects, callback) {
      CSON.writeFileSync(this.file(), projects);
      return typeof callback === "function" ? callback() : void 0;
    };

    return DB;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvZGIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhCQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQyxVQUFXLE9BQUEsQ0FBUSxNQUFSLEVBQVgsT0FBRCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUZMLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FIUCxDQUFBOztBQUFBLEVBSUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUpKLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osaUJBQUEsUUFBQSxHQUFVLElBQVYsQ0FBQTs7QUFFYSxJQUFBLFlBQUUsU0FBRixFQUFjLFdBQWQsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFlBQUEsU0FDYixDQUFBO0FBQUEsTUFEd0IsSUFBQyxDQUFBLGNBQUEsV0FDekIsQ0FBQTtBQUFBLCtFQUFBLENBQUE7QUFBQSw2REFBQSxDQUFBO0FBQUEseUNBQUEsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUFBLENBQUEsT0FBWCxDQUFBO0FBQUEsTUFFQSxFQUFFLENBQUMsTUFBSCxDQUFVLElBQUMsQ0FBQSxJQUFELENBQUEsQ0FBVixFQUFtQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxNQUFELEdBQUE7QUFDakIsVUFBQSxJQUFBLENBQUEsTUFBQTttQkFDRSxLQUFDLENBQUEsU0FBRCxDQUFXLEVBQVgsRUFERjtXQUFBLE1BQUE7bUJBR0UsS0FBQyxDQUFBLHVCQUFELENBQUEsRUFI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

//# sourceURL=/Users/sarah/.atom/packages/project-manager/lib/db.coffee
