(function() {
  module.exports = {
    config: {
      syntaxThemeColoring: {
        description: 'Color the UI using a seleciton of colors from the current syntax theme.Needs the window to be reloaded from the command palette. (Experimental, only works on dark themes for now).',
        type: 'boolean',
        "default": false
      }
    },
    activate: function(state) {
      return atom.workspace.onDidOpen(function() {
        var Config;
        Config = require('./config');
        return Config.apply();
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsbUJBQUEsRUFDRTtBQUFBLFFBQUEsV0FBQSxFQUFhLHFMQUFiO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLEtBRlQ7T0FERjtLQURGO0FBQUEsSUFNQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7YUFDUixJQUFJLENBQUMsU0FBUyxDQUFDLFNBQWYsQ0FBeUIsU0FBQSxHQUFBO0FBQ3ZCLFlBQUEsTUFBQTtBQUFBLFFBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBQVQsQ0FBQTtlQUNBLE1BQU0sQ0FBQyxLQUFQLENBQUEsRUFGdUI7TUFBQSxDQUF6QixFQURRO0lBQUEsQ0FOVjtHQURGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/sarah/.atom/packages/graphite-ui/lib/graphite-ui.coffee