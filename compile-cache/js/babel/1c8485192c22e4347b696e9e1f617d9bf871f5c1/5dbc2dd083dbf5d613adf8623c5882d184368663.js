'use strict';
var fs = require('fs');
var path = require('path');
var shjs = require('shelljs');
var cli = require('jshint/src/cli');
var userHome = require('user-home');

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
function findFile(_x, _x2) {
  var _again = true;

  _function: while (_again) {
    var name = _x,
        dir = _x2;
    filename = parent = undefined;
    _again = false;

    dir = dir || process.cwd();

    var filename = path.normalize(path.join(dir, name));
    if (findFileResults[filename] !== undefined) {
      return findFileResults[filename];
    }

    var parent = path.resolve(dir, '../');

    if (shjs.test('-e', filename)) {
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
}

/**
 * Tries to find a configuration file in either project directory
 * or in the home directory. Configuration files are named
 * '.jshintrc'.
 *
 * @param {string} file path to the file to be linted
 * @returns {string} a path to the config file
 */
function findConfig(file) {
  var dir = path.dirname(path.resolve(file));
  var home = path.normalize(path.join(userHome, '.jshintrc'));

  var proj = findFile('.jshintrc', dir);
  if (proj) {
    return proj;
  }

  if (shjs.test('-e', home)) {
    return home;
  }

  return null;
}

/**
 * Tries to find JSHint configuration within a package.json file
 * (if any). It search in the current directory and then goes up
 * all the way to the root just like findFile.
 *
 * @param   {string} file path to the file to be linted
 * @returns {object} config object
 */
function loadNpmConfig(file) {
  var dir = path.dirname(path.resolve(file));
  var fp = findFile('package.json', dir);

  if (!fp) {
    return null;
  }

  try {
    return require(fp).jshintConfig;
  } catch (e) {
    return null;
  }
}
// / //

function loadConfigIfValid(filename) {
  var strip = require('strip-json-comments');
  try {
    JSON.parse(strip(fs.readFileSync(filename, 'utf8')));
    return cli.loadConfig(filename);
  } catch (e) {}
  return {};
}

module.exports = function (file) {
  var config = loadNpmConfig(file) || loadConfigIfValid(findConfig(file));
  if (config && config.dirname) {
    delete config.dirname;
  }
  return config;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYXJhaC8uYXRvbS9wYWNrYWdlcy9qc2hpbnQvbG9hZC1jb25maWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDO0FBQ2IsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDOUIsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDcEMsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDOzs7Ozs7QUFNcEMsSUFBSSxlQUFlLEdBQUcsRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7O0FBYXpCLFNBQVMsUUFBUTs7OzRCQUFZO1FBQVgsSUFBSTtRQUFFLEdBQUc7QUFHckIsWUFBUSxHQUtSLE1BQU07OztBQVBWLE9BQUcsR0FBRyxHQUFHLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDOztBQUUzQixRQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDcEQsUUFBSSxlQUFlLENBQUMsUUFBUSxDQUFDLEtBQUssU0FBUyxFQUFFO0FBQzNDLGFBQU8sZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ2xDOztBQUVELFFBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUV0QyxRQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxFQUFFO0FBQzdCLHFCQUFlLENBQUMsUUFBUSxDQUFDLEdBQUcsUUFBUSxDQUFDO0FBQ3JDLGFBQU8sUUFBUSxDQUFDO0tBQ2pCOztBQUVELFFBQUksR0FBRyxLQUFLLE1BQU0sRUFBRTtBQUNsQixxQkFBZSxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUNqQyxhQUFPLElBQUksQ0FBQztLQUNiOztTQUVlLElBQUk7VUFBRSxNQUFNOzs7R0FDN0I7Q0FBQTs7Ozs7Ozs7OztBQVVELFNBQVMsVUFBVSxDQUFDLElBQUksRUFBRTtBQUN4QixNQUFJLEdBQUcsR0FBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUM1QyxNQUFJLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7O0FBRTVELE1BQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDdEMsTUFBSSxJQUFJLEVBQUU7QUFDUixXQUFPLElBQUksQ0FBQztHQUNiOztBQUVELE1BQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUU7QUFDekIsV0FBTyxJQUFJLENBQUM7R0FDYjs7QUFFRCxTQUFPLElBQUksQ0FBQztDQUNiOzs7Ozs7Ozs7O0FBVUQsU0FBUyxhQUFhLENBQUMsSUFBSSxFQUFFO0FBQzNCLE1BQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzNDLE1BQUksRUFBRSxHQUFJLFFBQVEsQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDLENBQUM7O0FBRXhDLE1BQUksQ0FBQyxFQUFFLEVBQUU7QUFDUCxXQUFPLElBQUksQ0FBQztHQUNiOztBQUVELE1BQUk7QUFDRixXQUFPLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUM7R0FDakMsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNWLFdBQU8sSUFBSSxDQUFDO0dBQ2I7Q0FDRjs7O0FBR0QsU0FBUyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUU7QUFDcEMsTUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDM0MsTUFBSTtBQUNILFFBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyRCxXQUFPLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7R0FDaEMsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUNYO0FBQ0QsU0FBTyxFQUFFLENBQUM7Q0FDVjs7QUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsSUFBSSxFQUFFO0FBQ2hDLE1BQUksTUFBTSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUN4RSxNQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFO0FBQzdCLFdBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQztHQUN0QjtBQUNELFNBQU8sTUFBTSxDQUFDO0NBQ2QsQ0FBQyIsImZpbGUiOiIvVXNlcnMvc2FyYWgvLmF0b20vcGFja2FnZXMvanNoaW50L2xvYWQtY29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xudmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xudmFyIHNoanMgPSByZXF1aXJlKCdzaGVsbGpzJyk7XG52YXIgY2xpID0gcmVxdWlyZSgnanNoaW50L3NyYy9jbGknKTtcbnZhciB1c2VySG9tZSA9IHJlcXVpcmUoJ3VzZXItaG9tZScpO1xuXG4vLyBmcm9tIEpTSGludCAvL1xuLy8gU3RvcmFnZSBmb3IgbWVtb2l6ZWQgcmVzdWx0cyBmcm9tIGZpbmQgZmlsZVxuLy8gU2hvdWxkIHByZXZlbnQgbG90cyBvZiBkaXJlY3RvcnkgdHJhdmVyc2FsICZcbi8vIGxvb2t1cHMgd2hlbiBsaW5pdGluZyBhbiBlbnRpcmUgcHJvamVjdFxudmFyIGZpbmRGaWxlUmVzdWx0cyA9IHt9O1xuXG4vKipcbiAqIFNlYXJjaGVzIGZvciBhIGZpbGUgd2l0aCBhIHNwZWNpZmllZCBuYW1lIHN0YXJ0aW5nIHdpdGhcbiAqICdkaXInIGFuZCBnb2luZyBhbGwgdGhlIHdheSB1cCBlaXRoZXIgdW50aWwgaXQgZmluZHMgdGhlIGZpbGVcbiAqIG9yIGhpdHMgdGhlIHJvb3QuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgZmlsZW5hbWUgdG8gc2VhcmNoIGZvciAoZS5nLiAuanNoaW50cmMpXG4gKiBAcGFyYW0ge3N0cmluZ30gZGlyICBkaXJlY3RvcnkgdG8gc3RhcnQgc2VhcmNoIGZyb20gKGRlZmF1bHQ6XG4gKiAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5KVxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IG5vcm1hbGl6ZWQgZmlsZW5hbWVcbiAqL1xuZnVuY3Rpb24gZmluZEZpbGUobmFtZSwgZGlyKSB7XG4gIGRpciA9IGRpciB8fCBwcm9jZXNzLmN3ZCgpO1xuXG4gIHZhciBmaWxlbmFtZSA9IHBhdGgubm9ybWFsaXplKHBhdGguam9pbihkaXIsIG5hbWUpKTtcbiAgaWYgKGZpbmRGaWxlUmVzdWx0c1tmaWxlbmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBmaW5kRmlsZVJlc3VsdHNbZmlsZW5hbWVdO1xuICB9XG5cbiAgdmFyIHBhcmVudCA9IHBhdGgucmVzb2x2ZShkaXIsICcuLi8nKTtcblxuICBpZiAoc2hqcy50ZXN0KCctZScsIGZpbGVuYW1lKSkge1xuICAgIGZpbmRGaWxlUmVzdWx0c1tmaWxlbmFtZV0gPSBmaWxlbmFtZTtcbiAgICByZXR1cm4gZmlsZW5hbWU7XG4gIH1cblxuICBpZiAoZGlyID09PSBwYXJlbnQpIHtcbiAgICBmaW5kRmlsZVJlc3VsdHNbZmlsZW5hbWVdID0gbnVsbDtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBmaW5kRmlsZShuYW1lLCBwYXJlbnQpO1xufVxuXG4vKipcbiAqIFRyaWVzIHRvIGZpbmQgYSBjb25maWd1cmF0aW9uIGZpbGUgaW4gZWl0aGVyIHByb2plY3QgZGlyZWN0b3J5XG4gKiBvciBpbiB0aGUgaG9tZSBkaXJlY3RvcnkuIENvbmZpZ3VyYXRpb24gZmlsZXMgYXJlIG5hbWVkXG4gKiAnLmpzaGludHJjJy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZSBwYXRoIHRvIHRoZSBmaWxlIHRvIGJlIGxpbnRlZFxuICogQHJldHVybnMge3N0cmluZ30gYSBwYXRoIHRvIHRoZSBjb25maWcgZmlsZVxuICovXG5mdW5jdGlvbiBmaW5kQ29uZmlnKGZpbGUpIHtcbiAgdmFyIGRpciAgPSBwYXRoLmRpcm5hbWUocGF0aC5yZXNvbHZlKGZpbGUpKTtcbiAgdmFyIGhvbWUgPSBwYXRoLm5vcm1hbGl6ZShwYXRoLmpvaW4odXNlckhvbWUsICcuanNoaW50cmMnKSk7XG5cbiAgdmFyIHByb2ogPSBmaW5kRmlsZSgnLmpzaGludHJjJywgZGlyKTtcbiAgaWYgKHByb2opIHtcbiAgICByZXR1cm4gcHJvajtcbiAgfVxuXG4gIGlmIChzaGpzLnRlc3QoJy1lJywgaG9tZSkpIHtcbiAgICByZXR1cm4gaG9tZTtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIFRyaWVzIHRvIGZpbmQgSlNIaW50IGNvbmZpZ3VyYXRpb24gd2l0aGluIGEgcGFja2FnZS5qc29uIGZpbGVcbiAqIChpZiBhbnkpLiBJdCBzZWFyY2ggaW4gdGhlIGN1cnJlbnQgZGlyZWN0b3J5IGFuZCB0aGVuIGdvZXMgdXBcbiAqIGFsbCB0aGUgd2F5IHRvIHRoZSByb290IGp1c3QgbGlrZSBmaW5kRmlsZS5cbiAqXG4gKiBAcGFyYW0gICB7c3RyaW5nfSBmaWxlIHBhdGggdG8gdGhlIGZpbGUgdG8gYmUgbGludGVkXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBjb25maWcgb2JqZWN0XG4gKi9cbmZ1bmN0aW9uIGxvYWROcG1Db25maWcoZmlsZSkge1xuICB2YXIgZGlyID0gcGF0aC5kaXJuYW1lKHBhdGgucmVzb2x2ZShmaWxlKSk7XG4gIHZhciBmcCAgPSBmaW5kRmlsZSgncGFja2FnZS5qc29uJywgZGlyKTtcblxuICBpZiAoIWZwKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB0cnkge1xuICAgIHJldHVybiByZXF1aXJlKGZwKS5qc2hpbnRDb25maWc7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuLy8gLyAvL1xuXG5mdW5jdGlvbiBsb2FkQ29uZmlnSWZWYWxpZChmaWxlbmFtZSkge1xuXHR2YXIgc3RyaXAgPSByZXF1aXJlKCdzdHJpcC1qc29uLWNvbW1lbnRzJyk7XG5cdHRyeSB7XG5cdFx0SlNPTi5wYXJzZShzdHJpcChmcy5yZWFkRmlsZVN5bmMoZmlsZW5hbWUsICd1dGY4JykpKTtcblx0XHRyZXR1cm4gY2xpLmxvYWRDb25maWcoZmlsZW5hbWUpO1xuXHR9IGNhdGNoIChlKSB7XG5cdH1cblx0cmV0dXJuIHt9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmaWxlKSB7XG5cdHZhciBjb25maWcgPSBsb2FkTnBtQ29uZmlnKGZpbGUpIHx8IGxvYWRDb25maWdJZlZhbGlkKGZpbmRDb25maWcoZmlsZSkpO1xuXHRpZiAoY29uZmlnICYmIGNvbmZpZy5kaXJuYW1lKSB7XG5cdFx0ZGVsZXRlIGNvbmZpZy5kaXJuYW1lO1xuXHR9XG5cdHJldHVybiBjb25maWc7XG59O1xuIl19