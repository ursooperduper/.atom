Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _season = require('season');

var _season2 = _interopRequireDefault(_season);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _underscorePlus = require('underscore-plus');

var _underscorePlus2 = _interopRequireDefault(_underscorePlus);

'use babel';

var DB = (function () {
  function DB() {
    var _this = this;

    var searchKey = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
    var searchValue = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    _classCallCheck(this, DB);

    this.setSearchQuery(searchKey, searchValue);
    this.emitter = new _atom.Emitter();

    _fs2['default'].exists(this.file(), function (exists) {
      if (exists) {
        _this.observeProjects();
      } else {
        _this.writeFile({});
      }
    });
  }

  _createClass(DB, [{
    key: 'setSearchQuery',
    value: function setSearchQuery() {
      var searchKey = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
      var searchValue = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      this.searchKey = searchKey;
      this.searchValue = searchValue;
    }
  }, {
    key: 'find',
    value: function find(callback) {
      var _this2 = this;

      this.readFile(function (results) {
        var found = false;
        var projects = [];
        var project = null;
        var result = null;
        var template = null;
        var key = undefined;

        for (key in results) {
          result = results[key];
          template = result.template || null;
          result._id = key;

          if (template && results[template] !== null) {
            result = _underscorePlus2['default'].deepExtend(result, results[template]);
          }

          projects.push(result);
        }

        if (_this2.searchKey && _this2.searchValue) {
          for (key in projects) {
            project = projects[key];
            if (_underscorePlus2['default'].isEqual(project[_this2.searchKey], _this2.searchValue)) {
              found = project;
            }
          }
        } else {
          found = projects;
        }

        callback(found);
      });
    }
  }, {
    key: 'add',
    value: function add(props, callback) {
      var _this3 = this;

      this.readFile(function (projects) {
        var id = _this3.generateID(props.title);
        projects[id] = props;

        _this3.writeFile(projects, function () {
          atom.notifications.addSuccess(props.title + ' has been added');
          callback(id);
        });
      });
    }
  }, {
    key: 'update',
    value: function update(props) {
      var _this4 = this;

      if (!props._id) {
        return false;
      }

      var project = null;
      var key = undefined;
      this.readFile(function (projects) {
        for (key in projects) {
          project = projects[key];
          if (key === props._id) {
            delete props._id;
            projects[key] = props;
          }

          _this4.writeFile(projects);
        }
      });
    }
  }, {
    key: 'delete',
    value: function _delete(id, callback) {
      var _this5 = this;

      this.readFile(function (projects) {
        for (var key in projects) {
          if (key === id) {
            delete projects[key];
          }
        }

        _this5.writeFile(projects, function () {
          if (callback) {
            callback();
          }
        });
      });
    }
  }, {
    key: 'onUpdate',
    value: function onUpdate(callback) {
      var _this6 = this;

      this.emitter.on('db-updated', function () {
        _this6.find(callback);
      });
    }
  }, {
    key: 'observeProjects',
    value: function observeProjects() {
      var _this7 = this;

      if (this.fileWatcher) {
        this.fileWatcher.close();
      }

      try {
        this.fileWatcher = _fs2['default'].watch(this.file(), function () {
          _this7.emitter.emit('db-updated');
        });
      } catch (error) {
        var url = 'https://github.com/atom/atom/blob/master/docs/';
        url += 'build-instructions/linux.md#typeerror-unable-to-watch-path';
        var filename = _path2['default'].basename(this.file());
        var errorMessage = '<b>Project Manager</b><br>Could not watch changes\n        to ' + filename + '. Make sure you have permissions to ' + this.file() + '.\n        On linux there can be problems with watch sizes.\n        See <a href=\'' + url + '\'> this document</a> for more info.>';
        this.notifyFailure(errorMessage);
      }
    }
  }, {
    key: 'updateFile',
    value: function updateFile() {
      var _this8 = this;

      _fs2['default'].exists(this.file(true), function (exists) {
        if (!exists) {
          _this8.writeFile({});
        }
      });
    }
  }, {
    key: 'generateID',
    value: function generateID(string) {
      return string.replace(/\s+/g, '').toLowerCase();
    }
  }, {
    key: 'file',
    value: function file() {
      var filename = 'projects.cson';
      var filedir = atom.getConfigDirPath();

      if (this.environmentSpecificProjects) {
        var hostname = _os2['default'].hostname().split('.').shift().toLowerCase();
        filename = 'projects.' + hostname + '.cson';
      }

      return filedir + '/' + filename;
    }
  }, {
    key: 'readFile',
    value: function readFile(callback) {
      var _this9 = this;

      _fs2['default'].exists(this.file(), function (exists) {
        if (exists) {
          try {
            var projects = _season2['default'].readFileSync(_this9.file()) || {};
            callback(projects);
          } catch (error) {
            var message = 'Failed to load ' + _path2['default'].basename(_this9.file());
            var detail = error.location != null ? error.stack : error.message;
            _this9.notifyFailure(message, detail);
          }
        } else {
          _fs2['default'].writeFile(_this9.file(), '{}', function () {
            return callback({});
          });
        }
      });
    }
  }, {
    key: 'writeFile',
    value: function writeFile(projects, callback) {
      _season2['default'].writeFileSync(this.file(), projects);
      if (callback) {
        callback();
      }
    }
  }, {
    key: 'notifyFailure',
    value: function notifyFailure(message) {
      var detail = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      atom.notifications.addError(message, {
        detail: detail,
        dismissable: true
      });
    }
  }], [{
    key: 'environmentSpecificProjects',
    get: function get() {
      return atom.config.get('project-manager.environmentSpecificProjects');
    }
  }]);

  return DB;
})();

