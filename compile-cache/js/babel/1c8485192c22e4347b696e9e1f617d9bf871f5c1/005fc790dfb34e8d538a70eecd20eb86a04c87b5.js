Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _jshintSrcCli = require('jshint/src/cli');

var _jshintSrcCli2 = _interopRequireDefault(_jshintSrcCli);

var _userHome = require('user-home');

var _userHome2 = _interopRequireDefault(_userHome);

'use babel';

// from JSHint //
// Storage for memoized results from find file
// Should prevent lots of directory traversal &
// lookups when liniting an entire project
var findFileResults = {};

/**
 * Searches for a file with a specified name starting with
 * 'dir' and going all the way up either until it finds the file
 * or hits the root.
 *
 * @param {string} name filename to search for (e.g. .jshintrc)
 * @param {string} dir  directory to start search from (default:
 *                      current working directory)
 *
 * @returns {string} normalized filename
 */
var findFile = function findFile(_x2) {
  var _arguments = arguments;
  var _again = true;

  _function: while (_again) {
    var name = _x2;
    dir = filename = parent = undefined;
    _again = false;
    var dir = _arguments[1] === undefined ? process.cwd() : _arguments[1];

    var filename = _path2['default'].normalize(_path2['default'].join(dir, name));
    if (findFileResults[filename] !== undefined) {
      return findFileResults[filename];
    }

    var parent = _path2['default'].resolve(dir, '../');

    if (_shelljs2['default'].test('-e', filename)) {
      findFileResults[filename] = filename;
      return filename;
    }

    if (dir === parent) {
      findFileResults[filename] = null;
      return null;
    }

    _arguments = [_x2 = name, parent];
    _again = true;
    continue _function;
  }
};

/**
 * Tries to find a configuration file in either project directory
 * or in the home directory. Configuration files are named
 * '.jshintrc'.
 *
 * @param {string} file path to the file to be linted
 * @returns {string} a path to the config file
 */
var findConfig = function findConfig(file) {
  var dir = _path2['default'].dirname(_path2['default'].resolve(file));
  var home = _path2['default'].normalize(_path2['default'].join(_userHome2['default'], '.jshintrc'));

  var proj = findFile('.jshintrc', dir);
  if (proj) {
    return proj;
  }

  if (_shelljs2['default'].test('-e', home)) {
    return home;
  }

  return null;
};

/**
 * Tries to find JSHint configuration within a package.json file
 * (if any). It search in the current directory and then goes up
 * all the way to the root just like findFile.
 *
 * @param   {string} file path to the file to be linted
 * @returns {object} config object
 */
var loadNpmConfig = function loadNpmConfig(file) {
  var dir = _path2['default'].dirname(_path2['default'].resolve(file));
  var fp = findFile('package.json', dir);

  if (!fp) {
    return null;
  }

  try {
    return require(fp).jshintConfig;
  } catch (e) {
    return null;
  }
};
// / //

var loadConfigIfValid = function loadConfigIfValid(filename) {
  var strip = require('strip-json-comments');
  try {
    JSON.parse(strip(_fs2['default'].readFileSync(filename, 'utf8')));
    return _jshintSrcCli2['default'].loadConfig(filename);
  } catch (e) {}
  return {};
};

var loadConfig = function loadConfig(file) {
  var config = loadNpmConfig(file) || loadConfigIfValid(findConfig(file));
  if (config && config.dirname) {
    delete config.dirname;
  }
  return config;
};

