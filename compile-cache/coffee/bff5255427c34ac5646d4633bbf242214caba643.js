(function() {
  var Linter, LinterCsslint, linterPath,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  linterPath = atom.packages.getLoadedPackage("linter").path;

  Linter = require("" + linterPath + "/lib/linter");

  LinterCsslint = (function(_super) {
    __extends(LinterCsslint, _super);

    LinterCsslint.syntax = ['source.css', 'source.html'];

    LinterCsslint.prototype.cmd = 'csslint --format=compact';

    LinterCsslint.prototype.linterName = 'csslint';

    LinterCsslint.prototype.regex = '.+:\\s*' + '(line (?<line>\\d+), col (?<col>\\d+), )?' + '((?<error>Error)|(?<warning>Warning)) - (?<message>.*)';

    LinterCsslint.prototype.isNodeExecutable = true;

    function LinterCsslint(editor) {
      LinterCsslint.__super__.constructor.call(this, editor);
      atom.config.observe('linter-csslint.csslintExecutablePath', (function(_this) {
        return function() {
          return _this.executablePath = atom.config.get('linter-csslint.csslintExecutablePath');
        };
      })(this));
    }

    LinterCsslint.prototype.destroy = function() {
      return atom.config.unobserve('linter-csslint.csslintExecutablePath');
    };

    return LinterCsslint;

  })(Linter);

  module.exports = LinterCsslint;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQixRQUEvQixDQUF3QyxDQUFDLElBQXRELENBQUE7O0FBQUEsRUFDQSxNQUFBLEdBQVMsT0FBQSxDQUFRLEVBQUEsR0FBRSxVQUFGLEdBQWMsYUFBdEIsQ0FEVCxDQUFBOztBQUFBLEVBR007QUFJSixvQ0FBQSxDQUFBOztBQUFBLElBQUEsYUFBQyxDQUFBLE1BQUQsR0FBUyxDQUFDLFlBQUQsRUFBZSxhQUFmLENBQVQsQ0FBQTs7QUFBQSw0QkFJQSxHQUFBLEdBQUssMEJBSkwsQ0FBQTs7QUFBQSw0QkFNQSxVQUFBLEdBQVksU0FOWixDQUFBOztBQUFBLDRCQVNBLEtBQUEsR0FDRSxTQUFBLEdBSUEsMkNBSkEsR0FLQSx3REFmRixDQUFBOztBQUFBLDRCQWlCQSxnQkFBQSxHQUFrQixJQWpCbEIsQ0FBQTs7QUFtQmEsSUFBQSx1QkFBQyxNQUFELEdBQUE7QUFDWCxNQUFBLCtDQUFNLE1BQU4sQ0FBQSxDQUFBO0FBQUEsTUFFQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0Isc0NBQXBCLEVBQTRELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQzFELEtBQUMsQ0FBQSxjQUFELEdBQWtCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQ0FBaEIsRUFEd0M7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE1RCxDQUZBLENBRFc7SUFBQSxDQW5CYjs7QUFBQSw0QkF5QkEsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUNQLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBWixDQUFzQixzQ0FBdEIsRUFETztJQUFBLENBekJULENBQUE7O3lCQUFBOztLQUowQixPQUg1QixDQUFBOztBQUFBLEVBbUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGFBbkNqQixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/sarah/.atom/packages/linter-csslint/lib/linter-csslint.coffee