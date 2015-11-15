(function() {
  var Linter, LinterScssLint, findFile, linterPath,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  linterPath = atom.packages.getLoadedPackage("linter").path;

  Linter = require("" + linterPath + "/lib/linter");

  findFile = require("" + linterPath + "/lib/util");

  LinterScssLint = (function(_super) {
    __extends(LinterScssLint, _super);

    function LinterScssLint() {
      this.updateOption = __bind(this.updateOption, this);
      return LinterScssLint.__super__.constructor.apply(this, arguments);
    }

    LinterScssLint.syntax = 'source.css.scss';

    LinterScssLint.prototype.linterName = 'scss-lint';

    LinterScssLint.prototype.options = ['excludedLinters', 'executablePath'];

    LinterScssLint.prototype.regex = 'line="(?<line>\\d+)" column="(?<col>\\d+)" .*? severity="((?<error>error)|(?<warning>warning))" reason="(?<message>.*?)"';

    LinterScssLint.prototype.updateOption = function(option) {
      var config;
      LinterScssLint.__super__.updateOption.call(this, option);
      this.cmd = 'scss-lint --format=XML';
      if (this.excludedLinters && this.excludedLinters.length > 0) {
        this.cmd += " --exclude-linter=" + (this.excludedLinters.toString());
      }
      config = findFile(this.cwd, ['.scss-lint.yml']);
      if (config) {
        return this.cmd += " -c " + config;
      }
    };

    LinterScssLint.prototype.formatMessage = function(match) {
      var key, map, message, regex, value;
      map = {
        quot: '"',
        amp: '&',
        lt: '<',
        gt: '>'
      };
      message = match.message;
      for (key in map) {
        value = map[key];
        regex = new RegExp('&' + key + ';', 'g');
        message = message.replace(regex, value);
      }
      return message;
    };

    return LinterScssLint;

  })(Linter);

  module.exports = LinterScssLint;

}).call(this);
