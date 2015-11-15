(function() {
  var BufferVariablesScanner, ColorContext, VariableScanner, VariablesChunkSize;

  VariableScanner = require('../variable-scanner');

  ColorContext = require('../color-context');

  VariablesChunkSize = 100;

  BufferVariablesScanner = (function() {
    function BufferVariablesScanner(config) {
      this.buffer = config.buffer;
      this.scanner = new VariableScanner();
      this.results = [];
    }

    BufferVariablesScanner.prototype.scan = function() {
      var lastIndex, results;
      lastIndex = 0;
      while (results = this.scanner.search(this.buffer, lastIndex)) {
        this.results = this.results.concat(results);
        if (this.results.length >= VariablesChunkSize) {
          this.flushVariables();
        }
        lastIndex = results.lastIndex;
      }
      return this.flushVariables();
    };

    BufferVariablesScanner.prototype.flushVariables = function() {
      emit('scan-buffer:variables-found', this.results);
      return this.results = [];
    };

    return BufferVariablesScanner;

  })();

  module.exports = function(config) {
    return new BufferVariablesScanner(config).scan();
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi90YXNrcy9zY2FuLWJ1ZmZlci12YXJpYWJsZXMtaGFuZGxlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUVBQUE7O0FBQUEsRUFBQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxxQkFBUixDQUFsQixDQUFBOztBQUFBLEVBQ0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxrQkFBUixDQURmLENBQUE7O0FBQUEsRUFHQSxrQkFBQSxHQUFxQixHQUhyQixDQUFBOztBQUFBLEVBS007QUFDUyxJQUFBLGdDQUFDLE1BQUQsR0FBQTtBQUNYLE1BQUMsSUFBQyxDQUFBLFNBQVUsT0FBVixNQUFGLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxPQUFELEdBQWUsSUFBQSxlQUFBLENBQUEsQ0FEZixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsT0FBRCxHQUFXLEVBRlgsQ0FEVztJQUFBLENBQWI7O0FBQUEscUNBS0EsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLFVBQUEsa0JBQUE7QUFBQSxNQUFBLFNBQUEsR0FBWSxDQUFaLENBQUE7QUFDQSxhQUFNLE9BQUEsR0FBVSxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBZ0IsSUFBQyxDQUFBLE1BQWpCLEVBQXlCLFNBQXpCLENBQWhCLEdBQUE7QUFDRSxRQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULENBQWdCLE9BQWhCLENBQVgsQ0FBQTtBQUVBLFFBQUEsSUFBcUIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULElBQW1CLGtCQUF4QztBQUFBLFVBQUEsSUFBQyxDQUFBLGNBQUQsQ0FBQSxDQUFBLENBQUE7U0FGQTtBQUFBLFFBR0MsWUFBYSxRQUFiLFNBSEQsQ0FERjtNQUFBLENBREE7YUFPQSxJQUFDLENBQUEsY0FBRCxDQUFBLEVBUkk7SUFBQSxDQUxOLENBQUE7O0FBQUEscUNBZUEsY0FBQSxHQUFnQixTQUFBLEdBQUE7QUFDZCxNQUFBLElBQUEsQ0FBSyw2QkFBTCxFQUFvQyxJQUFDLENBQUEsT0FBckMsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUZHO0lBQUEsQ0FmaEIsQ0FBQTs7a0NBQUE7O01BTkYsQ0FBQTs7QUFBQSxFQXlCQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLE1BQUQsR0FBQTtXQUNYLElBQUEsc0JBQUEsQ0FBdUIsTUFBdkIsQ0FBOEIsQ0FBQyxJQUEvQixDQUFBLEVBRFc7RUFBQSxDQXpCakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/sarah/.atom/packages/pigments/lib/tasks/scan-buffer-variables-handler.coffee
