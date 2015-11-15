(function() {
  var DB, Emitter, Project, Projects, _;

  Emitter = require('atom').Emitter;

  _ = require('underscore-plus');

  DB = require('./db');

  Project = require('./project');

  module.exports = Projects = (function() {
    Projects.prototype.db = null;

    function Projects() {
      this.emitter = new Emitter;
      this.db = new DB();
      this.db.onUpdate((function(_this) {
        return function() {
          return _this.emitter.emit('projects-updated');
        };
      })(this));
    }

    Projects.prototype.onUpdate = function(callback) {
      return this.emitter.on('projects-updated', callback);
    };

    Projects.prototype.getAll = function(callback) {
      return this.db.find(function(projectSettings) {
        var key, project, projects, setting;
        projects = [];
        for (key in projectSettings) {
          setting = projectSettings[key];
          if (setting.paths != null) {
            project = new Project(setting);
            projects.push(project);
          }
        }
        return callback(projects);
      });
    };

    Projects.prototype.getCurrent = function(callback) {
      return this.getAll(function(projects) {
        var project, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = projects.length; _i < _len; _i++) {
          project = projects[_i];
          if (project.isCurrent()) {
            _results.push(callback(project));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
    };

    return Projects;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvcHJvamVjdHMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlDQUFBOztBQUFBLEVBQUMsVUFBVyxPQUFBLENBQVEsTUFBUixFQUFYLE9BQUQsQ0FBQTs7QUFBQSxFQUNBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FESixDQUFBOztBQUFBLEVBRUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxNQUFSLENBRkwsQ0FBQTs7QUFBQSxFQUdBLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQUhWLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osdUJBQUEsRUFBQSxHQUFJLElBQUosQ0FBQTs7QUFFYSxJQUFBLGtCQUFBLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FBQSxDQUFBLE9BQVgsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLEVBQUQsR0FBVSxJQUFBLEVBQUEsQ0FBQSxDQURWLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxFQUFFLENBQUMsUUFBSixDQUFhLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ1gsS0FBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsa0JBQWQsRUFEVztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWIsQ0FIQSxDQURXO0lBQUEsQ0FGYjs7QUFBQSx1QkFTQSxRQUFBLEdBQVUsU0FBQyxRQUFELEdBQUE7YUFDUixJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxrQkFBWixFQUFnQyxRQUFoQyxFQURRO0lBQUEsQ0FUVixDQUFBOztBQUFBLHVCQVlBLE1BQUEsR0FBUSxTQUFDLFFBQUQsR0FBQTthQUNOLElBQUMsQ0FBQSxFQUFFLENBQUMsSUFBSixDQUFTLFNBQUMsZUFBRCxHQUFBO0FBQ1AsWUFBQSwrQkFBQTtBQUFBLFFBQUEsUUFBQSxHQUFXLEVBQVgsQ0FBQTtBQUNBLGFBQUEsc0JBQUE7eUNBQUE7QUFDRSxVQUFBLElBQUcscUJBQUg7QUFDRSxZQUFBLE9BQUEsR0FBYyxJQUFBLE9BQUEsQ0FBUSxPQUFSLENBQWQsQ0FBQTtBQUFBLFlBQ0EsUUFBUSxDQUFDLElBQVQsQ0FBYyxPQUFkLENBREEsQ0FERjtXQURGO0FBQUEsU0FEQTtlQUtBLFFBQUEsQ0FBUyxRQUFULEVBTk87TUFBQSxDQUFULEVBRE07SUFBQSxDQVpSLENBQUE7O0FBQUEsdUJBcUJBLFVBQUEsR0FBWSxTQUFDLFFBQUQsR0FBQTthQUNWLElBQUMsQ0FBQSxNQUFELENBQVEsU0FBQyxRQUFELEdBQUE7QUFDTixZQUFBLDJCQUFBO0FBQUE7YUFBQSwrQ0FBQTtpQ0FBQTtBQUNFLFVBQUEsSUFBRyxPQUFPLENBQUMsU0FBUixDQUFBLENBQUg7MEJBQ0UsUUFBQSxDQUFTLE9BQVQsR0FERjtXQUFBLE1BQUE7a0NBQUE7V0FERjtBQUFBO3dCQURNO01BQUEsQ0FBUixFQURVO0lBQUEsQ0FyQlosQ0FBQTs7b0JBQUE7O01BUEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/sarah/.atom/packages/project-manager/lib/projects.coffee
