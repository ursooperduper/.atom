(function() {
  var Color, ColorExpression;

  Color = require('./color');

  module.exports = ColorExpression = (function() {
    function ColorExpression(_arg) {
      this.name = _arg.name, this.regexpString = _arg.regexpString, this.handle = _arg.handle;
      this.regexp = new RegExp("^" + this.regexpString + "$");
    }

    ColorExpression.prototype.match = function(expression) {
      return this.regexp.test(expression);
    };

    ColorExpression.prototype.parse = function(expression, context) {
      var color;
      if (!this.match(expression)) {
        return null;
      }
      color = new Color();
      color.colorExpression = expression;
      this.handle.call(color, this.regexp.exec(expression), expression, context);
      return color;
    };

    ColorExpression.prototype.search = function(text, start) {
      var lastIndex, match, range, re, results, _ref;
      if (start == null) {
        start = 0;
      }
      results = void 0;
      re = new RegExp(this.regexpString, 'g');
      re.lastIndex = start;
      if (_ref = re.exec(text), match = _ref[0], _ref) {
        lastIndex = re.lastIndex;
        range = [lastIndex - match.length, lastIndex];
        results = {
          range: range,
          match: text.slice(range[0], range[1])
        };
      }
      return results;
    };

    return ColorExpression;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9jb2xvci1leHByZXNzaW9uLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzQkFBQTs7QUFBQSxFQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsU0FBUixDQUFSLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSx5QkFBQyxJQUFELEdBQUE7QUFDWCxNQURhLElBQUMsQ0FBQSxZQUFBLE1BQU0sSUFBQyxDQUFBLG9CQUFBLGNBQWMsSUFBQyxDQUFBLGNBQUEsTUFDcEMsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE1BQUQsR0FBYyxJQUFBLE1BQUEsQ0FBUSxHQUFBLEdBQUcsSUFBQyxDQUFBLFlBQUosR0FBaUIsR0FBekIsQ0FBZCxDQURXO0lBQUEsQ0FBYjs7QUFBQSw4QkFHQSxLQUFBLEdBQU8sU0FBQyxVQUFELEdBQUE7YUFBZ0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLENBQWEsVUFBYixFQUFoQjtJQUFBLENBSFAsQ0FBQTs7QUFBQSw4QkFLQSxLQUFBLEdBQU8sU0FBQyxVQUFELEVBQWEsT0FBYixHQUFBO0FBQ0wsVUFBQSxLQUFBO0FBQUEsTUFBQSxJQUFBLENBQUEsSUFBb0IsQ0FBQSxLQUFELENBQU8sVUFBUCxDQUFuQjtBQUFBLGVBQU8sSUFBUCxDQUFBO09BQUE7QUFBQSxNQUVBLEtBQUEsR0FBWSxJQUFBLEtBQUEsQ0FBQSxDQUZaLENBQUE7QUFBQSxNQUdBLEtBQUssQ0FBQyxlQUFOLEdBQXdCLFVBSHhCLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBUixDQUFhLEtBQWIsRUFBb0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLENBQWEsVUFBYixDQUFwQixFQUE4QyxVQUE5QyxFQUEwRCxPQUExRCxDQUpBLENBQUE7YUFLQSxNQU5LO0lBQUEsQ0FMUCxDQUFBOztBQUFBLDhCQWFBLE1BQUEsR0FBUSxTQUFDLElBQUQsRUFBTyxLQUFQLEdBQUE7QUFDTixVQUFBLDBDQUFBOztRQURhLFFBQU07T0FDbkI7QUFBQSxNQUFBLE9BQUEsR0FBVSxNQUFWLENBQUE7QUFBQSxNQUNBLEVBQUEsR0FBUyxJQUFBLE1BQUEsQ0FBTyxJQUFDLENBQUEsWUFBUixFQUFzQixHQUF0QixDQURULENBQUE7QUFBQSxNQUVBLEVBQUUsQ0FBQyxTQUFILEdBQWUsS0FGZixDQUFBO0FBR0EsTUFBQSxJQUFHLE9BQVUsRUFBRSxDQUFDLElBQUgsQ0FBUSxJQUFSLENBQVYsRUFBQyxlQUFELEVBQUEsSUFBSDtBQUNFLFFBQUMsWUFBYSxHQUFiLFNBQUQsQ0FBQTtBQUFBLFFBQ0EsS0FBQSxHQUFRLENBQUMsU0FBQSxHQUFZLEtBQUssQ0FBQyxNQUFuQixFQUEyQixTQUEzQixDQURSLENBQUE7QUFBQSxRQUVBLE9BQUEsR0FDRTtBQUFBLFVBQUEsS0FBQSxFQUFPLEtBQVA7QUFBQSxVQUNBLEtBQUEsRUFBTyxJQUFLLDBCQURaO1NBSEYsQ0FERjtPQUhBO2FBVUEsUUFYTTtJQUFBLENBYlIsQ0FBQTs7MkJBQUE7O01BSkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/sarah/.atom/packages/pigments/lib/color-expression.coffee
