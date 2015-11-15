(function() {
  var VariableParser, VariableScanner, countLines, regexp, regexpString, registry, _ref;

  countLines = require('./utils').countLines;

  VariableParser = require('./variable-parser');

  _ref = [], registry = _ref[0], regexpString = _ref[1], regexp = _ref[2];

  module.exports = VariableScanner = (function() {
    function VariableScanner(params) {
      if (params == null) {
        params = {};
      }
      this.parser = params.parser;
      if (this.parser == null) {
        this.parser = new VariableParser;
      }
    }

    VariableScanner.prototype.getRegExp = function() {
      if (registry == null) {
        registry = require('./variable-expressions');
      }
      if (regexpString == null) {
        regexpString = registry.getRegExp();
      }
      return regexp != null ? regexp : regexp = new RegExp(regexpString, 'gm');
    };

    VariableScanner.prototype.search = function(text, start) {
      var index, lastIndex, line, lineCountIndex, match, matchText, result, v, _i, _len;
      if (start == null) {
        start = 0;
      }
      regexp = this.getRegExp();
      regexp.lastIndex = start;
      while (match = regexp.exec(text)) {
        matchText = match[0];
        index = match.index;
        lastIndex = regexp.lastIndex;
        result = this.parser.parse(matchText);
        if (result != null) {
          result.lastIndex += index;
          if (result.length > 0) {
            result.range[0] += index;
            result.range[1] += index;
            line = -1;
            lineCountIndex = 0;
            for (_i = 0, _len = result.length; _i < _len; _i++) {
              v = result[_i];
              v.range[0] += index;
              v.range[1] += index;
              line = v.line = line + countLines(text.slice(lineCountIndex, +v.range[0] + 1 || 9e9));
              lineCountIndex = v.range[0];
            }
            return result;
          } else {
            regexp.lastIndex = result.lastIndex;
          }
        }
      }
      return void 0;
    };

    return VariableScanner;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi92YXJpYWJsZS1zY2FubmVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpRkFBQTs7QUFBQSxFQUFDLGFBQWMsT0FBQSxDQUFRLFNBQVIsRUFBZCxVQUFELENBQUE7O0FBQUEsRUFDQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxtQkFBUixDQURqQixDQUFBOztBQUFBLEVBRUEsT0FBbUMsRUFBbkMsRUFBQyxrQkFBRCxFQUFXLHNCQUFYLEVBQXlCLGdCQUZ6QixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEseUJBQUMsTUFBRCxHQUFBOztRQUFDLFNBQU87T0FDbkI7QUFBQSxNQUFDLElBQUMsQ0FBQSxTQUFVLE9BQVYsTUFBRixDQUFBOztRQUNBLElBQUMsQ0FBQSxTQUFVLEdBQUEsQ0FBQTtPQUZBO0lBQUEsQ0FBYjs7QUFBQSw4QkFJQSxTQUFBLEdBQVcsU0FBQSxHQUFBOztRQUNULFdBQVksT0FBQSxDQUFRLHdCQUFSO09BQVo7O1FBQ0EsZUFBZ0IsUUFBUSxDQUFDLFNBQVQsQ0FBQTtPQURoQjs4QkFHQSxTQUFBLFNBQWMsSUFBQSxNQUFBLENBQU8sWUFBUCxFQUFxQixJQUFyQixFQUpMO0lBQUEsQ0FKWCxDQUFBOztBQUFBLDhCQVVBLE1BQUEsR0FBUSxTQUFDLElBQUQsRUFBTyxLQUFQLEdBQUE7QUFDTixVQUFBLDZFQUFBOztRQURhLFFBQU07T0FDbkI7QUFBQSxNQUFBLE1BQUEsR0FBUyxJQUFDLENBQUEsU0FBRCxDQUFBLENBQVQsQ0FBQTtBQUFBLE1BQ0EsTUFBTSxDQUFDLFNBQVAsR0FBbUIsS0FEbkIsQ0FBQTtBQUdBLGFBQU0sS0FBQSxHQUFRLE1BQU0sQ0FBQyxJQUFQLENBQVksSUFBWixDQUFkLEdBQUE7QUFDRSxRQUFDLFlBQWEsUUFBZCxDQUFBO0FBQUEsUUFDQyxRQUFTLE1BQVQsS0FERCxDQUFBO0FBQUEsUUFFQyxZQUFhLE9BQWIsU0FGRCxDQUFBO0FBQUEsUUFJQSxNQUFBLEdBQVMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLENBQWMsU0FBZCxDQUpULENBQUE7QUFNQSxRQUFBLElBQUcsY0FBSDtBQUNFLFVBQUEsTUFBTSxDQUFDLFNBQVAsSUFBb0IsS0FBcEIsQ0FBQTtBQUVBLFVBQUEsSUFBRyxNQUFNLENBQUMsTUFBUCxHQUFnQixDQUFuQjtBQUNFLFlBQUEsTUFBTSxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQWIsSUFBbUIsS0FBbkIsQ0FBQTtBQUFBLFlBQ0EsTUFBTSxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQWIsSUFBbUIsS0FEbkIsQ0FBQTtBQUFBLFlBR0EsSUFBQSxHQUFPLENBQUEsQ0FIUCxDQUFBO0FBQUEsWUFJQSxjQUFBLEdBQWlCLENBSmpCLENBQUE7QUFNQSxpQkFBQSw2Q0FBQTs2QkFBQTtBQUNFLGNBQUEsQ0FBQyxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQVIsSUFBYyxLQUFkLENBQUE7QUFBQSxjQUNBLENBQUMsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFSLElBQWMsS0FEZCxDQUFBO0FBQUEsY0FFQSxJQUFBLEdBQU8sQ0FBQyxDQUFDLElBQUYsR0FBUyxJQUFBLEdBQU8sVUFBQSxDQUFXLElBQUssOENBQWhCLENBRnZCLENBQUE7QUFBQSxjQUdBLGNBQUEsR0FBaUIsQ0FBQyxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBSHpCLENBREY7QUFBQSxhQU5BO0FBWUEsbUJBQU8sTUFBUCxDQWJGO1dBQUEsTUFBQTtBQWVFLFlBQUEsTUFBTSxDQUFDLFNBQVAsR0FBbUIsTUFBTSxDQUFDLFNBQTFCLENBZkY7V0FIRjtTQVBGO01BQUEsQ0FIQTtBQThCQSxhQUFPLE1BQVAsQ0EvQk07SUFBQSxDQVZSLENBQUE7OzJCQUFBOztNQU5GLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/sarah/.atom/packages/pigments/lib/variable-scanner.coffee