exports['default'] = DB;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYXJhaC8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL2RiLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRXNCLE1BQU07O3NCQUNYLFFBQVE7Ozs7a0JBQ1YsSUFBSTs7OztvQkFDRixNQUFNOzs7O2tCQUNSLElBQUk7Ozs7OEJBQ0wsaUJBQWlCOzs7O0FBUC9CLFdBQVcsQ0FBQzs7SUFTUyxFQUFFO0FBQ1YsV0FEUSxFQUFFLEdBQ3lCOzs7UUFBbEMsU0FBUyx5REFBQyxJQUFJO1FBQUUsV0FBVyx5REFBQyxJQUFJOzswQkFEekIsRUFBRTs7QUFFbkIsUUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDNUMsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFDOztBQUU3QixvQkFBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLFVBQUMsTUFBTSxFQUFLO0FBQ2pDLFVBQUksTUFBTSxFQUFFO0FBQ1YsY0FBSyxlQUFlLEVBQUUsQ0FBQztPQUN4QixNQUFNO0FBQ0wsY0FBSyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7T0FDcEI7S0FDRixDQUFDLENBQUM7R0FDSjs7ZUFaa0IsRUFBRTs7V0FrQlAsMEJBQW1DO1VBQWxDLFNBQVMseURBQUMsSUFBSTtVQUFFLFdBQVcseURBQUMsSUFBSTs7QUFDN0MsVUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7QUFDM0IsVUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7S0FDaEM7OztXQUVHLGNBQUMsUUFBUSxFQUFFOzs7QUFDYixVQUFJLENBQUMsUUFBUSxDQUFDLFVBQUEsT0FBTyxFQUFJO0FBQ3ZCLFlBQUksS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNsQixZQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDbEIsWUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ25CLFlBQUksTUFBTSxHQUFH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QUFFLENBQUM7V0FBQSxDQUFDLENBQUM7U0FDckQ7T0FDRixDQUFDLENBQUM7S0FDSjs7O1dBRVEsbUJBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRTtBQUM1QiwwQkFBSyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzFDLFVBQUksUUFBUSxFQUFFO0FBQ1osZ0JBQVEsRUFBRSxDQUFDO09BQ1o7S0FDRjs7O1dBRVksdUJBQUMsT0FBTyxFQUFlO1VBQWIsTUFBTSx5REFBQyxJQUFJOztBQUNoQyxVQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUU7QUFDbkMsY0FBTSxFQUFFLE1BQU07QUFDZCxtQkFBVyxFQUFFLElBQUk7T0FDbEIsQ0FBQyxDQUFDO0tBQ0o7OztTQTdLcUMsZUFBRztBQUN2QyxhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7S0FDdkU7OztTQWhCa0IsRUFBRTs7O3FCQUFGLEVBQUUiLCJmaWxlIjoiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvZGIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHtFbWl0dGVyfSBmcm9tICdhdG9tJztcbmltcG9ydCBDU09OIGZyb20gJ3NlYXNvbic7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgb3MgZnJvbSAnb3MnO1xuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZS1wbHVzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgREIge1xuICBjb25zdHJ1Y3RvcihzZWFyY2hLZXk9bnVsbCwgc2VhcmNoVmFsdWU9bnVsbCkge1xuICAgIHRoaXMuc2V0U2VhcmNoUXVlcnkoc2VhcmNoS2V5LCBzZWFyY2hWYWx1ZSk7XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcblxuICAgIGZzLmV4aXN0cyh0aGlzLmZpbGUoKSwgKGV4aXN0cykgPT4ge1xuICAgICAgaWYgKGV4aXN0cykge1xuICAgICAgICB0aGlzLm9ic2VydmVQcm9qZWN0cygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy53cml0ZUZpbGUoe30pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIGdldCBlbnZpcm9ubWVudFNwZWNpZmljUHJvamVjdHMoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgncHJvamVjdC1tYW5hZ2VyLmVudmlyb25tZW50U3BlY2lmaWNQcm9qZWN0cycpO1xuICB9XG5cbiAgc2V0U2VhcmNoUXVlcnkoc2VhcmNoS2V5PW51bGwsIHNlYXJjaFZhbHVlPW51bGwpIHtcbiAgICB0aGlzLnNlYXJjaEtleSA9IHNlYXJjaEtleTtcbiAgICB0aGlzLnNlYXJjaFZhbHVlID0gc2VhcmNoVmFsdWU7XG4gIH1cblxuICBmaW5kKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5yZWFkRmlsZShyZXN1bHRzID0+IHtcbiAgICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgICAgbGV0IHByb2plY3RzID0gW107XG4gICAgICBsZXQgcHJvamVjdCA9IG51bGw7XG4gICAgICBsZXQgcmVzdWx0ID0gbnVsbDtcbiAgICAgIGxldCB0ZW1wbGF0ZSA9IG51bGw7XG4gICAgICBsZXQga2V5O1xuXG4gICAgICBmb3IgKGtleSBpbiByZXN1bHRzKSB7XG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdHNba2V5XTtcbiAgICAgICAgdGVtcGxhdGUgPSByZXN1bHQudGVtcGxhdGUgfHwgbnVsbDtcbiAgICAgICAgcmVzdWx0Ll9pZCA9IGtleTtcblxuICAgICAgICBpZiAodGVtcGxhdGUgJiYgcmVzdWx0c1t0ZW1wbGF0ZV0gIT09IG51bGwpIHtcbiAgICAgICAgICByZXN1bHQgPSBfLmRlZXBFeHRlbmQocmVzdWx0LCByZXN1bHRzW3RlbXBsYXRlXSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcm9qZWN0cy5wdXNoKHJlc3VsdCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnNlYXJjaEtleSAmJiB0aGlzLnNlYXJjaFZhbHVlKSB7XG4gICAgICAgIGZvciAoa2V5IGluIHByb2plY3RzKSB7XG4gICAgICAgICAgcHJvamVjdCA9IHByb2plY3RzW2tleV07XG4gICAgICAgICAgaWYgKF8uaXNFcXVhbChwcm9qZWN0W3RoaXMuc2VhcmNoS2V5XSwgdGhpcy5zZWFyY2hWYWx1ZSkpIHtcbiAgICAgICAgICAgIGZvdW5kID0gcHJvamVjdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvdW5kID0gcHJvamVjdHM7XG4gICAgICB9XG5cbiAgICAgIGNhbGxiYWNrKGZvdW5kKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFkZChwcm9wcywgY2FsbGJhY2spIHtcbiAgICB0aGlzLnJlYWRGaWxlKHByb2plY3RzID0+IHtcbiAgICAgIGNvbnN0IGlkID0gdGhpcy5nZW5lcmF0ZUlEKHByb3BzLnRpdGxlKTtcbiAgICAgIHByb2plY3RzW2lkXSA9IHByb3BzO1xuXG4gICAgICB0aGlzLndyaXRlRmlsZShwcm9qZWN0cywgKCkgPT4ge1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcyhgJHtwcm9wcy50aXRsZX0gaGFzIGJlZW4gYWRkZWRgKTtcbiAgICAgICAgY2FsbGJhY2soaWQpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGUocHJvcHMpIHtcbiAgICBpZiAoIXByb3BzLl9pZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGxldCBwcm9qZWN0ID0gbnVsbDtcbiAgICBsZXQga2V5O1xuICAgIHRoaXMucmVhZEZpbGUocHJvamVjdHMgPT4ge1xuICAgICAgZm9yIChrZXkgaW4gcHJvamVjdHMpIHtcbiAgICAgICAgcHJvamVjdCA9IHByb2plY3RzW2tleV07XG4gICAgICAgIGlmIChrZXkgPT09IHByb3BzLl9pZCkge1xuICAgICAgICAgIGRlbGV0ZShwcm9wcy5faWQpO1xuICAgICAgICAgIHByb2plY3RzW2tleV0gPSBwcm9wcztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMud3JpdGVGaWxlKHByb2plY3RzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGRlbGV0ZShpZCwgY2FsbGJhY2spIHtcbiAgICB0aGlzLnJlYWRGaWxlKHByb2plY3RzID0+IHtcbiAgICAgIGZvciAobGV0IGtleSBpbiBwcm9qZWN0cykge1xuICAgICAgICBpZiAoa2V5ID09PSBpZCkge1xuICAgICAgICAgIGRlbGV0ZShwcm9qZWN0c1trZXldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLndyaXRlRmlsZShwcm9qZWN0cywgKCkgPT4ge1xuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIG9uVXBkYXRlKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5lbWl0dGVyLm9uKCdkYi11cGRhdGVkJywgKCkgPT4ge1xuICAgICAgdGhpcy5maW5kKGNhbGxiYWNrKTtcbiAgICB9KTtcbiAgfVxuXG4gIG9ic2VydmVQcm9qZWN0cygpIHtcbiAgICBpZiAodGhpcy5maWxlV2F0Y2hlcikge1xuICAgICAgdGhpcy5maWxlV2F0Y2hlci5jbG9zZSgpO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICB0aGlzLmZpbGVXYXRjaGVyID0gZnMud2F0Y2godGhpcy5maWxlKCksICgpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RiLXVwZGF0ZWQnKTtcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsZXQgdXJsID0gJ2h0dHBzOi8vZ2l0aHViLmNvbS9hdG9tL2F0b20vYmxvYi9tYXN0ZXIvZG9jcy8nO1xuICAgICAgdXJsICs9ICdidWlsZC1pbnN0cnVjdGlvbnMvbGludXgubWQjdHlwZWVycm9yLXVuYWJsZS10by13YXRjaC1wYXRoJztcbiAgICAgIGNvbnN0IGZpbGVuYW1lID0gcGF0aC5iYXNlbmFtZSh0aGlzLmZpbGUoKSk7XG4gICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBgPGI+UHJvamVjdCBNYW5hZ2VyPC9iPjxicj5Db3VsZCBub3Qgd2F0Y2ggY2hhbmdlc1xuICAgICAgICB0byAke2ZpbGVuYW1lfS4gTWFrZSBzdXJlIHlvdSBoYXZlIHBlcm1pc3Npb25zIHRvICR7dGhpcy5maWxlKCl9LlxuICAgICAgICBPbiBsaW51eCB0aGVyZSBjYW4gYmUgcHJvYmxlbXMgd2l0aCB3YXRjaCBzaXplcy5cbiAgICAgICAgU2VlIDxhIGhyZWY9JyR7dXJsfSc+IHRoaXMgZG9jdW1lbnQ8L2E+IGZvciBtb3JlIGluZm8uPmA7XG4gICAgICB0aGlzLm5vdGlmeUZhaWx1cmUoZXJyb3JNZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVGaWxlKCkge1xuICAgIGZzLmV4aXN0cyh0aGlzLmZpbGUodHJ1ZSksIChleGlzdHMpID0+IHtcbiAgICAgIGlmICghZXhpc3RzKSB7XG4gICAgICAgIHRoaXMud3JpdGVGaWxlKHt9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdlbmVyYXRlSUQoc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC9cXHMrL2csICcnKS50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgZmlsZSgpIHtcbiAgICBsZXQgZmlsZW5hbWUgPSAncHJvamVjdHMuY3Nvbic7XG4gICAgY29uc3QgZmlsZWRpciA9IGF0b20uZ2V0Q29uZmlnRGlyUGF0aCgpO1xuXG4gICAgaWYgKHRoaXMuZW52aXJvbm1lbnRTcGVjaWZpY1Byb2plY3RzKSB7XG4gICAgICBsZXQgaG9zdG5hbWUgPSBvcy5ob3N0bmFtZSgpLnNwbGl0KCcuJykuc2hpZnQoKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgZmlsZW5hbWUgPSBgcHJvamVjdHMuJHtob3N0bmFtZX0uY3NvbmA7XG4gICAgfVxuXG4gICAgcmV0dXJuIGAke2ZpbGVkaXJ9LyR7ZmlsZW5hbWV9YDtcbiAgfVxuXG4gIHJlYWRGaWxlKGNhbGxiYWNrKSB7XG4gICAgZnMuZXhpc3RzKHRoaXMuZmlsZSgpLCAoZXhpc3RzKSA9PiB7XG4gICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgbGV0IHByb2plY3RzID0gQ1NPTi5yZWFkRmlsZVN5bmModGhpcy5maWxlKCkpIHx8IHt9O1xuICAgICAgICAgIGNhbGxiYWNrKHByb2plY3RzKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBjb25zdCBtZXNzYWdlID0gYEZhaWxlZCB0byBsb2FkICR7cGF0aC5iYXNlbmFtZSh0aGlzLmZpbGUoKSl9YDtcbiAgICAgICAgICBjb25zdCBkZXRhaWwgPSBlcnJvci5sb2NhdGlvbiAhPSBudWxsID8gZXJyb3Iuc3RhY2sgOiBlcnJvci5tZXNzYWdlO1xuICAgICAgICAgIHRoaXMubm90aWZ5RmFpbHVyZShtZXNzYWdlLCBkZXRhaWwpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy53cml0ZUZpbGUodGhpcy5maWxlKCksICd7fScsICgpID0+IGNhbGxiYWNrKHt9KSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB3cml0ZUZpbGUocHJvamVjdHMsIGNhbGxiYWNrKSB7XG4gICAgQ1NPTi53cml0ZUZpbGVTeW5jKHRoaXMuZmlsZSgpLCBwcm9qZWN0cyk7XG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH1cbiAgfVxuXG4gIG5vdGlmeUZhaWx1cmUobWVzc2FnZSwgZGV0YWlsPW51bGwpIHtcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IobWVzc2FnZSwge1xuICAgICAgZGV0YWlsOiBkZXRhaWwsXG4gICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9XG59XG4iXX0=
//# sourceURL=/Users/sarah/.atom/packages/project-manager/lib/db.js
