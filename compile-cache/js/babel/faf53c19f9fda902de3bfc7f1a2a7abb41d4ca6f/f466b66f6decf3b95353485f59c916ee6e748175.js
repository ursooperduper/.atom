'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var CompositeDisposable = undefined;
var ProjectsListView = undefined;
var Projects = undefined;
var SaveDialog = undefined;
var DB = undefined;

var ProjectManager = (function () {
  function ProjectManager() {
    _classCallCheck(this, ProjectManager);
  }

  _createClass(ProjectManager, null, [{
    key: 'activate',
    value: function activate() {
      var _this = this;

      CompositeDisposable = require('atom').CompositeDisposable;
      this.disposables = new CompositeDisposable();

      this.disposables.add(atom.commands.add('atom-workspace', {
        'project-manager:list-projects': function projectManagerListProjects() {
          ProjectsListView = require('./projects-list-view');
          var projectsListView = new ProjectsListView();
          projectsListView.toggle();
        },

        'project-manager:save-project': function projectManagerSaveProject() {
          SaveDialog = require('./save-dialog');
          var saveDialog = new SaveDialog();
          saveDialog.attach();
        },

        'project-manager:edit-projects': function projectManagerEditProjects() {
          DB = require('./db');
          var db = new DB();
          atom.workspace.open(db.file());
        }
      }));

      atom.project.onDidChangePaths(function () {
        return _this.updatePaths();
      });
      this.loadProject();
    }
  }, {
    key: 'loadProject',
    value: function loadProject() {
      var _this2 = this;

      Projects = require('./projects');
      this.projects = new Projects();
      this.projects.getCurrent(function (project) {
        if (project) {
          _this2.project = project;
          _this2.project.load();
        }
      });
    }
  }, {
    key: 'updatePaths',
    value: function updatePaths() {
      var paths = atom.project.getPaths();
      if (this.project && paths.length) {
        this.project.set('paths', paths);
      }
    }
  }, {
    key: 'provideProjects',
    value: function provideProjects() {
      Projects = require('./projects');
      return {
        projects: new Projects()
      };
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      this.disposables.dispose();
    }
  }, {
    key: 'config',
    get: function get() {
      return {
        showPath: {
          type: 'boolean',
          'default': true
        },
        closeCurrent: {
          type: 'boolean',
          'default': false,
          description: 'Currently disabled since it\'s broken.\n          Waiting for a better way to implement it.'
        },
        environmentSpecificProjects: {
          type: 'boolean',
          'default': false
        },
        sortBy: {
          type: 'string',
          description: 'Default sorting is the order in which the projects are',
          'default': 'default',
          'enum': ['default', 'title', 'group']
        }
      };
    }
  }]);

  return ProjectManager;
})();

