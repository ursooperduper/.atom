(function() {
  var ColorExpression, ExpressionsRegistry;

  ColorExpression = require('./color-expression');

  module.exports = ExpressionsRegistry = (function() {
    function ExpressionsRegistry(expressionsType) {
      this.expressionsType = expressionsType;
      this.colorExpressions = {};
    }

    ExpressionsRegistry.prototype.getExpressions = function() {
      var e, k;
      return ((function() {
        var _ref, _results;
        _ref = this.colorExpressions;
        _results = [];
        for (k in _ref) {
          e = _ref[k];
          _results.push(e);
        }
        return _results;
      }).call(this)).sort(function(a, b) {
        return b.priority - a.priority;
      });
    };

    ExpressionsRegistry.prototype.getExpression = function(name) {
      return this.colorExpressions[name];
    };

    ExpressionsRegistry.prototype.getRegExp = function() {
      return this.getExpressions().map(function(e) {
        return "(" + e.regexpString + ")";
      }).join('|');
    };

    ExpressionsRegistry.prototype.createExpression = function(name, regexpString, priority, handle) {
      var newExpression, _ref;
      if (priority == null) {
        priority = 0;
      }
      if (typeof priority === 'function') {
        _ref = [0, priority], priority = _ref[0], handle = _ref[1];
      }
      newExpression = new this.expressionsType({
        name: name,
        regexpString: regexpString,
        handle: handle
      });
      newExpression.priority = priority;
      return this.addExpression(newExpression);
    };

    ExpressionsRegistry.prototype.addExpression = function(expression) {
      return this.colorExpressions[expression.name] = expression;
    };

    ExpressionsRegistry.prototype.removeExpression = function(name) {
      return delete this.colorExpressions[name];
    };

    return ExpressionsRegistry;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9leHByZXNzaW9ucy1yZWdpc3RyeS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsb0NBQUE7O0FBQUEsRUFBQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxvQkFBUixDQUFsQixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVTLElBQUEsNkJBQUUsZUFBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsa0JBQUEsZUFDYixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsZ0JBQUQsR0FBb0IsRUFBcEIsQ0FEVztJQUFBLENBQWI7O0FBQUEsa0NBR0EsY0FBQSxHQUFnQixTQUFBLEdBQUE7QUFDZCxVQUFBLElBQUE7YUFBQTs7QUFBQztBQUFBO2FBQUEsU0FBQTtzQkFBQTtBQUFBLHdCQUFBLEVBQUEsQ0FBQTtBQUFBOzttQkFBRCxDQUFnQyxDQUFDLElBQWpDLENBQXNDLFNBQUMsQ0FBRCxFQUFHLENBQUgsR0FBQTtlQUFTLENBQUMsQ0FBQyxRQUFGLEdBQWEsQ0FBQyxDQUFDLFNBQXhCO01BQUEsQ0FBdEMsRUFEYztJQUFBLENBSGhCLENBQUE7O0FBQUEsa0NBTUEsYUFBQSxHQUFlLFNBQUMsSUFBRCxHQUFBO2FBQVUsSUFBQyxDQUFBLGdCQUFpQixDQUFBLElBQUEsRUFBNUI7SUFBQSxDQU5mLENBQUE7O0FBQUEsa0NBUUEsU0FBQSxHQUFXLFNBQUEsR0FBQTthQUNULElBQUMsQ0FBQSxjQUFELENBQUEsQ0FBaUIsQ0FBQyxHQUFsQixDQUFzQixTQUFDLENBQUQsR0FBQTtlQUFRLEdBQUEsR0FBRyxDQUFDLENBQUMsWUFBTCxHQUFrQixJQUExQjtNQUFBLENBQXRCLENBQW1ELENBQUMsSUFBcEQsQ0FBeUQsR0FBekQsRUFEUztJQUFBLENBUlgsQ0FBQTs7QUFBQSxrQ0FXQSxnQkFBQSxHQUFrQixTQUFDLElBQUQsRUFBTyxZQUFQLEVBQXFCLFFBQXJCLEVBQWlDLE1BQWpDLEdBQUE7QUFDaEIsVUFBQSxtQkFBQTs7UUFEcUMsV0FBUztPQUM5QztBQUFBLE1BQUEsSUFBc0MsTUFBQSxDQUFBLFFBQUEsS0FBbUIsVUFBekQ7QUFBQSxRQUFBLE9BQXFCLENBQUMsQ0FBRCxFQUFJLFFBQUosQ0FBckIsRUFBQyxrQkFBRCxFQUFXLGdCQUFYLENBQUE7T0FBQTtBQUFBLE1BQ0EsYUFBQSxHQUFvQixJQUFBLElBQUMsQ0FBQSxlQUFELENBQWlCO0FBQUEsUUFBQyxNQUFBLElBQUQ7QUFBQSxRQUFPLGNBQUEsWUFBUDtBQUFBLFFBQXFCLFFBQUEsTUFBckI7T0FBakIsQ0FEcEIsQ0FBQTtBQUFBLE1BRUEsYUFBYSxDQUFDLFFBQWQsR0FBeUIsUUFGekIsQ0FBQTthQUdBLElBQUMsQ0FBQSxhQUFELENBQWUsYUFBZixFQUpnQjtJQUFBLENBWGxCLENBQUE7O0FBQUEsa0NBaUJBLGFBQUEsR0FBZSxTQUFDLFVBQUQsR0FBQTthQUNiLElBQUMsQ0FBQSxnQkFBaUIsQ0FBQSxVQUFVLENBQUMsSUFBWCxDQUFsQixHQUFxQyxXQUR4QjtJQUFBLENBakJmLENBQUE7O0FBQUEsa0NBb0JBLGdCQUFBLEdBQWtCLFNBQUMsSUFBRCxHQUFBO2FBQVUsTUFBQSxDQUFBLElBQVEsQ0FBQSxnQkFBaUIsQ0FBQSxJQUFBLEVBQW5DO0lBQUEsQ0FwQmxCLENBQUE7OytCQUFBOztNQUxGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/sarah/.atom/packages/pigments/lib/expressions-registry.coffee
