(function() {
  var Range, Snippet, _;

  _ = require('underscore-plus');

  Range = require('atom').Range;

  module.exports = Snippet = (function() {
    function Snippet(_arg) {
      var bodyTree;
      this.name = _arg.name, this.prefix = _arg.prefix, this.bodyText = _arg.bodyText, bodyTree = _arg.bodyTree;
      this.body = this.extractTabStops(bodyTree);
    }

    Snippet.prototype.extractTabStops = function(bodyTree) {
      var bodyText, column, extractTabStops, index, row, tabStopsByIndex, _i, _len, _ref, _ref1;
      tabStopsByIndex = {};
      bodyText = [];
      _ref = [0, 0], row = _ref[0], column = _ref[1];
      extractTabStops = function(bodyTree) {
        var content, index, nextLine, segment, segmentLines, start, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = bodyTree.length; _i < _len; _i++) {
          segment = bodyTree[_i];
          if (segment.index != null) {
            index = segment.index, content = segment.content;
            if (index === 0) {
              index = Infinity;
            }
            start = [row, column];
            extractTabStops(content);
            if (tabStopsByIndex[index] == null) {
              tabStopsByIndex[index] = [];
            }
            _results.push(tabStopsByIndex[index].push(new Range(start, [row, column])));
          } else if (_.isString(segment)) {
            bodyText.push(segment);
            segmentLines = segment.split('\n');
            column += segmentLines.shift().length;
            _results.push((function() {
              var _results1;
              _results1 = [];
              while ((nextLine = segmentLines.shift()) != null) {
                row += 1;
                _results1.push(column = nextLine.length);
              }
              return _results1;
            })());
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
      extractTabStops(bodyTree);
      this.lineCount = row + 1;
      this.tabStops = [];
      _ref1 = _.keys(tabStopsByIndex).sort((function(arg1, arg2) {
        return arg1 - arg2;
      }));
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        index = _ref1[_i];
        this.tabStops.push(tabStopsByIndex[index]);
      }
      return bodyText.join('');
    };

    return Snippet;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlCQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQyxRQUFTLE9BQUEsQ0FBUSxNQUFSLEVBQVQsS0FERCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsaUJBQUMsSUFBRCxHQUFBO0FBQ1gsVUFBQSxRQUFBO0FBQUEsTUFEYSxJQUFDLENBQUEsWUFBQSxNQUFNLElBQUMsQ0FBQSxjQUFBLFFBQVEsSUFBQyxDQUFBLGdCQUFBLFVBQVUsZ0JBQUEsUUFDeEMsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFDLENBQUEsZUFBRCxDQUFpQixRQUFqQixDQUFSLENBRFc7SUFBQSxDQUFiOztBQUFBLHNCQUdBLGVBQUEsR0FBaUIsU0FBQyxRQUFELEdBQUE7QUFDZixVQUFBLHFGQUFBO0FBQUEsTUFBQSxlQUFBLEdBQWtCLEVBQWxCLENBQUE7QUFBQSxNQUNBLFFBQUEsR0FBVyxFQURYLENBQUE7QUFBQSxNQUVBLE9BQWdCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBaEIsRUFBQyxhQUFELEVBQU0sZ0JBRk4sQ0FBQTtBQUFBLE1BS0EsZUFBQSxHQUFrQixTQUFDLFFBQUQsR0FBQTtBQUNoQixZQUFBLDBFQUFBO0FBQUE7YUFBQSwrQ0FBQTtpQ0FBQTtBQUNFLFVBQUEsSUFBRyxxQkFBSDtBQUNFLFlBQUUsZ0JBQUEsS0FBRixFQUFTLGtCQUFBLE9BQVQsQ0FBQTtBQUNBLFlBQUEsSUFBb0IsS0FBQSxLQUFTLENBQTdCO0FBQUEsY0FBQSxLQUFBLEdBQVEsUUFBUixDQUFBO2FBREE7QUFBQSxZQUVBLEtBQUEsR0FBUSxDQUFDLEdBQUQsRUFBTSxNQUFOLENBRlIsQ0FBQTtBQUFBLFlBR0EsZUFBQSxDQUFnQixPQUFoQixDQUhBLENBQUE7O2NBSUEsZUFBZ0IsQ0FBQSxLQUFBLElBQVU7YUFKMUI7QUFBQSwwQkFLQSxlQUFnQixDQUFBLEtBQUEsQ0FBTSxDQUFDLElBQXZCLENBQWdDLElBQUEsS0FBQSxDQUFNLEtBQU4sRUFBYSxDQUFDLEdBQUQsRUFBTSxNQUFOLENBQWIsQ0FBaEMsRUFMQSxDQURGO1dBQUEsTUFPSyxJQUFHLENBQUMsQ0FBQyxRQUFGLENBQVcsT0FBWCxDQUFIO0FBQ0gsWUFBQSxRQUFRLENBQUMsSUFBVCxDQUFjLE9BQWQsQ0FBQSxDQUFBO0FBQUEsWUFDQSxZQUFBLEdBQWUsT0FBTyxDQUFDLEtBQVIsQ0FBYyxJQUFkLENBRGYsQ0FBQTtBQUFBLFlBRUEsTUFBQSxJQUFVLFlBQVksQ0FBQyxLQUFiLENBQUEsQ0FBb0IsQ0FBQyxNQUYvQixDQUFBO0FBQUE7O0FBR0E7cUJBQU0seUNBQU4sR0FBQTtBQUNFLGdCQUFBLEdBQUEsSUFBTyxDQUFQLENBQUE7QUFBQSwrQkFDQSxNQUFBLEdBQVMsUUFBUSxDQUFDLE9BRGxCLENBREY7Y0FBQSxDQUFBOztpQkFIQSxDQURHO1dBQUEsTUFBQTtrQ0FBQTtXQVJQO0FBQUE7d0JBRGdCO01BQUEsQ0FMbEIsQ0FBQTtBQUFBLE1Bc0JBLGVBQUEsQ0FBZ0IsUUFBaEIsQ0F0QkEsQ0FBQTtBQUFBLE1BdUJBLElBQUMsQ0FBQSxTQUFELEdBQWEsR0FBQSxHQUFNLENBdkJuQixDQUFBO0FBQUEsTUF3QkEsSUFBQyxDQUFBLFFBQUQsR0FBWSxFQXhCWixDQUFBO0FBeUJBOzs7QUFBQSxXQUFBLDRDQUFBOzBCQUFBO0FBQ0UsUUFBQSxJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxlQUFnQixDQUFBLEtBQUEsQ0FBL0IsQ0FBQSxDQURGO0FBQUEsT0F6QkE7YUE0QkEsUUFBUSxDQUFDLElBQVQsQ0FBYyxFQUFkLEVBN0JlO0lBQUEsQ0FIakIsQ0FBQTs7bUJBQUE7O01BTEYsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/sarah/.atom/packages/autocomplete-clang/node_modules/snippets/lib/snippet.coffee