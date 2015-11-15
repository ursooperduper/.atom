(function() {
  var Builder, childProcess;

  childProcess = require('child_process');

  Builder = {
    error: null,
    build: function() {
      var buildCommand;
      buildCommand = atom.config.get('jekyll.buildCommand');
      atom.notifications.addInfo('Starting Jekyll Site Build');
      this.buildProcess = childProcess.spawn(buildCommand[0], buildCommand.slice(1), {
        cwd: atom.project.getPaths()[0]
      });
      this.buildProcess.on('error', function(error) {
        if (error.code === 'ENOENT') {
          return atom.notifications.addError('Jekyll Binary Incorrect', {
            detail: "The Jekyll Binary " + error.path + " is not valid.\r\nPlease go into Settings and change it"
          });
        } else {
          throw error;
        }
      });
      this.buildProcess.stdout.on('data', function(data) {
        var message;
        message = data.toString();
        if (message.includes('Error:')) {
          return Builder.error = message;
        }
      });
      return this.buildProcess.on('exit', function(code, signal) {
        if (code === 0) {
          return atom.notifications.addSuccess('Jekyll site build complete!');
        } else {
          return atom.notifications.addError('Jekyll site build failed!', {
            detail: Builder.error
          });
        }
      });
    }
  };

  module.exports = Builder;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2pla3lsbC9saWIvc2VydmVyL2J1aWxkLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxxQkFBQTs7QUFBQSxFQUFBLFlBQUEsR0FBZSxPQUFBLENBQVEsZUFBUixDQUFmLENBQUE7O0FBQUEsRUFFQSxPQUFBLEdBQ0U7QUFBQSxJQUFBLEtBQUEsRUFBTyxJQUFQO0FBQUEsSUFFQSxLQUFBLEVBQU8sU0FBQSxHQUFBO0FBQ0wsVUFBQSxZQUFBO0FBQUEsTUFBQSxZQUFBLEdBQWUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHFCQUFoQixDQUFmLENBQUE7QUFBQSxNQUVBLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIsNEJBQTNCLENBRkEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsWUFBWSxDQUFDLEtBQWIsQ0FBbUIsWUFBYSxDQUFBLENBQUEsQ0FBaEMsRUFBb0MsWUFBYSxTQUFqRCxFQUF3RDtBQUFBLFFBQUMsR0FBQSxFQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUE5QjtPQUF4RCxDQUpoQixDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsWUFBWSxDQUFDLEVBQWQsQ0FBaUIsT0FBakIsRUFBMEIsU0FBQyxLQUFELEdBQUE7QUFDeEIsUUFBQSxJQUFHLEtBQUssQ0FBQyxJQUFOLEtBQWMsUUFBakI7aUJBQ0UsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFuQixDQUE0Qix5QkFBNUIsRUFBdUQ7QUFBQSxZQUFDLE1BQUEsRUFBUyxvQkFBQSxHQUFvQixLQUFLLENBQUMsSUFBMUIsR0FBK0IseURBQXpDO1dBQXZELEVBREY7U0FBQSxNQUFBO0FBR0UsZ0JBQU0sS0FBTixDQUhGO1NBRHdCO01BQUEsQ0FBMUIsQ0FOQSxDQUFBO0FBQUEsTUFZQSxJQUFDLENBQUEsWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFyQixDQUF3QixNQUF4QixFQUFnQyxTQUFDLElBQUQsR0FBQTtBQUM5QixZQUFBLE9BQUE7QUFBQSxRQUFBLE9BQUEsR0FBVSxJQUFJLENBQUMsUUFBTCxDQUFBLENBQVYsQ0FBQTtBQUNBLFFBQUEsSUFBRyxPQUFPLENBQUMsUUFBUixDQUFpQixRQUFqQixDQUFIO2lCQUNFLE9BQU8sQ0FBQyxLQUFSLEdBQWlCLFFBRG5CO1NBRjhCO01BQUEsQ0FBaEMsQ0FaQSxDQUFBO2FBaUJBLElBQUMsQ0FBQSxZQUFZLENBQUMsRUFBZCxDQUFpQixNQUFqQixFQUF5QixTQUFDLElBQUQsRUFBTyxNQUFQLEdBQUE7QUFDdkIsUUFBQSxJQUFHLElBQUEsS0FBUSxDQUFYO2lCQUNFLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBbkIsQ0FBOEIsNkJBQTlCLEVBREY7U0FBQSxNQUFBO2lCQUdFLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBbkIsQ0FBNEIsMkJBQTVCLEVBQXlEO0FBQUEsWUFBQyxNQUFBLEVBQVEsT0FBTyxDQUFDLEtBQWpCO1dBQXpELEVBSEY7U0FEdUI7TUFBQSxDQUF6QixFQWxCSztJQUFBLENBRlA7R0FIRixDQUFBOztBQUFBLEVBNkJBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE9BN0JqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/sarah/.atom/packages/jekyll/lib/server/build.coffee