exports['default'] = ProjectManager;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYXJhaC8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL3Byb2plY3QtbWFuYWdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7QUFFWixJQUFJLG1CQUFtQixZQUFBLENBQUM7QUFDeEIsSUFBSSxnQkFBZ0IsWUFBQSxDQUFDO0FBQ3JCLElBQUksUUFBUSxZQUFBLENBQUM7QUFDYixJQUFJLFVBQVUsWUFBQSxDQUFDO0FBQ2YsSUFBSSxFQUFFLFlBQUEsQ0FBQzs7SUFFYyxjQUFjO1dBQWQsY0FBYzswQkFBZCxjQUFjOzs7ZUFBZCxjQUFjOztXQTJCbEIsb0JBQUc7OztBQUNoQix5QkFBbUIsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsbUJBQW1CLENBQUM7QUFDMUQsVUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLG1CQUFtQixFQUFFLENBQUM7O0FBRTdDLFVBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFO0FBQ3ZELHVDQUErQixFQUFFLHNDQUFNO0FBQ3JDLDBCQUFnQixHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQ25ELGNBQUksZ0JBQWdCLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO0FBQzlDLDBCQUFnQixDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQzNCOztBQUVELHNDQUE4QixFQUFFLHFDQUFNO0FBQ3BDLG9CQUFVLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3RDLGNBQUksVUFBVSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7QUFDbEMsb0JBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNyQjs7QUFFRCx1Q0FBK0IsRUFBRSxzQ0FBTTtBQUNyQyxZQUFFLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3JCLGNBQUksRUFBRSxHQUFHLElBQUksRUFBRSxFQUFFLENBQUM7QUFDbEIsY0FBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7U0FDaEM7T0FDRixDQUFDLENBQUMsQ0FBQzs7QUFFSixVQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDO2VBQU0sTUFBSyxXQUFXLEVBQUU7T0FBQSxDQUFDLENBQUM7QUFDeEQsVUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0tBQ3BCOzs7V0FFaUIsdUJBQUc7OztBQUNuQixjQUFRLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ2pDLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQztBQUMvQixVQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxVQUFBLE9BQU8sRUFBSTtBQUNsQyxZQUFJLE9BQU8sRUFBRTtBQUNYLGlCQUFLLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDdkIsaUJBQUssT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3JCO09BQ0YsQ0FBQyxDQUFDO0tBQ0o7OztXQUVpQix1QkFBRztBQUNuQixVQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ3BDLFVBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO0FBQ2hDLFlBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztPQUNsQztLQUNGOzs7V0FFcUIsMkJBQUc7QUFDdkIsY0FBUSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNqQyxhQUFPO0FBQ0wsZ0JBQVEsRUFBRSxJQUFJLFFBQVEsRUFBRTtPQUN6QixDQUFDO0tBQ0g7OztXQUVnQixzQkFBRztBQUNsQixVQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQzVCOzs7U0FoRmdCLGVBQUc7QUFDbEIsYUFBTztBQUNMLGdCQUFRLEVBQUU7QUFDUixjQUFJLEVBQUUsU0FBUztBQUNmLHFCQUFTLElBQUk7U0FDZDtBQUNELG9CQUFZLEVBQUU7QUFDWixjQUFJLEVBQUUsU0FBUztBQUNmLHFCQUFTLEtBQUs7QUFDZCxxQkFBVywrRkFDaUM7U0FDN0M7QUFDRCxtQ0FBMkIsRUFBRTtBQUMzQixjQUFJLEVBQUUsU0FBUztBQUNmLHFCQUFTLEtBQUs7U0FDZjtBQUNELGNBQU0sRUFBRTtBQUNOLGNBQUksRUFBRSxRQUFRO0FBQ2QscUJBQVcsRUFBRSx3REFBd0Q7QUFDckUscUJBQVMsU0FBUztBQUNsQixrQkFBTSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDO1NBQ3BDO09BQ0YsQ0FBQztLQUNIOzs7U0F6QmtCLGNBQWM7OztxQkFBZCxjQUFjIiwiZmlsZSI6Ii9Vc2Vycy9zYXJhaC8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL3Byb2plY3QtbWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5sZXQgQ29tcG9zaXRlRGlzcG9zYWJsZTtcbmxldCBQcm9qZWN0c0xpc3RWaWV3O1xubGV0IFByb2plY3RzO1xubGV0IFNhdmVEaWFsb2c7XG5sZXQgREI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb2plY3RNYW5hZ2VyIHtcblxuICBzdGF0aWMgZ2V0IGNvbmZpZygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2hvd1BhdGg6IHtcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICB9LFxuICAgICAgY2xvc2VDdXJyZW50OiB7XG4gICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBgQ3VycmVudGx5IGRpc2FibGVkIHNpbmNlIGl0XFwncyBicm9rZW4uXG4gICAgICAgICAgV2FpdGluZyBmb3IgYSBiZXR0ZXIgd2F5IHRvIGltcGxlbWVudCBpdC5gXG4gICAgICB9LFxuICAgICAgZW52aXJvbm1lbnRTcGVjaWZpY1Byb2plY3RzOiB7XG4gICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIH0sXG4gICAgICBzb3J0Qnk6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnRGVmYXVsdCBzb3J0aW5nIGlzIHRoZSBvcmRlciBpbiB3aGljaCB0aGUgcHJvamVjdHMgYXJlJyxcbiAgICAgICAgZGVmYXVsdDogJ2RlZmF1bHQnLFxuICAgICAgICBlbnVtOiBbJ2RlZmF1bHQnLCAndGl0bGUnLCAnZ3JvdXAnXVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgYWN0aXZhdGUoKSB7XG4gICAgQ29tcG9zaXRlRGlzcG9zYWJsZSA9IHJlcXVpcmUoJ2F0b20nKS5Db21wb3NpdGVEaXNwb3NhYmxlO1xuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgJ3Byb2plY3QtbWFuYWdlcjpsaXN0LXByb2plY3RzJzogKCkgPT4ge1xuICAgICAgICBQcm9qZWN0c0xpc3RWaWV3ID0gcmVxdWlyZSgnLi9wcm9qZWN0cy1saXN0LXZpZXcnKTtcbiAgICAgICAgbGV0IHByb2plY3RzTGlzdFZpZXcgPSBuZXcgUHJvamVjdHNMaXN0VmlldygpO1xuICAgICAgICBwcm9qZWN0c0xpc3RWaWV3LnRvZ2dsZSgpO1xuICAgICAgfSxcblxuICAgICAgJ3Byb2plY3QtbWFuYWdlcjpzYXZlLXByb2plY3QnOiAoKSA9PiB7XG4gICAgICAgIFNhdmVEaWFsb2cgPSByZXF1aXJlKCcuL3NhdmUtZGlhbG9nJyk7XG4gICAgICAgIGxldCBzYXZlRGlhbG9nID0gbmV3IFNhdmVEaWFsb2coKTtcbiAgICAgICAgc2F2ZURpYWxvZy5hdHRhY2goKTtcbiAgICAgIH0sXG5cbiAgICAgICdwcm9qZWN0LW1hbmFnZXI6ZWRpdC1wcm9qZWN0cyc6ICgpID0+IHtcbiAgICAgICAgREIgPSByZXF1aXJlKCcuL2RiJyk7XG4gICAgICAgIGxldCBkYiA9IG5ldyBEQigpO1xuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKGRiLmZpbGUoKSk7XG4gICAgICB9XG4gICAgfSkpO1xuXG4gICAgYXRvbS5wcm9qZWN0Lm9uRGlkQ2hhbmdlUGF0aHMoKCkgPT4gdGhpcy51cGRhdGVQYXRocygpKTtcbiAgICB0aGlzLmxvYWRQcm9qZWN0KCk7XG4gIH1cblxuICBzdGF0aWMgbG9hZFByb2plY3QoKSB7XG4gICAgUHJvamVjdHMgPSByZXF1aXJlKCcuL3Byb2plY3RzJyk7XG4gICAgdGhpcy5wcm9qZWN0cyA9IG5ldyBQcm9qZWN0cygpO1xuICAgIHRoaXMucHJvamVjdHMuZ2V0Q3VycmVudChwcm9qZWN0ID0+IHtcbiAgICAgIGlmIChwcm9qZWN0KSB7XG4gICAgICAgIHRoaXMucHJvamVjdCA9IHByb2plY3Q7XG4gICAgICAgIHRoaXMucHJvamVjdC5sb2FkKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgdXBkYXRlUGF0aHMoKSB7XG4gICAgbGV0IHBhdGhzID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKCk7XG4gICAgaWYgKHRoaXMucHJvamVjdCAmJiBwYXRocy5sZW5ndGgpIHtcbiAgICAgIHRoaXMucHJvamVjdC5zZXQoJ3BhdGhzJywgcGF0aHMpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBwcm92aWRlUHJvamVjdHMoKSB7XG4gICAgUHJvamVjdHMgPSByZXF1aXJlKCcuL3Byb2plY3RzJyk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHByb2plY3RzOiBuZXcgUHJvamVjdHMoKVxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmRpc3Bvc2UoKTtcbiAgfVxufVxuIl19
//# sourceURL=/Users/sarah/.atom/packages/project-manager/lib/project-manager.js