exports['default'] = loadConfig;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYXJhaC8uYXRvbS9wYWNrYWdlcy9qc2hpbnQvbG9hZC1jb25maWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O2tCQUVlLElBQUk7Ozs7b0JBQ0YsTUFBTTs7Ozt1QkFDTixTQUFTOzs7OzRCQUNWLGdCQUFnQjs7Ozt3QkFDWCxXQUFXOzs7O0FBTmhDLFdBQVcsQ0FBQzs7Ozs7O0FBWVosSUFBTSxlQUFlLEdBQUcsRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7O0FBYTNCLElBQU0sUUFBUSxHQUFHLFNBQVgsUUFBUTs7Ozs0QkFBZ0M7UUFBNUIsSUFBSTtBQUFFLE9BQUcsR0FDbkIsUUFBUSxHQUtSLE1BQU07O1FBTlUsR0FBRyxpQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFOztBQUN2QyxRQUFNLFFBQVEsR0FBRyxrQkFBSyxTQUFTLENBQUMsa0JBQUssSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3RELFFBQUksZUFBZSxDQUFDLFFBQVEsQ0FBQyxLQUFLLFNBQVMsRUFBRTtBQUMzQyxhQUFPLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNsQzs7QUFFRCxRQUFNLE1BQU0sR0FBRyxrQkFBSyxPQUFPLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUV4QyxRQUFJLHFCQUFLLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLEVBQUU7QUFDN0IscUJBQWUsQ0FBQyxRQUFRLENBQUMsR0FBRyxRQUFRLENBQUM7QUFDckMsYUFBTyxRQUFRLENBQUM7S0FDakI7O0FBRUQsUUFBSSxHQUFHLEtBQUssTUFBTSxFQUFFO0FBQ2xCLHFCQUFlLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ2pDLGFBQU8sSUFBSSxDQUFDO0tBQ2I7O3dCQUVlLElBQUksRUFBRSxNQUFNOzs7R0FDN0I7Q0FBQSxDQUFDOzs7Ozs7Ozs7O0FBVUYsSUFBTSxVQUFVLEdBQUcsU0FBYixVQUFVLENBQUcsSUFBSSxFQUFJO0FBQ3pCLE1BQU0sR0FBRyxHQUFJLGtCQUFLLE9BQU8sQ0FBQyxrQkFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUM5QyxNQUFNLElBQUksR0FBRyxrQkFBSyxTQUFTLENBQUMsa0JBQUssSUFBSSx3QkFBVyxXQUFXLENBQUMsQ0FBQyxDQUFDOztBQUU5RCxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3hDLE1BQUksSUFBSSxFQUFFO0FBQ1IsV0FBTyxJQUFJLENBQUM7R0FDYjs7QUFFRCxNQUFJLHFCQUFLLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUU7QUFDekIsV0FBTyxJQUFJLENBQUM7R0FDYjs7QUFFRCxTQUFPLElBQUksQ0FBQztDQUNiLENBQUM7Ozs7Ozs7Ozs7QUFVRixJQUFNLGFBQWEsR0FBRyxTQUFoQixhQUFhLENBQUcsSUFBSSxFQUFJO0FBQzVCLE1BQU0sR0FBRyxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxrQkFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUM3QyxNQUFNLEVBQUUsR0FBSSxRQUFRLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxDQUFDOztBQUUxQyxNQUFJLENBQUMsRUFBRSxFQUFFO0FBQ1AsV0FBTyxJQUFJLENBQUM7R0FDYjs7QUFFRCxNQUFJO0FBQ0YsV0FBTyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDO0dBQ2pDLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDVixXQUFPLElBQUksQ0FBQztHQUNiO0NBQ0YsQ0FBQzs7O0FBR0YsSUFBTSxpQkFBaUIsR0FBRyxTQUFwQixpQkFBaUIsQ0FBRyxRQUFRLEVBQUk7QUFDckMsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDN0MsTUFBSTtBQUNILFFBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGdCQUFHLFlBQVksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JELFdBQU8sMEJBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0dBQ2hDLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFDWDtBQUNELFNBQU8sRUFBRSxDQUFDO0NBQ1YsQ0FBQzs7QUFFRixJQUFNLFVBQVUsR0FBRyxTQUFiLFVBQVUsQ0FBRyxJQUFJLEVBQUk7QUFDMUIsTUFBTSxNQUFNLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzFFLE1BQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUU7QUFDN0IsV0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDO0dBQ3RCO0FBQ0QsU0FBTyxNQUFNLENBQUM7Q0FDZCxDQUFDOztxQkFFYSxVQUFVIiwiZmlsZSI6Ii9Vc2Vycy9zYXJhaC8uYXRvbS9wYWNrYWdlcy9qc2hpbnQvbG9hZC1jb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHNoanMgZnJvbSAnc2hlbGxqcyc7XG5pbXBvcnQgY2xpIGZyb20gJ2pzaGludC9zcmMvY2xpJztcbmltcG9ydCB1c2VySG9tZSBmcm9tICd1c2VyLWhvbWUnO1xuXG4vLyBmcm9tIEpTSGludCAvL1xuLy8gU3RvcmFnZSBmb3IgbWVtb2l6ZWQgcmVzdWx0cyBmcm9tIGZpbmQgZmlsZVxuLy8gU2hvdWxkIHByZXZlbnQgbG90cyBvZiBkaXJlY3RvcnkgdHJhdmVyc2FsICZcbi8vIGxvb2t1cHMgd2hlbiBsaW5pdGluZyBhbiBlbnRpcmUgcHJvamVjdFxuY29uc3QgZmluZEZpbGVSZXN1bHRzID0ge307XG5cbi8qKlxuICogU2VhcmNoZXMgZm9yIGEgZmlsZSB3aXRoIGEgc3BlY2lmaWVkIG5hbWUgc3RhcnRpbmcgd2l0aFxuICogJ2RpcicgYW5kIGdvaW5nIGFsbCB0aGUgd2F5IHVwIGVpdGhlciB1bnRpbCBpdCBmaW5kcyB0aGUgZmlsZVxuICogb3IgaGl0cyB0aGUgcm9vdC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBmaWxlbmFtZSB0byBzZWFyY2ggZm9yIChlLmcuIC5qc2hpbnRyYylcbiAqIEBwYXJhbSB7c3RyaW5nfSBkaXIgIGRpcmVjdG9yeSB0byBzdGFydCBzZWFyY2ggZnJvbSAoZGVmYXVsdDpcbiAqICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnkpXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gbm9ybWFsaXplZCBmaWxlbmFtZVxuICovXG5jb25zdCBmaW5kRmlsZSA9IChuYW1lLCBkaXI9cHJvY2Vzcy5jd2QoKSkgPT4ge1xuICBjb25zdCBmaWxlbmFtZSA9IHBhdGgubm9ybWFsaXplKHBhdGguam9pbihkaXIsIG5hbWUpKTtcbiAgaWYgKGZpbmRGaWxlUmVzdWx0c1tmaWxlbmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBmaW5kRmlsZVJlc3VsdHNbZmlsZW5hbWVdO1xuICB9XG5cbiAgY29uc3QgcGFyZW50ID0gcGF0aC5yZXNvbHZlKGRpciwgJy4uLycpO1xuXG4gIGlmIChzaGpzLnRlc3QoJy1lJywgZmlsZW5hbWUpKSB7XG4gICAgZmluZEZpbGVSZXN1bHRzW2ZpbGVuYW1lXSA9IGZpbGVuYW1lO1xuICAgIHJldHVybiBmaWxlbmFtZTtcbiAgfVxuXG4gIGlmIChkaXIgPT09IHBhcmVudCkge1xuICAgIGZpbmRGaWxlUmVzdWx0c1tmaWxlbmFtZV0gPSBudWxsO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIGZpbmRGaWxlKG5hbWUsIHBhcmVudCk7XG59O1xuXG4vKipcbiAqIFRyaWVzIHRvIGZpbmQgYSBjb25maWd1cmF0aW9uIGZpbGUgaW4gZWl0aGVyIHByb2plY3QgZGlyZWN0b3J5XG4gKiBvciBpbiB0aGUgaG9tZSBkaXJlY3RvcnkuIENvbmZpZ3VyYXRpb24gZmlsZXMgYXJlIG5hbWVkXG4gKiAnLmpzaGludHJjJy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZSBwYXRoIHRvIHRoZSBmaWxlIHRvIGJlIGxpbnRlZFxuICogQHJldHVybnMge3N0cmluZ30gYSBwYXRoIHRvIHRoZSBjb25maWcgZmlsZVxuICovXG5jb25zdCBmaW5kQ29uZmlnID0gZmlsZSA9PiB7XG4gIGNvbnN0IGRpciAgPSBwYXRoLmRpcm5hbWUocGF0aC5yZXNvbHZlKGZpbGUpKTtcbiAgY29uc3QgaG9tZSA9IHBhdGgubm9ybWFsaXplKHBhdGguam9pbih1c2VySG9tZSwgJy5qc2hpbnRyYycpKTtcblxuICBjb25zdCBwcm9qID0gZmluZEZpbGUoJy5qc2hpbnRyYycsIGRpcik7XG4gIGlmIChwcm9qKSB7XG4gICAgcmV0dXJuIHByb2o7XG4gIH1cblxuICBpZiAoc2hqcy50ZXN0KCctZScsIGhvbWUpKSB7XG4gICAgcmV0dXJuIGhvbWU7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn07XG5cbi8qKlxuICogVHJpZXMgdG8gZmluZCBKU0hpbnQgY29uZmlndXJhdGlvbiB3aXRoaW4gYSBwYWNrYWdlLmpzb24gZmlsZVxuICogKGlmIGFueSkuIEl0IHNlYXJjaCBpbiB0aGUgY3VycmVudCBkaXJlY3RvcnkgYW5kIHRoZW4gZ29lcyB1cFxuICogYWxsIHRoZSB3YXkgdG8gdGhlIHJvb3QganVzdCBsaWtlIGZpbmRGaWxlLlxuICpcbiAqIEBwYXJhbSAgIHtzdHJpbmd9IGZpbGUgcGF0aCB0byB0aGUgZmlsZSB0byBiZSBsaW50ZWRcbiAqIEByZXR1cm5zIHtvYmplY3R9IGNvbmZpZyBvYmplY3RcbiAqL1xuY29uc3QgbG9hZE5wbUNvbmZpZyA9IGZpbGUgPT4ge1xuICBjb25zdCBkaXIgPSBwYXRoLmRpcm5hbWUocGF0aC5yZXNvbHZlKGZpbGUpKTtcbiAgY29uc3QgZnAgID0gZmluZEZpbGUoJ3BhY2thZ2UuanNvbicsIGRpcik7XG5cbiAgaWYgKCFmcCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdHJ5IHtcbiAgICByZXR1cm4gcmVxdWlyZShmcCkuanNoaW50Q29uZmlnO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn07XG4vLyAvIC8vXG5cbmNvbnN0IGxvYWRDb25maWdJZlZhbGlkID0gZmlsZW5hbWUgPT4ge1xuXHRjb25zdCBzdHJpcCA9IHJlcXVpcmUoJ3N0cmlwLWpzb24tY29tbWVudHMnKTtcblx0dHJ5IHtcblx0XHRKU09OLnBhcnNlKHN0cmlwKGZzLnJlYWRGaWxlU3luYyhmaWxlbmFtZSwgJ3V0ZjgnKSkpO1xuXHRcdHJldHVybiBjbGkubG9hZENvbmZpZyhmaWxlbmFtZSk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0fVxuXHRyZXR1cm4ge307XG59O1xuXG5jb25zdCBsb2FkQ29uZmlnID0gZmlsZSA9PiB7XG5cdGNvbnN0IGNvbmZpZyA9IGxvYWROcG1Db25maWcoZmlsZSkgfHwgbG9hZENvbmZpZ0lmVmFsaWQoZmluZENvbmZpZyhmaWxlKSk7XG5cdGlmIChjb25maWcgJiYgY29uZmlnLmRpcm5hbWUpIHtcblx0XHRkZWxldGUgY29uZmlnLmRpcm5hbWU7XG5cdH1cblx0cmV0dXJuIGNvbmZpZztcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGxvYWRDb25maWc7XG4iXX0=