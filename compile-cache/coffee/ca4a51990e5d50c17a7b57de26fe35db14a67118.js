(function() {
  var ColorContext, ColorParser, ColorSearch, Emitter, Minimatch, getRegistry;

  Emitter = require('atom').Emitter;

  Minimatch = require('minimatch').Minimatch;

  getRegistry = require('./color-expressions').getRegistry;

  ColorParser = require('./color-parser');

  ColorContext = require('./color-context');

  module.exports = ColorSearch = (function() {
    function ColorSearch(options) {
      var error, ignore, ignoredNames, _i, _len;
      if (options == null) {
        options = {};
      }
      this.sourceNames = options.sourceNames, ignoredNames = options.ignoredNames, this.context = options.context;
      this.emitter = new Emitter;
      this.parser = new ColorParser;
      if (this.context == null) {
        this.context = new ColorContext([]);
      }
      this.variables = this.context.getVariables();
      if (this.sourceNames == null) {
        this.sourceNames = [];
      }
      this.context.parser = this.parser;
      if (ignoredNames == null) {
        ignoredNames = [];
      }
      this.ignoredNames = [];
      for (_i = 0, _len = ignoredNames.length; _i < _len; _i++) {
        ignore = ignoredNames[_i];
        if (ignore != null) {
          try {
            this.ignoredNames.push(new Minimatch(ignore, {
              matchBase: true,
              dot: true
            }));
          } catch (_error) {
            error = _error;
            console.warn("Error parsing ignore pattern (" + ignore + "): " + error.message);
          }
        }
      }
    }

    ColorSearch.prototype.onDidFindMatches = function(callback) {
      return this.emitter.on('did-find-matches', callback);
    };

    ColorSearch.prototype.onDidCompleteSearch = function(callback) {
      return this.emitter.on('did-complete-search', callback);
    };

    ColorSearch.prototype.search = function() {
      var promise, re, registry, results;
      registry = getRegistry(this.context);
      re = new RegExp(registry.getRegExp());
      results = [];
      promise = atom.workspace.scan(re, {
        paths: this.sourceNames
      }, (function(_this) {
        return function(m) {
          var newMatches, relativePath, result, _i, _len, _ref, _ref1;
          relativePath = atom.project.relativize(m.filePath);
          if (_this.isIgnored(relativePath)) {
            return;
          }
          newMatches = [];
          _ref = m.matches;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            result = _ref[_i];
            result.color = _this.parser.parse(result.matchText, _this.context);
            if (!((_ref1 = result.color) != null ? _ref1.isValid() : void 0)) {
              continue;
            }
            if (result.range[0] == null) {
              console.warn("Color search returned a result with an invalid range", result);
              continue;
            }
            result.range[0][1] += result.matchText.indexOf(result.color.colorExpression);
            result.matchText = result.color.colorExpression;
            results.push(result);
            newMatches.push(result);
          }
          m.matches = newMatches;
          if (m.matches.length > 0) {
            return _this.emitter.emit('did-find-matches', m);
          }
        };
      })(this));
      return promise.then((function(_this) {
        return function() {
          _this.results = results;
          return _this.emitter.emit('did-complete-search', results);
        };
      })(this));
    };

    ColorSearch.prototype.isIgnored = function(relativePath) {
      var ignoredName, _i, _len, _ref;
      _ref = this.ignoredNames;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ignoredName = _ref[_i];
        if (ignoredName.match(relativePath)) {
          return true;
        }
      }
    };

    return ColorSearch;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9jb2xvci1zZWFyY2guY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVFQUFBOztBQUFBLEVBQUMsVUFBVyxPQUFBLENBQVEsTUFBUixFQUFYLE9BQUQsQ0FBQTs7QUFBQSxFQUNDLFlBQWEsT0FBQSxDQUFRLFdBQVIsRUFBYixTQURELENBQUE7O0FBQUEsRUFFQyxjQUFlLE9BQUEsQ0FBUSxxQkFBUixFQUFmLFdBRkQsQ0FBQTs7QUFBQSxFQUdBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FIZCxDQUFBOztBQUFBLEVBSUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxpQkFBUixDQUpmLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSxxQkFBQyxPQUFELEdBQUE7QUFDWCxVQUFBLHFDQUFBOztRQURZLFVBQVE7T0FDcEI7QUFBQSxNQUFDLElBQUMsQ0FBQSxzQkFBQSxXQUFGLEVBQWUsdUJBQUEsWUFBZixFQUE2QixJQUFDLENBQUEsa0JBQUEsT0FBOUIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUFBLENBQUEsT0FEWCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsTUFBRCxHQUFVLEdBQUEsQ0FBQSxXQUZWLENBQUE7O1FBR0EsSUFBQyxDQUFBLFVBQWUsSUFBQSxZQUFBLENBQWEsRUFBYjtPQUhoQjtBQUFBLE1BSUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFDLENBQUEsT0FBTyxDQUFDLFlBQVQsQ0FBQSxDQUpiLENBQUE7O1FBS0EsSUFBQyxDQUFBLGNBQWU7T0FMaEI7QUFBQSxNQU1BLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxHQUFrQixJQUFDLENBQUEsTUFObkIsQ0FBQTs7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

//# sourceURL=/Users/sarah/.atom/packages/pigments/lib/color-search.coffee
