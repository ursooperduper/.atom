(function() {
  var Task;

  Task = require('atom').Task;

  module.exports = {
    startTask: function(paths, callback) {
      var results, taskPath;
      results = [];
      taskPath = require.resolve('./tasks/scan-paths-handler');
      this.task = Task.once(taskPath, paths, (function(_this) {
        return function() {
          _this.task = null;
          return callback(results);
        };
      })(this));
      this.task.on('scan-paths:path-scanned', function(result) {
        return results = results.concat(result);
      });
      return this.task;
    },
    terminateRunningTask: function() {
      var _ref;
      return (_ref = this.task) != null ? _ref.terminate() : void 0;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9wYXRocy1zY2FubmVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxJQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsTUFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFNBQUEsRUFBVyxTQUFDLEtBQUQsRUFBUSxRQUFSLEdBQUE7QUFDVCxVQUFBLGlCQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsRUFBVixDQUFBO0FBQUEsTUFDQSxRQUFBLEdBQVcsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsNEJBQWhCLENBRFgsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFJLENBQUMsSUFBTCxDQUNOLFFBRE0sRUFFTixLQUZNLEVBR04sQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNFLFVBQUEsS0FBQyxDQUFBLElBQUQsR0FBUSxJQUFSLENBQUE7aUJBQ0EsUUFBQSxDQUFTLE9BQVQsRUFGRjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSE0sQ0FIUixDQUFBO0FBQUEsTUFXQSxJQUFDLENBQUEsSUFBSSxDQUFDLEVBQU4sQ0FBUyx5QkFBVCxFQUFvQyxTQUFDLE1BQUQsR0FBQTtlQUNsQyxPQUFBLEdBQVUsT0FBTyxDQUFDLE1BQVIsQ0FBZSxNQUFmLEVBRHdCO01BQUEsQ0FBcEMsQ0FYQSxDQUFBO2FBY0EsSUFBQyxDQUFBLEtBZlE7SUFBQSxDQUFYO0FBQUEsSUFpQkEsb0JBQUEsRUFBc0IsU0FBQSxHQUFBO0FBQ3BCLFVBQUEsSUFBQTs4Q0FBSyxDQUFFLFNBQVAsQ0FBQSxXQURvQjtJQUFBLENBakJ0QjtHQUhGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/sarah/.atom/packages/pigments/lib/paths-scanner.coffee
