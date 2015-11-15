(function() {
  var PathScanner, VariableScanner, async, fs;

  async = require('async');

  fs = require('fs');

  VariableScanner = require('../variable-scanner');

  PathScanner = (function() {
    function PathScanner(path) {
      this.path = path;
      this.scanner = new VariableScanner;
    }

    PathScanner.prototype.load = function(done) {
      var currentChunk, currentLine, currentOffset, lastIndex, line, readStream, results;
      currentChunk = '';
      currentLine = 0;
      currentOffset = 0;
      lastIndex = 0;
      line = 0;
      results = [];
      readStream = fs.createReadStream(this.path);
      readStream.on('data', (function(_this) {
        return function(chunk) {
          var index, lastLine, result, v, _i, _len;
          currentChunk += chunk.toString();
          index = lastIndex;
          while (result = _this.scanner.search(currentChunk, lastIndex)) {
            result.range[0] += index;
            result.range[1] += index;
            for (_i = 0, _len = result.length; _i < _len; _i++) {
              v = result[_i];
              v.path = _this.path;
              v.range[0] += index;
              v.range[1] += index;
              v.definitionRange = result.range;
              v.line += line;
              lastLine = v.line;
            }
            results = results.concat(result);
            lastIndex = result.lastIndex;
          }
          if (result != null) {
            currentChunk = currentChunk.slice(lastIndex);
            line = lastLine;
            return lastIndex = 0;
          }
        };
      })(this));
      return readStream.on('end', function() {
        emit('scan-paths:path-scanned', results);
        return done();
      });
    };

    return PathScanner;

  })();

  module.exports = function(paths) {
    return async.each(paths, function(path, next) {
      return new PathScanner(path).load(next);
    }, this.async());
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi90YXNrcy9zY2FuLXBhdGhzLWhhbmRsZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVDQUFBOztBQUFBLEVBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSLENBQVIsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQURMLENBQUE7O0FBQUEsRUFFQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxxQkFBUixDQUZsQixDQUFBOztBQUFBLEVBSU07QUFDUyxJQUFBLHFCQUFFLElBQUYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLE9BQUEsSUFDYixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxlQUFYLENBRFc7SUFBQSxDQUFiOztBQUFBLDBCQUdBLElBQUEsR0FBTSxTQUFDLElBQUQsR0FBQTtBQUNKLFVBQUEsOEVBQUE7QUFBQSxNQUFBLFlBQUEsR0FBZSxFQUFmLENBQUE7QUFBQSxNQUNBLFdBQUEsR0FBYyxDQURkLENBQUE7QUFBQSxNQUVBLGFBQUEsR0FBZ0IsQ0FGaEIsQ0FBQTtBQUFBLE1BR0EsU0FBQSxHQUFZLENBSFosQ0FBQTtBQUFBLE1BSUEsSUFBQSxHQUFPLENBSlAsQ0FBQTtBQUFBLE1BS0EsT0FBQSxHQUFVLEVBTFYsQ0FBQTtBQUFBLE1BT0EsVUFBQSxHQUFhLEVBQUUsQ0FBQyxnQkFBSCxDQUFvQixJQUFDLENBQUEsSUFBckIsQ0FQYixDQUFBO0FBQUEsTUFTQSxVQUFVLENBQUMsRUFBWCxDQUFjLE1BQWQsRUFBc0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxHQUFBO0FBQ3BCLGNBQUEsb0NBQUE7QUFBQSxVQUFBLFlBQUEsSUFBZ0IsS0FBSyxDQUFDLFFBQU4sQ0FBQSxDQUFoQixDQUFBO0FBQUEsVUFFQSxLQUFBLEdBQVEsU0FGUixDQUFBO0FBSUEsaUJBQU0sTUFBQSxHQUFTLEtBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxDQUFnQixZQUFoQixFQUE4QixTQUE5QixDQUFmLEdBQUE7QUFDRSxZQUFBLE1BQU0sQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFiLElBQW1CLEtBQW5CLENBQUE7QUFBQSxZQUNBLE1BQU0sQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFiLElBQW1CLEtBRG5CLENBQUE7QUFHQSxpQkFBQSw2Q0FBQTs2QkFBQTtBQUNFLGNBQUEsQ0FBQyxDQUFDLElBQUYsR0FBUyxLQUFDLENBQUEsSUFBVixDQUFBO0FBQUEsY0FDQSxDQUFDLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBUixJQUFjLEtBRGQsQ0FBQTtBQUFBLGNBRUEsQ0FBQyxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQVIsSUFBYyxLQUZkLENBQUE7QUFBQSxjQUdBLENBQUMsQ0FBQyxlQUFGLEdBQW9CLE1BQU0sQ0FBQyxLQUgzQixDQUFBO0FBQUEsY0FJQSxDQUFDLENBQUMsSUFBRixJQUFVLElBSlYsQ0FBQTtBQUFBLGNBS0EsUUFBQSxHQUFXLENBQUMsQ0FBQyxJQUxiLENBREY7QUFBQSxhQUhBO0FBQUEsWUFXQSxPQUFBLEdBQVUsT0FBTyxDQUFDLE1BQVIsQ0FBZSxNQUFmLENBWFYsQ0FBQTtBQUFBLFlBWUMsWUFBYSxPQUFiLFNBWkQsQ0FERjtVQUFBLENBSkE7QUFtQkEsVUFBQSxJQUFHLGNBQUg7QUFDRSxZQUFBLFlBQUEsR0FBZSxZQUFhLGlCQUE1QixDQUFBO0FBQUEsWUFDQSxJQUFBLEdBQU8sUUFEUCxDQUFBO21CQUVBLFNBQUEsR0FBWSxFQUhkO1dBcEJvQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXRCLENBVEEsQ0FBQTthQWtDQSxVQUFVLENBQUMsRUFBWCxDQUFjLEtBQWQsRUFBcUIsU0FBQSxHQUFBO0FBQ25CLFFBQUEsSUFBQSxDQUFLLHlCQUFMLEVBQWdDLE9BQWhDLENBQUEsQ0FBQTtlQUNBLElBQUEsQ0FBQSxFQUZtQjtNQUFBLENBQXJCLEVBbkNJO0lBQUEsQ0FITixDQUFBOzt1QkFBQTs7TUFMRixDQUFBOztBQUFBLEVBK0NBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsS0FBRCxHQUFBO1dBQ2YsS0FBSyxDQUFDLElBQU4sQ0FDRSxLQURGLEVBRUUsU0FBQyxJQUFELEVBQU8sSUFBUCxHQUFBO2FBQ00sSUFBQSxXQUFBLENBQVksSUFBWixDQUFpQixDQUFDLElBQWxCLENBQXVCLElBQXZCLEVBRE47SUFBQSxDQUZGLEVBSUUsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQUpGLEVBRGU7RUFBQSxDQS9DakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/sarah/.atom/packages/pigments/lib/tasks/scan-paths-handler.coffee
