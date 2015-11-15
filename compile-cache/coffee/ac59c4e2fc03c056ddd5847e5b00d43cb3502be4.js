(function() {
  var ColorParser, ColorScanner, countLines, getRegistry;

  countLines = require('./utils').countLines;

  getRegistry = require('./color-expressions').getRegistry;

  ColorParser = require('./color-parser');

  module.exports = ColorScanner = (function() {
    function ColorScanner(params) {
      if (params == null) {
        params = {};
      }
      this.parser = params.parser, this.context = params.context;
      if (this.parser == null) {
        this.parser = new ColorParser;
      }
    }

    ColorScanner.prototype.getRegExp = function() {
      var registry;
      registry = getRegistry(this.context);
      return this.regexp = new RegExp(registry.getRegExp(), 'g');
    };

    ColorScanner.prototype.search = function(text, start) {
      var color, index, lastIndex, match, matchText;
      if (start == null) {
        start = 0;
      }
      this.regexp = this.getRegExp();
      this.regexp.lastIndex = start;
      if (match = this.regexp.exec(text)) {
        matchText = match[0];
        lastIndex = this.regexp.lastIndex;
        color = this.parser.parse(matchText, this.context);
        if ((index = matchText.indexOf(color.colorExpression)) > 0) {
          lastIndex += -matchText.length + index + color.colorExpression.length;
          matchText = color.colorExpression;
        }
        return {
          color: color,
          match: matchText,
          lastIndex: lastIndex,
          range: [lastIndex - matchText.length, lastIndex],
          line: countLines(text.slice(0, +(lastIndex - matchText.length) + 1 || 9e9)) - 1
        };
      }
    };

    return ColorScanner;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9jb2xvci1zY2FubmVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrREFBQTs7QUFBQSxFQUFDLGFBQWMsT0FBQSxDQUFRLFNBQVIsRUFBZCxVQUFELENBQUE7O0FBQUEsRUFDQyxjQUFlLE9BQUEsQ0FBUSxxQkFBUixFQUFmLFdBREQsQ0FBQTs7QUFBQSxFQUVBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FGZCxDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsc0JBQUMsTUFBRCxHQUFBOztRQUFDLFNBQU87T0FDbkI7QUFBQSxNQUFDLElBQUMsQ0FBQSxnQkFBQSxNQUFGLEVBQVUsSUFBQyxDQUFBLGlCQUFBLE9BQVgsQ0FBQTs7UUFDQSxJQUFDLENBQUEsU0FBVSxHQUFBLENBQUE7T0FGQTtJQUFBLENBQWI7O0FBQUEsMkJBSUEsU0FBQSxHQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsUUFBQTtBQUFBLE1BQUEsUUFBQSxHQUFXLFdBQUEsQ0FBWSxJQUFDLENBQUEsT0FBYixDQUFYLENBQUE7YUFFQSxJQUFDLENBQUEsTUFBRCxHQUFjLElBQUEsTUFBQSxDQUFPLFFBQVEsQ0FBQyxTQUFULENBQUEsQ0FBUCxFQUE2QixHQUE3QixFQUhMO0lBQUEsQ0FKWCxDQUFBOztBQUFBLDJCQVNBLE1BQUEsR0FBUSxTQUFDLElBQUQsRUFBTyxLQUFQLEdBQUE7QUFDTixVQUFBLHlDQUFBOztRQURhLFFBQU07T0FDbkI7QUFBQSxNQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUFWLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUixHQUFvQixLQURwQixDQUFBO0FBR0EsTUFBQSxJQUFHLEtBQUEsR0FBUSxJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsQ0FBYSxJQUFiLENBQVg7QUFDRSxRQUFDLFlBQWEsUUFBZCxDQUFBO0FBQUEsUUFDQyxZQUFhLElBQUMsQ0FBQSxPQUFkLFNBREQsQ0FBQTtBQUFBLFFBR0EsS0FBQSxHQUFRLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixDQUFjLFNBQWQsRUFBeUIsSUFBQyxDQUFBLE9BQTFCLENBSFIsQ0FBQTtBQUtBLFFBQUEsSUFBRyxDQUFDLEtBQUEsR0FBUSxTQUFTLENBQUMsT0FBVixDQUFrQixLQUFLLENBQUMsZUFBeEIsQ0FBVCxDQUFBLEdBQXFELENBQXhEO0FBQ0UsVUFBQSxTQUFBLElBQWEsQ0FBQSxTQUFVLENBQUMsTUFBWCxHQUFvQixLQUFwQixHQUE0QixLQUFLLENBQUMsZUFBZSxDQUFDLE1BQS9ELENBQUE7QUFBQSxVQUNBLFNBQUEsR0FBWSxLQUFLLENBQUMsZUFEbEIsQ0FERjtTQUxBO2VBU0E7QUFBQSxVQUFBLEtBQUEsRUFBTyxLQUFQO0FBQUEsVUFDQSxLQUFBLEVBQU8sU0FEUDtBQUFBLFVBRUEsU0FBQSxFQUFXLFNBRlg7QUFBQSxVQUdBLEtBQUEsRUFBTyxDQUNMLFNBQUEsR0FBWSxTQUFTLENBQUMsTUFEakIsRUFFTCxTQUZLLENBSFA7QUFBQSxVQU9BLElBQUEsRUFBTSxVQUFBLENBQVcsSUFBSyxxREFBaEIsQ0FBQSxHQUFvRCxDQVAxRDtVQVZGO09BSk07SUFBQSxDQVRSLENBQUE7O3dCQUFBOztNQU5GLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/sarah/.atom/packages/pigments/lib/color-scanner.coffee
