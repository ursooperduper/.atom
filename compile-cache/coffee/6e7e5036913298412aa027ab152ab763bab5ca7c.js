(function() {
  module.exports = {
    apply: function() {
      var applySyntaxThemeColoring;
      applySyntaxThemeColoring = function(useSyntaxColors) {
        var fs, path, varsPath;
        fs = require('fs');
        path = require('path');
        varsPath = path.join(__dirname, '..', 'stylesheets/config.less');
        if (useSyntaxColors) {
          return fs.writeFileSync(varsPath, "@import \"colors-syntax\";\n");
        } else {
          return fs.writeFileSync(varsPath, "@import \"colors\";\n");
        }
      };
      atom.workspace.onDidOpen(function() {
        return applySyntaxThemeColoring(atom.config.get('graphite-ui.syntaxThemeColoring'));
      });
      return atom.config.onDidChange('graphite-ui.syntaxThemeColoring', function() {
        return applySyntaxThemeColoring(atom.config.get('graphite-ui.syntaxThemeColoring'));
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLEtBQUEsRUFBTyxTQUFBLEdBQUE7QUFDTCxVQUFBLHdCQUFBO0FBQUEsTUFBQSx3QkFBQSxHQUEyQixTQUFDLGVBQUQsR0FBQTtBQUN6QixZQUFBLGtCQUFBO0FBQUEsUUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FBTCxDQUFBO0FBQUEsUUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBO0FBQUEsUUFFQSxRQUFBLEdBQVcsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLElBQXJCLEVBQTJCLHlCQUEzQixDQUZYLENBQUE7QUFJQSxRQUFBLElBQUcsZUFBSDtpQkFDRSxFQUFFLENBQUMsYUFBSCxDQUFpQixRQUFqQixFQUEyQiw4QkFBM0IsRUFERjtTQUFBLE1BQUE7aUJBR0UsRUFBRSxDQUFDLGFBQUgsQ0FBaUIsUUFBakIsRUFBMkIsdUJBQTNCLEVBSEY7U0FMeUI7TUFBQSxDQUEzQixDQUFBO0FBQUEsTUFVQSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQWYsQ0FBeUIsU0FBQSxHQUFBO2VBQ3ZCLHdCQUFBLENBQXlCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixpQ0FBaEIsQ0FBekIsRUFEdUI7TUFBQSxDQUF6QixDQVZBLENBQUE7YUFhQSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVosQ0FBd0IsaUNBQXhCLEVBQTJELFNBQUEsR0FBQTtlQUN6RCx3QkFBQSxDQUF5QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsaUNBQWhCLENBQXpCLEVBRHlEO01BQUEsQ0FBM0QsRUFkSztJQUFBLENBQVA7R0FERixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/sarah/.atom/packages/graphite-ui/lib/config.coffee