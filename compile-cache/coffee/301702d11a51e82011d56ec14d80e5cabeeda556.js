(function() {
  var Color, ColorContext, ColorExpression, ColorParser, getRegistry;

  Color = require('./color');

  ColorExpression = require('./color-expression');

  ColorContext = null;

  getRegistry = require('./color-expressions').getRegistry;

  module.exports = ColorParser = (function() {
    function ColorParser() {}

    ColorParser.prototype.parse = function(expression, context) {
      var e, registry, res, _i, _len, _ref;
      if (context == null) {
        if (ColorContext == null) {
          ColorContext = require('./color-context');
        }
        context = new ColorContext;
      }
      if (context.parser == null) {
        context.parser = this;
      }
      if ((expression == null) || expression === '') {
        return void 0;
      }
      registry = getRegistry(context);
      _ref = registry.getExpressions();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        if (e.match(expression)) {
          res = e.parse(expression, context);
          res.variables = context.readUsedVariables();
          return res;
        }
      }
      return void 0;
    };

    return ColorParser;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9jb2xvci1wYXJzZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLDhEQUFBOztBQUFBLEVBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSLENBQVIsQ0FBQTs7QUFBQSxFQUNBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLG9CQUFSLENBRGxCLENBQUE7O0FBQUEsRUFFQSxZQUFBLEdBQWUsSUFGZixDQUFBOztBQUFBLEVBSUMsY0FBZSxPQUFBLENBQVEscUJBQVIsRUFBZixXQUpELENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSxxQkFBQSxHQUFBLENBQWI7O0FBQUEsMEJBRUEsS0FBQSxHQUFPLFNBQUMsVUFBRCxFQUFhLE9BQWIsR0FBQTtBQUNMLFVBQUEsZ0NBQUE7QUFBQSxNQUFBLElBQU8sZUFBUDs7VUFDRSxlQUFnQixPQUFBLENBQVEsaUJBQVI7U0FBaEI7QUFBQSxRQUNBLE9BQUEsR0FBVSxHQUFBLENBQUEsWUFEVixDQURGO09BQUE7O1FBR0EsT0FBTyxDQUFDLFNBQVU7T0FIbEI7QUFLQSxNQUFBLElBQXdCLG9CQUFKLElBQW1CLFVBQUEsS0FBYyxFQUFyRDtBQUFBLGVBQU8sTUFBUCxDQUFBO09BTEE7QUFBQSxNQU9BLFFBQUEsR0FBVyxXQUFBLENBQVksT0FBWixDQVBYLENBQUE7QUFTQTtBQUFBLFdBQUEsMkNBQUE7cUJBQUE7QUFDRSxRQUFBLElBQUcsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxVQUFSLENBQUg7QUFDRSxVQUFBLEdBQUEsR0FBTSxDQUFDLENBQUMsS0FBRixDQUFRLFVBQVIsRUFBb0IsT0FBcEIsQ0FBTixDQUFBO0FBQUEsVUFDQSxHQUFHLENBQUMsU0FBSixHQUFnQixPQUFPLENBQUMsaUJBQVIsQ0FBQSxDQURoQixDQUFBO0FBRUEsaUJBQU8sR0FBUCxDQUhGO1NBREY7QUFBQSxPQVRBO0FBZUEsYUFBTyxNQUFQLENBaEJLO0lBQUEsQ0FGUCxDQUFBOzt1QkFBQTs7TUFSRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/sarah/.atom/packages/pigments/lib/color-parser.coffee
