(function() {
  var DB, Emitter, Project, Settings, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Emitter = require('atom').Emitter;

  _ = require('underscore-plus');

  Settings = require('./settings');

  DB = require('./db');

  module.exports = Project = (function() {
    Project.prototype.requiredProperties = ['title', 'paths'];

    Project.prototype.db = null;

    Project.prototype.projectSettings = null;

    function Project(props) {
      this.props = props != null ? props : {};
      this.save = __bind(this.save, this);
      this.isCurrent = __bind(this.isCurrent, this);
      this.lookForUpdates = __bind(this.lookForUpdates, this);
      this.set = __bind(this.set, this);
      this.emitter = new Emitter;
      this.db = new DB();
      this.updateProps(this.props);
      this.lookForUpdates();
    }

    Project.prototype.updateProps = function(props) {
      var key, value;
      this.propsToSave = [];
      for (key in props) {
        value = props[key];
        if (__indexOf.call(this.propsToSave, key) < 0) {
          this.propsToSave.push(key);
        }
      }
      return this.props = _.deepExtend(this.getDefaultProps(), props);
    };

    Project.prototype.getDefaultProps = function() {
      var props;
      return props = {
        title: '',
        paths: [],
        icon: 'icon-chevron-right',
        settings: {},
        group: null,
        devMode: false,
        template: null
      };
    };

    Project.prototype.set = function(key, value) {
      this.props[key] = value;
      if (__indexOf.call(this.propsToSave, key) < 0) {
        this.propsToSave.push(key);
      }
      return this.save();
    };

    Project.prototype.unset = function(key) {
      var defaults;
      defaults = this.getDefaultProps();
      delete this.props[key];
      this.propsToSave = _.without(this.propsToSave, key);
      if (defaults[key] != null) {
        this.props[key] = defaults[key];
      }
      return this.save();
    };

    Project.prototype.lookForUpdates = function() {
      if (this.props._id != null) {
        this.db.setSearchQuery('_id', this.props._id);
        return this.db.onUpdate((function(_this) {
          return function(props) {
            var updatedProps;
            if (props) {
              updatedProps = _.deepExtend(_this.getDefaultProps(), props);
              if (!_.isEqual(_this.props, updatedProps)) {
                _this.updateProps(props);
                _this.emitter.emit('updated');
                if (_this.isCurrent()) {
                  return _this.load();
                }
              }
            } else {
              _this.db.setSearchQuery('paths', _this.props.paths);
              return _this.db.find(function(props) {
                _this.updateProps(props);
                _this.db.setSearchQuery('_id', _this.props._id);
                _this.emitter.emit('updated');
                if (_this.isCurrent()) {
                  return _this.load();
                }
              });
            }
          };
        })(this));
      }
    };

    Project.prototype.isCurrent = function() {
      var activePath, projectPath;
      activePath = atom.project.getPaths()[0];
      projectPath = this.props.paths[0];
      if (activePath === projectPath) {
        return true;
      }
      return false;
    };

    Project.prototype.isValid = function() {
      var key, valid, _i, _len, _ref;
      valid = true;
      _ref = this.requiredProperties;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        if (!this.props[key] || !this.props[key].length) {
          valid = false;
        }
      }
      return valid;
    };

    Project.prototype.load = function() {
      if (this.isCurrent()) {
        if (this.projectSettings == null) {
          this.projectSettings = new Settings();
        }
        return this.projectSettings.load(this.props.settings);
      }
    };

    Project.prototype.save = function() {
      var key, props, value, _i, _len, _ref;
      if (this.isValid()) {
        if (this.db == null) {
          this.db = new DB();
        }
        props = {};
        _ref = this.propsToSave;
        for (value = _i = 0, _len = _ref.length; _i < _len; value = ++_i) {
          key = _ref[value];
          props[key] = this.props[key];
        }
        if (this.props._id) {
          this.db.update(props);
        } else {
          this.db.add(props, (function(_this) {
            return function(id) {
              _this.props._id = id;
              return _this.lookForUpdates();
            };
          })(this));
        }
        return true;
      } else {
        return false;
      }
    };

    Project.prototype.remove = function() {
      var removed;
      if (this.db == null) {
        this.db = new DB();
      }
      return removed = this.db["delete"](this.props._id);
    };

    Project.prototype.open = function() {
      var options;
      return atom.open(options = {
        pathsToOpen: this.props.paths,
        devMode: this.props.devMode
      });
    };

    Project.prototype.onUpdate = function(callback) {
      return this.emitter.on('updated', function() {
        return callback();
      });
    };

    return Project;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvcHJvamVjdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsaUNBQUE7SUFBQTt5SkFBQTs7QUFBQSxFQUFDLFVBQVcsT0FBQSxDQUFRLE1BQVIsRUFBWCxPQUFELENBQUE7O0FBQUEsRUFDQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBREosQ0FBQTs7QUFBQSxFQUVBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUixDQUZYLENBQUE7O0FBQUEsRUFHQSxFQUFBLEdBQUssT0FBQSxDQUFRLE1BQVIsQ0FITCxDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHNCQUFBLGtCQUFBLEdBQW9CLENBQUMsT0FBRCxFQUFVLE9BQVYsQ0FBcEIsQ0FBQTs7QUFBQSxzQkFDQSxFQUFBLEdBQUksSUFESixDQUFBOztBQUFBLHNCQUVBLGVBQUEsR0FBaUIsSUFGakIsQ0FBQTs7QUFJYSxJQUFBLGlCQUFFLEtBQUYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLHdCQUFBLFFBQU0sRUFDbkIsQ0FBQTtBQUFBLHlDQUFBLENBQUE7QUFBQSxtREFBQSxDQUFBO0FBQUEsNkRBQUEsQ0FBQTtBQUFBLHVDQUFBLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FBQSxDQUFBLE9BQVgsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLEVBQUQsR0FBVSxJQUFBLEVBQUEsQ0FBQSxDQURWLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxXQUFELENBQWEsSUFBQyxDQUFBLEtBQWQsQ0FGQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsY0FBRCxDQUFBLENBSEEsQ0FEVztJQUFBLENBSmI7O0FBQUEsc0JBVUEsV0FBQSxH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

//# sourceURL=/Users/sarah/.atom/packages/project-manager/lib/project.coffee
