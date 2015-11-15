Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _underscorePlus = require('underscore-plus');

var _underscorePlus2 = _interopRequireDefault(_underscorePlus);

var _settings = require('./settings');

var _settings2 = _interopRequireDefault(_settings);

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

'use babel';

var Project = (function () {
  function Project() {
    var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Project);

    this.props = {};
    this.emitter = new _atom.Emitter();
    this.db = new _db2['default']();
    this.updateProps(props);
    this.lookForUpdates();
  }

  _createClass(Project, [{
    key: 'updateProps',
    value: function updateProps(props) {
      this.props = _underscorePlus2['default'].deepExtend(this.defaultProps, props);
    }
  }, {
    key: 'getPropsToSave',
    value: function getPropsToSave() {
      var saveProps = {};
      var value = undefined;
      var key = undefined;
      for (key in this.props) {
        value = this.props[key];
        if (!this.isDefaultProp(key, value)) {
          saveProps[key] = value;
        }
      }

      return saveProps;
    }
  }, {
    key: 'isDefaultProp',
    value: function isDefaultProp(key, value) {
      if (!this.defaultProps.hasOwnProperty(key)) {
        return false;
      }

      if (this.defaultProps[key] === value) {
        return true;
      }

      return false;
    }
  }, {
    key: 'set',
    value: function set(key, value) {
      if (typeof key === 'object') {
        for (var i in key) {
          value = key[i];
          this.props[i] = value;
        }

        this.save();
      } else {
        this.props[key] = value;
        this.save();
      }
    }
  }, {
    key: 'unset',
    value: function unset(key) {
      if (_underscorePlus2['default'].has(this.defaultProps, key)) {
        this.props[key] = this.defaultProps[key];
      } else {
        this.props[key] = null;
      }

      this.save();
    }
  }, {
    key: 'lookForUpdates',
    value: function lookForUpdates() {
      var _this = this;

      if (this.props._id) {
        this.db.setSearchQuery('_id', this.props._id);
        this.db.onUpdate(function (props) {
          if (props) {
            var updatedProps = _underscorePlus2['default'].deepExtend(_this.defaultProps, props);
            if (!_underscorePlus2['default'].isEqual(_this.props, updatedProps)) {
              _this.updateProps(props);
              _this.emitter.emit('updated');
              if (_this.isCurrent()) {
                _this.load();
              }
            }
          } else {
            _this.db.setSearchQuery('paths', _this.props.paths);
            _this.db.find(function (props) {
              _this.updateProps(props);
              _this.db.setSearchQuery('_id', _this.props._id);
              _this.emitter.emit('updated');
              if (_this.isCurrent()) {
                _this.load();
              }
            });
          }
        });
      }
    }
  }, {
    key: 'isCurrent',
    value: function isCurrent() {
      var activePath = atom.project.getPaths()[0];
      var mainPath = this.props.paths[0];
      if (activePath === mainPath) {
        return true;
      }

      return false;
    }
  }, {
    key: 'isValid',
    value: function isValid() {
      var _this2 = this;

      var valid = true;
      this.requiredProperties.forEach(function (key) {
        if (!_this2.props[key] || !_this2.props[key].length) {
          valid = false;
        }
      });

      return valid;
    }
  }, {
    key: 'load',
    value: function load() {
      if (this.isCurrent()) {
        var projectSettings = new _settings2['default']();
        projectSettings.load(this.props.settings);
      }
    }
  }, {
    key: 'save',
    value: function save() {
      var _this3 = this;

      if (this.isValid()) {
        if (this.props._id) {
          this.db.update(this.getPropsToSave());
        } else {
          this.db.add(this.getPropsToSave(), function (id) {
            _this3.props._id = id;
            _this3.lookForUpdates();
          });
        }

        return true;
      }

      return false;
    }
  }, {
    key: 'remove',
    value: function remove() {
      this.db['delete'](this.props._id);
    }
  }, {
    key: 'open',
    value: function open() {
      atom.open({
        pathsToOpen: this.props.paths,
        devMode: this.props.devMode
      });
    }
  }, {
    key: 'onUpdate',
    value: function onUpdate(callback) {
      this.emitter.on('updated', function () {
        return callback();
      });
    }
  }, {
    key: 'requiredProperties',
    get: function get() {
      return ['title', 'paths'];
    }
  }, {
    key: 'defaultProps',
    get: function get() {
      return {
        title: '',
        paths: [],
        icon: 'icon-chevron-right',
        settings: undefined,
        group: null,
        devMode: false,
        template: null
      };
    }
  }]);

  return Project;
})();

