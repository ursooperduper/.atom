(function() {
  var VariableExpression;

  module.exports = VariableExpression = (function() {
    VariableExpression.DEFAULT_HANDLE = function(match, solver) {
      var end, name, start, value, _;
      _ = match[0], name = match[1], value = match[2];
      start = _.indexOf(name);
      end = _.indexOf(value) + value.length;
      solver.appendResult([name, value, start, end]);
      return solver.endParsing(end);
    };

    function VariableExpression(_arg) {
      this.name = _arg.name, this.regexpString = _arg.regexpString, this.handle = _arg.handle;
      this.regexp = new RegExp("" + this.regexpString, 'm');
      if (this.handle == null) {
        this.handle = this.constructor.DEFAULT_HANDLE;
      }
    }

    VariableExpression.prototype.match = function(expression) {
      return this.regexp.test(expression);
    };

    VariableExpression.prototype.parse = function(expression) {
      var lastIndex, match, matchText, parsingAborted, results, solver, startIndex;
      parsingAborted = false;
      results = [];
      match = this.regexp.exec(expression);
      if (match != null) {
        matchText = match[0];
        lastIndex = this.regexp.lastIndex;
        startIndex = lastIndex - matchText.length;
        solver = {
          endParsing: function(end) {
            var start;
            start = expression.indexOf(matchText);
            results.lastIndex = end;
            results.range = [start, end];
            return results.match = matchText.slice(start, end);
          },
          abortParsing: function() {
            return parsingAborted = true;
          },
          appendResult: function(_arg) {
            var end, name, range, reName, start, value;
            name = _arg[0], value = _arg[1], start = _arg[2], end = _arg[3];
            range = [start, end];
            reName = name.replace('$', '\\$');
            if (!RegExp("" + reName + "(?![-_])").test(value)) {
              return results.push({
                name: name,
                value: value,
                range: range
              });
            }
          }
        };
        this.handle(match, solver);
      }
      if (parsingAborted) {
        return void 0;
      } else {
        return results;
      }
    };

    return VariableExpression;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi92YXJpYWJsZS1leHByZXNzaW9uLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrQkFBQTs7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixJQUFBLGtCQUFDLENBQUEsY0FBRCxHQUFpQixTQUFDLEtBQUQsRUFBUSxNQUFSLEdBQUE7QUFDZixVQUFBLDBCQUFBO0FBQUEsTUFBQyxZQUFELEVBQUksZUFBSixFQUFVLGdCQUFWLENBQUE7QUFBQSxNQUNBLEtBQUEsR0FBUSxDQUFDLENBQUMsT0FBRixDQUFVLElBQVYsQ0FEUixDQUFBO0FBQUEsTUFFQSxHQUFBLEdBQU0sQ0FBQyxDQUFDLE9BQUYsQ0FBVSxLQUFWLENBQUEsR0FBbUIsS0FBSyxDQUFDLE1BRi9CLENBQUE7QUFBQSxNQUdBLE1BQU0sQ0FBQyxZQUFQLENBQW9CLENBQUMsSUFBRCxFQUFPLEtBQVAsRUFBYyxLQUFkLEVBQXFCLEdBQXJCLENBQXBCLENBSEEsQ0FBQTthQUlBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEdBQWxCLEVBTGU7SUFBQSxDQUFqQixDQUFBOztBQU9hLElBQUEsNEJBQUMsSUFBRCxHQUFBO0FBQ1gsTUFEYSxJQUFDLENBQUEsWUFBQSxNQUFNLElBQUMsQ0FBQSxvQkFBQSxjQUFjLElBQUMsQ0FBQSxjQUFBLE1BQ3BDLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxNQUFBLENBQU8sRUFBQSxHQUFHLElBQUMsQ0FBQSxZQUFYLEVBQTJCLEdBQTNCLENBQWQsQ0FBQTs7UUFDQSxJQUFDLENBQUEsU0FBVSxJQUFDLENBQUEsV0FBVyxDQUFDO09BRmI7SUFBQSxDQVBiOztBQUFBLGlDQVdBLEtBQUEsR0FBTyxTQUFDLFVBQUQsR0FBQTthQUFnQixJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsQ0FBYSxVQUFiLEVBQWhCO0lBQUEsQ0FYUCxDQUFBOztBQUFBLGlDQWFBLEtBQUEsR0FBTyxTQUFDLFVBQUQsR0FBQTtBQUNMLFVBQUEsd0VBQUE7QUFBQSxNQUFBLGNBQUEsR0FBaUIsS0FBakIsQ0FBQTtBQUFBLE1BQ0EsT0FBQSxHQUFVLEVBRFYsQ0FBQTtBQUFBLE1BR0EsS0FBQSxHQUFRLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBUixDQUFhLFVBQWIsQ0FIUixDQUFBO0FBSUEsTUFBQSxJQUFHLGFBQUg7QUFFRSxRQUFDLFlBQWEsUUFBZCxDQUFBO0FBQUEsUUFDQyxZQUFhLElBQUMsQ0FBQSxPQUFkLFNBREQsQ0FBQTtBQUFBLFFBRUEsVUFBQSxHQUFhLFNBQUEsR0FBWSxTQUFTLENBQUMsTUFGbkMsQ0FBQTtBQUFBLFFBSUEsTUFBQSxHQUNFO0FBQUEsVUFBQSxVQUFBLEVBQVksU0FBQyxHQUFELEdBQUE7QUFDVixnQkFBQSxLQUFBO0FBQUEsWUFBQSxLQUFBLEdBQVEsVUFBVSxDQUFDLE9BQVgsQ0FBbUIsU0FBbkIsQ0FBUixDQUFBO0FBQUEsWUFDQSxPQUFPLENBQUMsU0FBUixHQUFvQixHQURwQixDQUFBO0FBQUEsWUFFQSxPQUFPLENBQUMsS0FBUixHQUFnQixDQUFDLEtBQUQsRUFBTyxHQUFQLENBRmhCLENBQUE7bUJBR0EsT0FBTyxDQUFDLEtBQVIsR0FBZ0IsU0FBVSxtQkFKaEI7VUFBQSxDQUFaO0FBQUEsVUFLQSxZQUFBLEVBQWMsU0FBQSxHQUFBO21CQUNaLGNBQUEsR0FBaUIsS0FETDtVQUFBLENBTGQ7QUFBQSxVQU9BLFlBQUEsRUFBYyxTQUFDLElBQUQsR0FBQTtBQUNaLGdCQUFBLHNDQUFBO0FBQUEsWUFEYyxnQkFBTSxpQkFBTyxpQkFBTyxhQUNsQyxDQUFBO0FBQUEsWUFBQSxLQUFBLEdBQVEsQ0FBQyxLQUFELEVBQVEsR0FBUixDQUFSLENBQUE7QUFBQSxZQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsT0FBTCxDQUFhLEdBQWIsRUFBa0IsS0FBbEIsQ0FEVCxDQUFBO0FBRUEsWUFBQSxJQUFBLENBQUEsTUFBTyxDQUFBLEVBQUEsR0FBSyxNQUFMLEdBQVksVUFBWixDQUF1QixDQUFDLElBQXhCLENBQTZCLEtBQTdCLENBQVA7cUJBQ0UsT0FBTyxDQUFDLElBQVIsQ0FBYTtBQUFBLGdCQUFDLE1BQUEsSUFBRDtBQUFBLGdCQUFPLE9BQUEsS0FBUDtBQUFBLGdCQUFjLE9BQUEsS0FBZDtlQUFiLEVBREY7YUFIWTtVQUFBLENBUGQ7U0FMRixDQUFBO0FBQUEsUUFrQkEsSUFBQyxDQUFBLE1BQUQsQ0FBUSxLQUFSLEVBQWUsTUFBZixDQWxCQSxDQUZGO09BSkE7QUEwQkEsTUFBQSxJQUFHLGNBQUg7ZUFBdUIsT0FBdkI7T0FBQSxNQUFBO2VBQXNDLFFBQXRDO09BM0JLO0lBQUEsQ0FiUCxDQUFBOzs4QkFBQTs7TUFGRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/sarah/.atom/packages/pigments/lib/variable-expression.coffee
