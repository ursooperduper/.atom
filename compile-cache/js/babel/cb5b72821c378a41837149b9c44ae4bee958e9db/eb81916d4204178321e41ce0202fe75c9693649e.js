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

// from JSHint //
// Storage for memoized results from find file
// Should prevent lots of directory traversal &
// lookups when liniting an entire project
'use babel';

var findFileResults = {};

/**
 * Searches for a file with a specified name starting with
 * 'dir' and going all the way up either until it finds the file
 * or hits the root.
 *
 * @param {string} name filename to search for (e.g. .jshintrc)
 * @param {string} dir  directory to start search from
 *
 * @returns {string} normalized filename
 */
var findFile = function findFile(_x, _x2) {
  var _again = true;

  _function: while (_again) {
    var name = _x,
        dir = _x2;
    filename = parent = undefined;
    _again = false;

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

    _x = name;
    _x2 = parent;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYXJhaC8uYXRvbS9wYWNrYWdlcy9qc2hpbnQvbG9hZC1jb25maWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O2tCQUVlLElBQUk7Ozs7b0JBQ0YsTUFBTTs7Ozt1QkFDTixTQUFTOzs7OzRCQUNWLGdCQUFnQjs7Ozt3QkFDWCxXQUFXOzs7Ozs7OztBQU5oQyxXQUFXLENBQUM7O0FBWVosSUFBTSxlQUFlLEdBQUcsRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7QUFZM0IsSUFBTSxRQUFRLEdBQUcsU0FBWCxRQUFROzs7NEJBQWtCO1FBQWQsSUFBSTtRQUFFLEdBQUc7QUFDbkIsWUFBUSxHQUtSLE1BQU07OztBQUxaLFFBQU0sUUFBUSxHQUFHLGtCQUFLLFNBQVMsQ0FBQyxrQkFBSyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDdEQsUUFBSSxlQUFlLENBQUMsUUFBUSxDQUFDLEtBQUssU0FBUyxFQUFFO0FBQzNDLGFBQU8sZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ2xDOztBQUVELFFBQU0sTUFBTSxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7O0FBRXhDLFFBQUkscUJBQUssSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsRUFBRTtBQUM3QixxQkFBZSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFFBQVEsQ0FBQztBQUNyQyxhQUFPLFFBQVEsQ0FBQztLQUNqQjs7QUFFRCxRQUFJLEdBQUcsS0FBSyxNQUFNLEVBQUU7QUFDbEIscUJBQWUsQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDakMsYUFBTyxJQUFJLENBQUM7S0FDYjs7U0FFZSxJQUFJO1VBQUUsTUFBTTs7O0dBQzdCO0NBQUEsQ0FBQzs7Ozs7Ozs7OztBQVVGLElBQU0sVUFBVSxHQUFHLFNBQWIsVUFBVSxDQUFHLElBQUksRUFBSTtBQUN6QixNQUFNLEdBQUcsR0FBSSxrQkFBSyxPQUFPLENBQUMsa0JBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDOUMsTUFBTSxJQUFJLEdBQUcsa0JBQUssU0FBUyxDQUFDLGtCQUFLLElBQUksd0JBQVcsV0FBVyxDQUFDLENBQUMsQ0FBQzs7QUFFOUQsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN4QyxNQUFJLElBQUksRUFBRTtBQUNSLFdBQU8sSUFBSSxDQUFDO0dBQ2I7O0FBRUQsTUFBSSxxQkFBSyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFO0FBQ3pCLFdBQU8sSUFBSSxDQUFDO0dBQ2I7O0FBRUQsU0FBTyxJQUFJLENBQUM7Q0FDYixDQUFDOzs7Ozs7Ozs7O0FBVUYsSUFBTSxhQUFhLEdBQUcsU0FBaEIsYUFBYSxDQUFHLElBQUksRUFBSTtBQUM1QixNQUFNLEdBQUcsR0FBRyxrQkFBSyxPQUFPLENBQUMsa0JBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDN0MsTUFBTSxFQUFFLEdBQUksUUFBUSxDQUFDLGNBQWMsRUFBRSxHQUFHLENBQUMsQ0FBQzs7QUFFMUMsTUFBSSxDQUFDLEVBQUUsRUFBRTtBQUNQLFdBQU8sSUFBSSxDQUFDO0dBQ2I7O0FBRUQsTUFBSTtBQUNGLFdBQU8sT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQztHQUNqQyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1YsV0FBTyxJQUFJLENBQUM7R0FDYjtDQUNGLENBQUM7OztBQUdGLElBQU0saUJBQWlCLEdBQUcsU0FBcEIsaUJBQWlCLENBQUcsUUFBUSxFQUFJO0FBQ3JDLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQzdDLE1BQUk7QUFDSCxRQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxnQkFBRyxZQUFZLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyRCxXQUFPLDBCQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztHQUNoQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQ1g7QUFDRCxTQUFPLEVBQUUsQ0FBQztDQUNWLENBQUM7O0FBRUYsSUFBTSxVQUFVLEdBQUcsU0FBYixVQUFVLENBQUcsSUFBSSxFQUFJO0FBQzFCLE1BQU0sTUFBTSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUMxRSxNQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFO0FBQzdCLFdBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQztHQUN0QjtBQUNELFNBQU8sTUFBTSxDQUFDO0NBQ2QsQ0FBQzs7cUJBRWEsVUFBVSIsImZpbGUiOiIvVXNlcnMvc2FyYWgvLmF0b20vcGFja2FnZXMvanNoaW50L2xvYWQtY29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBzaGpzIGZyb20gJ3NoZWxsanMnO1xuaW1wb3J0IGNsaSBmcm9tICdqc2hpbnQvc3JjL2NsaSc7XG5pbXBvcnQgdXNlckhvbWUgZnJvbSAndXNlci1ob21lJztcblxuLy8gZnJvbSBKU0hpbnQgLy9cbi8vIFN0b3JhZ2UgZm9yIG1lbW9pemVkIHJlc3VsdHMgZnJvbSBmaW5kIGZpbGVcbi8vIFNob3VsZCBwcmV2ZW50IGxvdHMgb2YgZGlyZWN0b3J5IHRyYXZlcnNhbCAmXG4vLyBsb29rdXBzIHdoZW4gbGluaXRpbmcgYW4gZW50aXJlIHByb2plY3RcbmNvbnN0IGZpbmRGaWxlUmVzdWx0cyA9IHt9O1xuXG4vKipcbiAqIFNlYXJjaGVzIGZvciBhIGZpbGUgd2l0aCBhIHNwZWNpZmllZCBuYW1lIHN0YXJ0aW5nIHdpdGhcbiAqICdkaXInIGFuZCBnb2luZyBhbGwgdGhlIHdheSB1cCBlaXRoZXIgdW50aWwgaXQgZmluZHMgdGhlIGZpbGVcbiAqIG9yIGhpdHMgdGhlIHJvb3QuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgZmlsZW5hbWUgdG8gc2VhcmNoIGZvciAoZS5nLiAuanNoaW50cmMpXG4gKiBAcGFyYW0ge3N0cmluZ30gZGlyICBkaXJlY3RvcnkgdG8gc3RhcnQgc2VhcmNoIGZyb21cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBub3JtYWxpemVkIGZpbGVuYW1lXG4gKi9cbmNvbnN0IGZpbmRGaWxlID0gKG5hbWUsIGRpcikgPT4ge1xuICBjb25zdCBmaWxlbmFtZSA9IHBhdGgubm9ybWFsaXplKHBhdGguam9pbihkaXIsIG5hbWUpKTtcbiAgaWYgKGZpbmRGaWxlUmVzdWx0c1tmaWxlbmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBmaW5kRmlsZVJlc3VsdHNbZmlsZW5hbWVdO1xuICB9XG5cbiAgY29uc3QgcGFyZW50ID0gcGF0aC5yZXNvbHZlKGRpciwgJy4uLycpO1xuXG4gIGlmIChzaGpzLnRlc3QoJy1lJywgZmlsZW5hbWUpKSB7XG4gICAgZmluZEZpbGVSZXN1bHRzW2ZpbGVuYW1lXSA9IGZpbGVuYW1lO1xuICAgIHJldHVybiBmaWxlbmFtZTtcbiAgfVxuXG4gIGlmIChkaXIgPT09IHBhcmVudCkge1xuICAgIGZpbmRGaWxlUmVzdWx0c1tmaWxlbmFtZV0gPSBudWxsO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIGZpbmRGaWxlKG5hbWUsIHBhcmVudCk7XG59O1xuXG4vKipcbiAqIFRyaWVzIHRvIGZpbmQgYSBjb25maWd1cmF0aW9uIGZpbGUgaW4gZWl0aGVyIHByb2plY3QgZGlyZWN0b3J5XG4gKiBvciBpbiB0aGUgaG9tZSBkaXJlY3RvcnkuIENvbmZpZ3VyYXRpb24gZmlsZXMgYXJlIG5hbWVkXG4gKiAnLmpzaGludHJjJy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZSBwYXRoIHRvIHRoZSBmaWxlIHRvIGJlIGxpbnRlZFxuICogQHJldHVybnMge3N0cmluZ30gYSBwYXRoIHRvIHRoZSBjb25maWcgZmlsZVxuICovXG5jb25zdCBmaW5kQ29uZmlnID0gZmlsZSA9PiB7XG4gIGNvbnN0IGRpciAgPSBwYXRoLmRpcm5hbWUocGF0aC5yZXNvbHZlKGZpbGUpKTtcbiAgY29uc3QgaG9tZSA9IHBhdGgubm9ybWFsaXplKHBhdGguam9pbih1c2VySG9tZSwgJy5qc2hpbnRyYycpKTtcblxuICBjb25zdCBwcm9qID0gZmluZEZpbGUoJy5qc2hpbnRyYycsIGRpcik7XG4gIGlmIChwcm9qKSB7XG4gICAgcmV0dXJuIHByb2o7XG4gIH1cblxuICBpZiAoc2hqcy50ZXN0KCctZScsIGhvbWUpKSB7XG4gICAgcmV0dXJuIGhvbWU7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn07XG5cbi8qKlxuICogVHJpZXMgdG8gZmluZCBKU0hpbnQgY29uZmlndXJhdGlvbiB3aXRoaW4gYSBwYWNrYWdlLmpzb24gZmlsZVxuICogKGlmIGFueSkuIEl0IHNlYXJjaCBpbiB0aGUgY3VycmVudCBkaXJlY3RvcnkgYW5kIHRoZW4gZ29lcyB1cFxuICogYWxsIHRoZSB3YXkgdG8gdGhlIHJvb3QganVzdCBsaWtlIGZpbmRGaWxlLlxuICpcbiAqIEBwYXJhbSAgIHtzdHJpbmd9IGZpbGUgcGF0aCB0byB0aGUgZmlsZSB0byBiZSBsaW50ZWRcbiAqIEByZXR1cm5zIHtvYmplY3R9IGNvbmZpZyBvYmplY3RcbiAqL1xuY29uc3QgbG9hZE5wbUNvbmZpZyA9IGZpbGUgPT4ge1xuICBjb25zdCBkaXIgPSBwYXRoLmRpcm5hbWUocGF0aC5yZXNvbHZlKGZpbGUpKTtcbiAgY29uc3QgZnAgID0gZmluZEZpbGUoJ3BhY2thZ2UuanNvbicsIGRpcik7XG5cbiAgaWYgKCFmcCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdHJ5IHtcbiAgICByZXR1cm4gcmVxdWlyZShmcCkuanNoaW50Q29uZmlnO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn07XG4vLyAvIC8vXG5cbmNvbnN0IGxvYWRDb25maWdJZlZhbGlkID0gZmlsZW5hbWUgPT4ge1xuXHRjb25zdCBzdHJpcCA9IHJlcXVpcmUoJ3N0cmlwLWpzb24tY29tbWVudHMnKTtcblx0dHJ5IHtcblx0XHRKU09OLnBhcnNlKHN0cmlwKGZzLnJlYWRGaWxlU3luYyhmaWxlbmFtZSwgJ3V0ZjgnKSkpO1xuXHRcdHJldHVybiBjbGkubG9hZENvbmZpZyhmaWxlbmFtZSk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0fVxuXHRyZXR1cm4ge307XG59O1xuXG5jb25zdCBsb2FkQ29uZmlnID0gZmlsZSA9PiB7XG5cdGNvbnN0IGNvbmZpZyA9IGxvYWROcG1Db25maWcoZmlsZSkgfHwgbG9hZENvbmZpZ0lmVmFsaWQoZmluZENvbmZpZyhmaWxlKSk7XG5cdGlmIChjb25maWcgJiYgY29uZmlnLmRpcm5hbWUpIHtcblx0XHRkZWxldGUgY29uZmlnLmRpcm5hbWU7XG5cdH1cblx0cmV0dXJuIGNvbmZpZztcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGxvYWRDb25maWc7XG4iXX0=