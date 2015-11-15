Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.exec = exec;

var _atom = require('atom');

'use babel';

function exec(command) {
  var args = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  if (!arguments.length) throw new Error('Nothing to execute');

  return new Promise(function (resolve, reject) {
    var data = { stdout: [], stderr: [] };
    var spawnedProcess = new _atom.BufferedProcess({
      command: command,
      args: args,
      options: options,
      stdout: function stdout(contents) {
        data.stdout.push(contents);
      },
      stderr: function stderr(contents) {
        data.stderr.push(contents);
      },
      exit: function exit() {
        if (data.stderr.length) {
          reject(new Error(data.stderr.join('')));
        } else {
          resolve(data.stdout.join(''));
        }
      }
    });
    spawnedProcess.onWillThrowError(function (_ref) {
      var error = _ref.error;
      var handle = _ref.handle;

      reject(error);
      handle();
    });
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYXJhaC8uYXRvbS9wYWNrYWdlcy9saW50ZXItcnVieS9ub2RlX21vZHVsZXMvYXRvbS1wYWNrYWdlLWRlcHMvbGliL2hlbHBlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztvQkFFOEIsTUFBTTs7QUFGcEMsV0FBVyxDQUFBOztBQUlKLFNBQVMsSUFBSSxDQUFDLE9BQU8sRUFBMkI7TUFBekIsSUFBSSx5REFBRyxFQUFFO01BQUUsT0FBTyx5REFBRyxFQUFFOztBQUNuRCxNQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUE7O0FBRTVELFNBQU8sSUFBSSxPQUFPLENBQUMsVUFBUyxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQzNDLFFBQU0sSUFBSSxHQUFHLEVBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFDLENBQUE7QUFDckMsUUFBTSxjQUFjLEdBQUcsMEJBQW9CO0FBQ3pDLGFBQU8sRUFBRSxPQUFPO0FBQ2hCLFVBQUksRUFBRSxJQUFJO0FBQ1YsYUFBTyxFQUFFLE9BQU87QUFDaEIsWUFBTSxFQUFFLGdCQUFTLFFBQVEsRUFBRTtBQUN6QixZQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQUMzQjtBQUNELFlBQU0sRUFBRSxnQkFBUyxRQUFRLEVBQUU7QUFDekIsWUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7T0FDM0I7QUFDRCxVQUFJLEVBQUUsZ0JBQVc7QUFDZixZQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO0FBQ3RCLGdCQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO1NBQ3hDLE1BQU07QUFDTCxpQkFBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7U0FDOUI7T0FDRjtLQUNGLENBQUMsQ0FBQTtBQUNGLGtCQUFjLENBQUMsZ0JBQWdCLENBQUMsVUFBUyxJQUFlLEVBQUU7VUFBaEIsS0FBSyxHQUFOLElBQWUsQ0FBZCxLQUFLO1VBQUUsTUFBTSxHQUFkLElBQWUsQ0FBUCxNQUFNOztBQUNyRCxZQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDYixZQUFNLEVBQUUsQ0FBQTtLQUNULENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTtDQUNIIiwiZmlsZSI6Ii9Vc2Vycy9zYXJhaC8uYXRvbS9wYWNrYWdlcy9saW50ZXItcnVieS9ub2RlX21vZHVsZXMvYXRvbS1wYWNrYWdlLWRlcHMvbGliL2hlbHBlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7QnVmZmVyZWRQcm9jZXNzfSBmcm9tICdhdG9tJ1xuXG5leHBvcnQgZnVuY3Rpb24gZXhlYyhjb21tYW5kLCBhcmdzID0gW10sIG9wdGlvbnMgPSB7fSkge1xuICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcignTm90aGluZyB0byBleGVjdXRlJylcblxuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgY29uc3QgZGF0YSA9IHtzdGRvdXQ6IFtdLCBzdGRlcnI6IFtdfVxuICAgIGNvbnN0IHNwYXduZWRQcm9jZXNzID0gbmV3IEJ1ZmZlcmVkUHJvY2Vzcyh7XG4gICAgICBjb21tYW5kOiBjb21tYW5kLFxuICAgICAgYXJnczogYXJncyxcbiAgICAgIG9wdGlvbnM6IG9wdGlvbnMsXG4gICAgICBzdGRvdXQ6IGZ1bmN0aW9uKGNvbnRlbnRzKSB7XG4gICAgICAgIGRhdGEuc3Rkb3V0LnB1c2goY29udGVudHMpXG4gICAgICB9LFxuICAgICAgc3RkZXJyOiBmdW5jdGlvbihjb250ZW50cykge1xuICAgICAgICBkYXRhLnN0ZGVyci5wdXNoKGNvbnRlbnRzKVxuICAgICAgfSxcbiAgICAgIGV4aXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoZGF0YS5zdGRlcnIubGVuZ3RoKSB7XG4gICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihkYXRhLnN0ZGVyci5qb2luKCcnKSkpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZShkYXRhLnN0ZG91dC5qb2luKCcnKSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICAgc3Bhd25lZFByb2Nlc3Mub25XaWxsVGhyb3dFcnJvcihmdW5jdGlvbih7ZXJyb3IsIGhhbmRsZX0pIHtcbiAgICAgIHJlamVjdChlcnJvcilcbiAgICAgIGhhbmRsZSgpXG4gICAgfSlcbiAgfSlcbn1cbiJdfQ==
//# sourceURL=/Users/sarah/.atom/packages/linter-ruby/node_modules/atom-package-deps/lib/helper.js