exports['default'] = Project;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYXJhaC8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL3Byb2plY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFc0IsTUFBTTs7OEJBQ2QsaUJBQWlCOzs7O3dCQUNWLFlBQVk7Ozs7a0JBQ2xCLE1BQU07Ozs7QUFMckIsV0FBVyxDQUFDOztJQU9TLE9BQU87QUFFZixXQUZRLE9BQU8sR0FFSjtRQUFWLEtBQUsseURBQUMsRUFBRTs7MEJBRkQsT0FBTzs7QUFHeEIsUUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDaEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFDO0FBQzdCLFFBQUksQ0FBQyxFQUFFLEdBQUcscUJBQVEsQ0FBQztBQUNuQixRQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3hCLFFBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztHQUN2Qjs7ZUFSa0IsT0FBTzs7V0EwQmYscUJBQUMsS0FBSyxFQUFFO0FBQ2pCLFVBQUksQ0FBQyxLQUFLLEdBQUcsNEJBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDckQ7OztXQUVhLDBCQUFHO0FBQ2YsVUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ25CLFVBQUksS0FBSyxZQUFBLENBQUM7QUFDVixVQUFJLEdBQUcsWUFBQSxDQUFDO0FBQ1IsV0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUN0QixhQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN4QixZQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUU7QUFDbkMsbUJBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7U0FDeEI7T0FDRjs7QUFFRCxhQUFPLFNBQVMsQ0FBQztLQUNsQjs7O1dBRVksdUJB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OztBQUVELGFBQU8sS0FBSyxDQUFDO0tBQ2Q7OztXQUVLLGtCQUFHO0FBQ1AsVUFBSSxDQUFDLEVBQUUsVUFBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDaEM7OztXQUVHLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLElBQUksQ0FBQztBQUNSLG1CQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLO0FBQzdCLGVBQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU87T0FDNUIsQ0FBQyxDQUFDO0tBQ0o7OztXQUVPLGtCQUFDLFFBQVEsRUFBRTtBQUNqQixVQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUU7ZUFBTSxRQUFRLEVBQUU7T0FBQSxDQUFDLENBQUM7S0FDOUM7OztTQTVKcUIsZUFBRztBQUN2QixhQUFPLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQzNCOzs7U0FFZSxlQUFHO0FBQ2pCLGFBQU87QUFDTCxhQUFLLEVBQUUsRUFBRTtBQUNULGFBQUssRUFBRSxFQUFFO0FBQ1QsWUFBSSxFQUFFLG9CQUFvQjtBQUMxQixnQkFBUSxFQUFFLFNBQVM7QUFDbkIsYUFBSyxFQUFFLElBQUk7QUFDWCxlQUFPLEVBQUUsS0FBSztBQUNkLGdCQUFRLEVBQUUsSUFBSTtPQUNmLENBQUM7S0FDSDs7O1NBeEJrQixPQUFPOzs7cUJBQVAsT0FBTyIsImZpbGUiOiIvVXNlcnMvc2FyYWgvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL2xpYi9wcm9qZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7RW1pdHRlcn0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlLXBsdXMnO1xuaW1wb3J0IFNldHRpbmdzIGZyb20gJy4vc2V0dGluZ3MnO1xuaW1wb3J0IERCIGZyb20gJy4vZGInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcm9qZWN0IHtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcz17fSkge1xuICAgIHRoaXMucHJvcHMgPSB7fTtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuICAgIHRoaXMuZGIgPSBuZXcgREIoKTtcbiAgICB0aGlzLnVwZGF0ZVByb3BzKHByb3BzKTtcbiAgICB0aGlzLmxvb2tGb3JVcGRhdGVzKCk7XG4gIH1cblxuICBnZXQgcmVxdWlyZWRQcm9wZXJ0aWVzKCkge1xuICAgIHJldHVybiBbJ3RpdGxlJywgJ3BhdGhzJ107XG4gIH1cblxuICBnZXQgZGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICB0aXRsZTogJycsXG4gICAgICBwYXRoczogW10sXG4gICAgICBpY29uOiAnaWNvbi1jaGV2cm9uLXJpZ2h0JyxcbiAgICAgIHNldHRpbmdzOiB1bmRlZmluZWQsXG4gICAgICBncm91cDogbnVsbCxcbiAgICAgIGRldk1vZGU6IGZhbHNlLFxuICAgICAgdGVtcGxhdGU6IG51bGxcbiAgICB9O1xuICB9XG5cbiAgdXBkYXRlUHJvcHMocHJvcHMpIHtcbiAgICB0aGlzLnByb3BzID0gXy5kZWVwRXh0ZW5kKHRoaXMuZGVmYXVsdFByb3BzLCBwcm9wcyk7XG4gIH1cblxuICBnZXRQcm9wc1RvU2F2ZSgpIHtcbiAgICBsZXQgc2F2ZVByb3BzID0ge307XG4gICAgbGV0IHZhbHVlO1xuICAgIGxldCBrZXk7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5wcm9wcykge1xuICAgICAgdmFsdWUgPSB0aGlzLnByb3BzW2tleV07XG4gICAgICBpZiAoIXRoaXMuaXNEZWZhdWx0UHJvcChrZXksIHZhbHVlKSkge1xuICAgICAgICBzYXZlUHJvcHNba2V5XSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzYXZlUHJvcHM7XG4gIH1cblxuICBpc0RlZmF1bHRQcm9wKGtleSwgdmFsdWUpIHtcbiAgICBpZiAoIXRoaXMuZGVmYXVsdFByb3BzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kZWZhdWx0UHJvcHNba2V5XSA9PT0gdmFsdWUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHNldChrZXksIHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiBrZXkgPT09ICdvYmplY3QnKSB7XG4gICAgICBmb3IgKGxldCBpIGluIGtleSkge1xuICAgICAgICB2YWx1ZSA9IGtleVtpXTtcbiAgICAgICAgdGhpcy5wcm9wc1tpXSA9IHZhbHVlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNhdmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wcm9wc1trZXldID0gdmFsdWU7XG4gICAgICB0aGlzLnNhdmUoKTtcbiAgICB9XG4gIH1cblxuICB1bnNldChrZXkpIHtcbiAgICBpZiAoXy5oYXModGhpcy5kZWZhdWx0UHJvcHMsIGtleSkpIHtcbiAgICAgIHRoaXMucHJvcHNba2V5XSA9IHRoaXMuZGVmYXVsdFByb3BzW2tleV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHJvcHNba2V5XSA9IG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5zYXZlKCk7XG4gIH1cblxuICBsb29rRm9yVXBkYXRlcygpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5faWQpIHtcbiAgICAgIHRoaXMuZGIuc2V0U2VhcmNoUXVlcnkoJ19pZCcsIHRoaXMucHJvcHMuX2lkKTtcbiAgICAgIHRoaXMuZGIub25VcGRhdGUoKHByb3BzKSA9PiB7XG4gICAgICAgIGlmIChwcm9wcykge1xuICAgICAgICAgIGNvbnN0IHVwZGF0ZWRQcm9wcyA9IF8uZGVlcEV4dGVuZCh0aGlzLmRlZmF1bHRQcm9wcywgcHJvcHMpO1xuICAgICAgICAgIGlmICghXy5pc0VxdWFsKHRoaXMucHJvcHMsIHVwZGF0ZWRQcm9wcykpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUHJvcHMocHJvcHMpO1xuICAgICAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3VwZGF0ZWQnKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzQ3VycmVudCgpKSB7XG4gICAgICAgICAgICAgIHRoaXMubG9hZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmRiLnNldFNlYXJjaFF1ZXJ5KCdwYXRocycsIHRoaXMucHJvcHMucGF0aHMpO1xuICAgICAgICAgIHRoaXMuZGIuZmluZCgocHJvcHMpID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUHJvcHMocHJvcHMpO1xuICAgICAgICAgICAgdGhpcy5kYi5zZXRTZWFyY2hRdWVyeSgnX2lkJywgdGhpcy5wcm9wcy5faWQpO1xuICAgICAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3VwZGF0ZWQnKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzQ3VycmVudCgpKSB7XG4gICAgICAgICAgICAgIHRoaXMubG9hZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBpc0N1cnJlbnQoKSB7XG4gICAgY29uc3QgYWN0aXZlUGF0aCA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdO1xuICAgIGNvbnN0IG1haW5QYXRoID0gdGhpcy5wcm9wcy5wYXRoc1swXTtcbiAgICBpZiAoYWN0aXZlUGF0aCA9PT0gbWFpblBhdGgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlzVmFsaWQoKSB7XG4gICAgbGV0IHZhbGlkID0gdHJ1ZTtcbiAgICB0aGlzLnJlcXVpcmVkUHJvcGVydGllcy5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBpZiAoIXRoaXMucHJvcHNba2V5XSB8fCAhdGhpcy5wcm9wc1trZXldLmxlbmd0aCkge1xuICAgICAgICB2YWxpZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHZhbGlkO1xuICB9XG5cbiAgbG9hZCgpIHtcbiAgICBpZiAodGhpcy5pc0N1cnJlbnQoKSkge1xuICAgICAgbGV0IHByb2plY3RTZXR0aW5ncyA9IG5ldyBTZXR0aW5ncygpO1xuICAgICAgcHJvamVjdFNldHRpbmdzLmxvYWQodGhpcy5wcm9wcy5zZXR0aW5ncyk7XG4gICAgfVxuICB9XG5cbiAgc2F2ZSgpIHtcbiAgICBpZiAodGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgIGlmICh0aGlzLnByb3BzLl9pZCkge1xuICAgICAgICB0aGlzLmRiLnVwZGF0ZSh0aGlzLmdldFByb3BzVG9TYXZlKCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kYi5hZGQodGhpcy5nZXRQcm9wc1RvU2F2ZSgpLCBpZCA9PiB7XG4gICAgICAgICAgdGhpcy5wcm9wcy5faWQgPSBpZDtcbiAgICAgICAgICB0aGlzLmxvb2tGb3JVcGRhdGVzKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZW1vdmUoKSB7XG4gICAgdGhpcy5kYi5kZWxldGUodGhpcy5wcm9wcy5faWQpO1xuICB9XG5cbiAgb3BlbigpIHtcbiAgICBhdG9tLm9wZW4oe1xuICAgICAgcGF0aHNUb09wZW46IHRoaXMucHJvcHMucGF0aHMsXG4gICAgICBkZXZNb2RlOiB0aGlzLnByb3BzLmRldk1vZGVcbiAgICB9KTtcbiAgfVxuXG4gIG9uVXBkYXRlKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5lbWl0dGVyLm9uKCd1cGRhdGVkJywgKCkgPT4gY2FsbGJhY2soKSk7XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/sarah/.atom/packages/project-manager/lib/project.js
