(function() {
  var Linter;

  Linter = require('./linter');

  module.exports = {
    activate: (function(_this) {
      return function() {
        return _this.linter = new Linter;
      };
    })(this),
    config: {
      copyRubocopYml: {
        "default": true,
        description: 'Copy .rubocop.yml to temporary directory while linting',
        type: 'boolean'
      },
      hamlLintExecutablePath: {
        "default": 'haml-lint',
        description: 'Path to haml-lint executable',
        type: 'string'
      }
    },
    deactivate: (function(_this) {
      return function() {
        return _this.linter.subscriptions.dispose();
      };
    })(this),
    provideLinter: (function(_this) {
      return function() {
        return _this.linter;
      };
    })(this)
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1oYW1sL2xpYi9tYWluLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxNQUFBOztBQUFBLEVBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBVSxDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQSxHQUFBO2VBQ1IsS0FBQyxDQUFBLE1BQUQsR0FBVSxHQUFBLENBQUEsT0FERjtNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVY7QUFBQSxJQUdBLE1BQUEsRUFDRTtBQUFBLE1BQUEsY0FBQSxFQUNFO0FBQUEsUUFBQSxTQUFBLEVBQVMsSUFBVDtBQUFBLFFBQ0EsV0FBQSxFQUFhLHdEQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sU0FGTjtPQURGO0FBQUEsTUFLQSxzQkFBQSxFQUNFO0FBQUEsUUFBQSxTQUFBLEVBQVMsV0FBVDtBQUFBLFFBQ0EsV0FBQSxFQUFhLDhCQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sUUFGTjtPQU5GO0tBSkY7QUFBQSxJQWNBLFVBQUEsRUFBWSxDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQSxHQUFBO2VBQ1YsS0FBQyxDQUFBLE1BQU0sQ0FBQyxhQUFhLENBQUMsT0FBdEIsQ0FBQSxFQURVO01BQUEsRUFBQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FkWjtBQUFBLElBaUJBLGFBQUEsRUFBZSxDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQSxHQUFBO2VBQ2IsS0FBQyxDQUFBLE9BRFk7TUFBQSxFQUFBO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQWpCZjtHQUhGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/sarah/.atom/packages/linter-haml/lib/main.coffee
