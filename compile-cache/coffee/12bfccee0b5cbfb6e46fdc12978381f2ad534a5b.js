(function() {
  var $, $$, Project, Projects, ProjectsListView, SelectListView, View, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, SelectListView = _ref.SelectListView, View = _ref.View;

  _ = require('underscore-plus');

  Projects = require('./projects');

  Project = require('./project');

  module.exports = ProjectsListView = (function(_super) {
    __extends(ProjectsListView, _super);

    function ProjectsListView() {
      this.toggle = __bind(this.toggle, this);
      this.getEmptyMessage = __bind(this.getEmptyMessage, this);
      return ProjectsListView.__super__.constructor.apply(this, arguments);
    }

    ProjectsListView.prototype.possibleFilterKeys = ['title', 'group', 'template'];

    ProjectsListView.prototype.projects = null;

    ProjectsListView.prototype.defaultFilterKey = 'title';

    ProjectsListView.prototype.activate = function() {
      return new ProjectListView;
    };

    ProjectsListView.prototype.initialize = function(serializeState) {
      ProjectsListView.__super__.initialize.apply(this, arguments);
      this.addClass('project-manager');
      return this.projects = new Projects();
    };

    ProjectsListView.prototype.serialize = function() {};

    ProjectsListView.prototype.getFilterKey = function() {
      var filter, input, inputArr, _ref1;
      filter = this.defaultFilterKey;
      input = this.filterEditorView.getText();
      inputArr = input.split(':');
      if (inputArr.length > 1 && (_ref1 = inputArr[0], __indexOf.call(this.possibleFilterKeys, _ref1) >= 0)) {
        filter = inputArr[0];
      }
      return filter;
    };

    ProjectsListView.prototype.getFilterQuery = function() {
      var input, inputArr;
      input = this.filterEditorView.getText();
      inputArr = input.split(':');
      if (inputArr.length > 1) {
        input = inputArr[1];
      }
      return input;
    };

    ProjectsListView.prototype.cancelled = function() {
      return this.hide();
    };

    ProjectsListView.prototype.confirmed = function(props) {
      var project;
      project = new Project(props);
      project.open();
      return this.cancel();
    };

    ProjectsListView.prototype.getEmptyMessage = function(itemCount, filteredItemCount) {
      if (!itemCount) {
        return 'No projects saved yet';
      } else {
        return ProjectsListView.__super__.getEmptyMessage.apply(this, arguments);
      }
    };

    ProjectsListView.prototype.toggle = function() {
      var _ref1;
      if ((_ref1 = this.panel) != null ? _ref1.isVisible() : void 0) {
        return this.hide();
      } else {
        return this.projects.getAll((function(_this) {
          return function(projects) {
            return _this.show(projects);
          };
        })(this));
      }
    };

    ProjectsListView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.hide() : void 0;
    };

    ProjectsListView.prototype.show = function(projects) {
      var items, project, sortBy, _i, _len;
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      items = [];
      sortBy = atom.config.get('project-manager.sortBy');
      for (_i = 0, _len = projects.length; _i < _len; _i++) {
        project = projects[_i];
        items.push(project.props);
      }
      if (sortBy !== 'default') {
        items = this.sortBy(items, sortBy);
      }
      this.setItems(items);
      return this.focusFilterEditor();
    };

    ProjectsListView.prototype.viewForItem = function(_arg) {
      var devMode, group, icon, paths, title;
      title = _arg.title, group = _arg.group, icon = _arg.icon, devMode = _arg.devMode, paths = _arg.paths;
      return $$(function() {
        return this.li({
          "class": 'two-lines',
          'data-project-title': title
        }, (function(_this) {
          return function() {
            var path, _i, _len, _results;
            _this.div({
              "class": 'primary-line'
            }, function() {
              if (devMode) {
                _this.span({
                  "class": 'project-manager-devmode'
                });
              }
              return _this.div({
                "class": "icon " + icon
              }, function() {
                _this.span(title);
                if (group != null) {
                  return _this.span({
                    "class": 'project-manager-list-group'
                  }, group);
                }
              });
            });
            if (atom.config.get('project-manager.showPath')) {
              _results = [];
              for (_i = 0, _len = paths.length; _i < _len; _i++) {
                path = paths[_i];
                _results.push(_this.div({
                  "class": 'secondary-line'
                }, function() {
                  return _this.div({
                    "class": 'no-icon'
                  }, path);
                }));
              }
              return _results;
            }
          };
        })(this));
      });
    };

    ProjectsListView.prototype.sortBy = function(arr, key) {
      return arr.sort(function(a, b) {
        a = (a[key] || '\uffff').toUpperCase();
        b = (b[key] || '\uffff').toUpperCase();
        if (a > b) {
          return 1;
        } else {
          return -1;
        }
      });
    };

    return ProjectsListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvcHJvamVjdHMtbGlzdC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5RUFBQTtJQUFBOzs7eUpBQUE7O0FBQUEsRUFBQSxPQUFnQyxPQUFBLENBQVEsc0JBQVIsQ0FBaEMsRUFBQyxTQUFBLENBQUQsRUFBSSxVQUFBLEVBQUosRUFBUSxzQkFBQSxjQUFSLEVBQXdCLFlBQUEsSUFBeEIsQ0FBQTs7QUFBQSxFQUNBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FESixDQUFBOztBQUFBLEVBRUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSLENBRlgsQ0FBQTs7QUFBQSxFQUdBLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQUhWLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osdUNBQUEsQ0FBQTs7Ozs7O0tBQUE7O0FBQUEsK0JBQUEsa0JBQUEsR0FBb0IsQ0FBQyxPQUFELEVBQVUsT0FBVixFQUFtQixVQUFuQixDQUFwQixDQUFBOztBQUFBLCtCQUNBLFFBQUEsR0FBVSxJQURWLENBQUE7O0FBQUEsK0JBRUEsZ0JBQUEsR0FBa0IsT0FGbEIsQ0FBQTs7QUFBQSwrQkFJQSxRQUFBLEdBQVUsU0FBQSxHQUFBO2FBQ1IsR0FBQSxDQUFBLGdCQURRO0lBQUEsQ0FKVixDQUFBOztBQUFBLCtCQU9BLFVBQUEsR0FBWSxTQUFDLGNBQUQsR0FBQTtBQUNWLE1BQUEsa0RBQUEsU0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxRQUFELENBQVUsaUJBQVYsQ0FEQSxDQUFBO2FBRUEsSUFBQyxDQUFBLFFBQUQsR0FBZ0IsSUFBQSxRQUFBLENBQUEsRUFITjtJQUFBLENBUFosQ0FBQTs7QUFBQSwrQkFZQSxTQUFBLEdBQVcsU0FBQSxHQUFBLENBWlgsQ0FBQTs7QUFBQSwrQkFjQSxZQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ1osVUFBQSw4QkFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxnQkFBVixDQUFBO0FBQUEsTUFDQSxLQUFBLEdBQVEsSUFBQyxDQUFBLGdCQUFnQixDQUFDLE9BQWxCLENBQUEsQ0FEUixDQUFBO0FBQUEsTUFFQSxRQUFBLEdBQVcsS0FBSyxDQUFDLEtBQU4sQ0FBWSxHQUFaLENBRlgsQ0FBQTtBQUlBLE1BQUEsSUFBRyxRQUFRLENBQUMsTUFBVCxHQUFrQixDQUFsQixJQUF3QixTQUFBLFFBQVMsQ0FBQSxDQUFBLENBQVQsRUFBQSxlQUFlLElBQUMsQ0FBQSxrQkFBaEIsRUFBQSxLQUFBLE1BQUEsQ0FBM0I7QUFDRSxRQUFBLE1BQUEsR0FBUyxRQUFTLENBQUEsQ0FBQSxDQUFsQixDQURGO09BSkE7QUFPQSxhQUFPLE1BQVAsQ0FSWTtJQUFBLENBZGQsQ0FBQTs7QUFBQSwrQkF3QkEsY0FBQSxHQUFnQixTQUFBLEdBQUE7QUFDZCxVQUFBLGVBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsZ0JBQWdCLENBQUMsT0FBbEIsQ0FBQSxDQUFSLENBQUE7QUFBQSxNQUNBLFFBQUEsR0FBVyxLQUFLLENBQUMsS0FBTixDQUFZLEdBQVosQ0FEWCxDQUFBO0FBR0EsTUFBQSxJQUFHLFFBQVEsQ0FBQyxNQUFULEdBQWtCLENBQXJCO0FBQ0UsUUFBQSxLQUFBLEdBQVEsUUFBUyxDQUFBLENBQUEsQ0FBakIsQ0FERjtPQUhBO0FBTUEsYUFBTyxLQUFQLENBUGM7SUFBQSxDQXhCaEIsQ0FBQTs7QUFBQSwrQkFpQ0EsU0FBQSxHQUFXLFNBQUEsR0FBQTthQUNULElBQUMsQ0FBQSxJQUFELENBQUEsRUFEUztJQUFBLENBakNYLENBQUE7O0FBQUEsK0JBb0NBLFNBQUEsR0FBVyxTQUFDLEtBQUQsR0FBQTtBQUNULFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFjLElBQUEsT0FBQSxDQUFRLEtBQVIsQ0FBZCxDQUFBO0FBQUEsTUFDQSxPQUFPLENBQUMsSUFBUixDQUFBLENBREEsQ0FBQTthQUVBLElBQUMsQ0FBQSxNQUFELENBQUEsRUFIUztJQUFBLENBcENYLENBQUE7O0FBQUEsK0JBeUNBLGVBQUEsR0FBaUIsU0FBQyxTQUFELEVBQVksaUJBQVosR0FBQTtBQUNmLE1BQUEsSUFBRyxDQUFBLFNBQUg7ZUFDRSx3QkFERjtPQUFBLE1BQUE7ZUFHRSx1REFBQSxTQUFBLEVBSEY7T0FEZTtJQUFBLENBekNqQixDQUFBOztBQUFBLCtCQStDQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ04sVUFBQSxLQUFBO0FBQUEsTUFBQSx3Q0FBUyxDQUFFLFNBQVIsQ0FBQSxVQUFIO2VBQ0UsSUFBQyxDQUFBLElBQUQsQ0FBQSxFQURGO09BQUEsTUFBQTtlQUlFLElBQUMsQ0FBQSxRQUFRLENBQUMsTUFBVixDQUFpQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsUUFBRCxHQUFBO21CQUNmLEtBQUMsQ0FBQSxJQUFELENBQU0sUUFBTixFQURlO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakIsRUFKRjtPQURNO0lBQUEsQ0EvQ1IsQ0FBQTs7QUFBQSwrQkF1REEsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLFVBQUEsS0FBQTtpREFBTSxDQUFFLElBQVIsQ0FBQSxXQURJO0lBQUEsQ0F2RE4sQ0FBQTs7QUFBQSwrQkEwREEsSUFBQSxHQUFNLFNBQUMsUUFBRCxHQUFBO0FBQ0osVUFBQSxnQ0FBQTs7UUFBQSxJQUFDLENBQUEsUUFBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7QUFBQSxVQUFBLElBQUEsRUFBTSxJQUFOO1NBQTdCO09BQVY7QUFBQSxNQUNBLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBLENBREEsQ0FBQTtBQUFBLE1BR0EsS0FBQSxHQUFRLEVBSFIsQ0FBQTtBQUFBLE1BSUEsTUFBQSxHQUFTLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3QkFBaEIsQ0FKVCxDQUFBO0FBS0EsV0FBQSwrQ0FBQTsrQkFBQTtBQUNFLFFBQUEsS0FBSyxDQUFDLElBQU4sQ0FBVyxPQUFPLENBQUMsS0FBbkIsQ0FBQSxDQURGO0FBQUEsT0FMQTtBQU9BLE1BQUEsSUFBRyxNQUFBLEtBQVksU0FBZjtBQUNFLFFBQUEsS0FBQSxHQUFRLElBQUMsQ0FBQSxNQUFELENBQVEsS0FBUixFQUFlLE1BQWYsQ0FBUixDQURGO09BUEE7QUFBQSxNQVNBLElBQUMsQ0FBQSxRQUFELENBQVUsS0FBVixDQVRBLENBQUE7YUFVQSxJQUFDLENBQUEsaUJBQUQsQ0FBQSxFQVhJO0lBQUEsQ0ExRE4sQ0FBQTs7QUFBQSwrQkF1RUEsV0FBQSxHQUFhLFNBQUMsSUFBRCxHQUFBO0FBQ1gsVUFBQSxrQ0FBQTtBQUFBLE1BRGEsYUFBQSxPQUFPLGFBQUEsT0FBTyxZQUFBLE1BQU0sZUFBQSxTQUFTLGFBQUEsS0FDMUMsQ0FBQTthQUFBLEVBQUEsQ0FBRyxTQUFBLEdBQUE7ZUFDRCxJQUFDLENBQUEsRUFBRCxDQUFJO0FBQUEsVUFBQSxPQUFBLEVBQU8sV0FBUDtBQUFBLFVBQW9CLG9CQUFBLEVBQXNCLEtBQTFDO1NBQUosRUFBcUQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7QUFDbkQsZ0JBQUEsd0JBQUE7QUFBQSxZQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxjQUFQO2FBQUwsRUFBNEIsU0FBQSxHQUFBO0FBQzFCLGNBQUEsSUFBMEMsT0FBMUM7QUFBQSxnQkFBQSxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsa0JBQUEsT0FBQSxFQUFPLHlCQUFQO2lCQUFOLENBQUEsQ0FBQTtlQUFBO3FCQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxnQkFBQSxPQUFBLEVBQVEsT0FBQSxHQUFPLElBQWY7ZUFBTCxFQUE0QixTQUFBLEdBQUE7QUFDMUIsZ0JBQUEsS0FBQyxDQUFBLElBQUQsQ0FBTSxLQUFOLENBQUEsQ0FBQTtBQUNBLGdCQUFBLElBQW9ELGFBQXBEO3lCQUFBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxvQkFBQSxPQUFBLEVBQU8sNEJBQVA7bUJBQU4sRUFBMkMsS0FBM0MsRUFBQTtpQkFGMEI7Y0FBQSxDQUE1QixFQUYwQjtZQUFBLENBQTVCLENBQUEsQ0FBQTtBQU1BLFlBQUEsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMEJBQWhCLENBQUg7QUFDRTttQkFBQSw0Q0FBQTtpQ0FBQTtBQUNFLDhCQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxrQkFBQSxPQUFBLEVBQU8sZ0JBQVA7aUJBQUwsRUFBOEIsU0FBQSxHQUFBO3lCQUM1QixLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsb0JBQUEsT0FBQSxFQUFPLFNBQVA7bUJBQUwsRUFBdUIsSUFBdkIsRUFENEI7Z0JBQUEsQ0FBOUIsRUFBQSxDQURGO0FBQUE7OEJBREY7YUFQbUQ7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFyRCxFQURDO01BQUEsQ0FBSCxFQURXO0lBQUEsQ0F2RWIsQ0FBQTs7QUFBQSwrQkFxRkEsTUFBQSxHQUFRLFNBQUMsR0FBRCxFQUFNLEdBQU4sR0FBQTthQUNOLEdBQUcsQ0FBQyxJQUFKLENBQVMsU0FBQyxDQUFELEVBQUksQ0FBSixHQUFBO0FBQ1AsUUFBQSxDQUFBLEdBQUksQ0FBQyxDQUFFLENBQUEsR0FBQSxDQUFGLElBQVUsUUFBWCxDQUFvQixDQUFDLFdBQXJCLENBQUEsQ0FBSixDQUFBO0FBQUEsUUFDQSxDQUFBLEdBQUksQ0FBQyxDQUFFLENBQUEsR0FBQSxDQUFGLElBQVUsUUFBWCxDQUFvQixDQUFDLFdBQXJCLENBQUEsQ0FESixDQUFBO0FBR08sUUFBQSxJQUFHLENBQUEsR0FBSSxDQUFQO2lCQUFjLEVBQWQ7U0FBQSxNQUFBO2lCQUFxQixDQUFBLEVBQXJCO1NBSkE7TUFBQSxDQUFULEVBRE07SUFBQSxDQXJGUixDQUFBOzs0QkFBQTs7S0FENkIsZUFOL0IsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/sarah/.atom/packages/project-manager/lib/projects-list-view.coffee
