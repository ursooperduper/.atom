(function() {
  var VariableParser, registry;

  registry = require('./variable-expressions');

  module.exports = VariableParser = (function() {
    function VariableParser() {}

    VariableParser.prototype.parse = function(expression) {
      var e, _i, _len, _ref;
      _ref = registry.getExpressions();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        if (e.match(expression)) {
          return e.parse(expression);
        }
      }
    };

    return VariableParser;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi92YXJpYWJsZS1wYXJzZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLHdCQUFBOztBQUFBLEVBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSx3QkFBUixDQUFYLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO2dDQUNKOztBQUFBLDZCQUFBLEtBQUEsR0FBTyxTQUFDLFVBQUQsR0FBQTtBQUNMLFVBQUEsaUJBQUE7QUFBQTtBQUFBLFdBQUEsMkNBQUE7cUJBQUE7QUFDRSxRQUFBLElBQThCLENBQUMsQ0FBQyxLQUFGLENBQVEsVUFBUixDQUE5QjtBQUFBLGlCQUFPLENBQUMsQ0FBQyxLQUFGLENBQVEsVUFBUixDQUFQLENBQUE7U0FERjtBQUFBLE9BREs7SUFBQSxDQUFQLENBQUE7OzBCQUFBOztNQUpGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/sarah/.atom/packages/pigments/lib/variable-parser.coffee
