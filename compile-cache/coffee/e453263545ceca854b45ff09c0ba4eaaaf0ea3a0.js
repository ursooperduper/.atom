(function() {
  var Settings, _;

  _ = require('underscore-plus');

  module.exports = Settings = (function() {
    function Settings() {}

    Settings.prototype.update = function(settings) {
      if (settings == null) {
        settings = {};
      }
      return this.load(settings);
    };

    Settings.prototype.load = function(settings) {
      var scope, scopedSettings, setting;
      if (settings == null) {
        settings = {};
      }
      if (settings.global != null) {
        settings['*'] = settings.global;
        delete settings.global;
      }
      if (settings['*'] != null) {
        scopedSettings = settings;
        settings = settings['*'];
        delete scopedSettings['*'];
        for (scope in scopedSettings) {
          setting = scopedSettings[scope];
          this.set(setting, scope);
        }
      }
      return this.set(settings);
    };

    Settings.prototype.set = function(settings, scope) {
      var currentValue, flatSettings, options, setting, value, valueOptions, _results;
      flatSettings = {};
      options = scope ? {
        scopeSelector: scope
      } : {};
      options.save = false;
      this.flatten(flatSettings, settings);
      _results = [];
      for (setting in flatSettings) {
        value = flatSettings[setting];
        if (_.isArray(value)) {
          valueOptions = scope ? {
            scope: scope
          } : {};
          currentValue = atom.config.get(setting, valueOptions);
          value = _.union(currentValue, value);
        }
        _results.push(atom.config.set(setting, value, options));
      }
      return _results;
    };

    Settings.prototype.flatten = function(root, dict, path) {
      var dotPath, isObject, key, value, _results;
      _results = [];
      for (key in dict) {
        value = dict[key];
        dotPath = key;
        if (path != null) {
          dotPath = "" + path + "." + key;
        }
        isObject = !_.isArray(value) && _.isObject(value);
        if (!isObject) {
          _results.push(root[dotPath] = value);
        } else {
          _results.push(this.flatten(root, dict[key], dotPath));
        }
      }
      return _results;
    };

    return Settings;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvc2V0dGluZ3MuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFdBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007MEJBQ0o7O0FBQUEsdUJBQUEsTUFBQSxHQUFRLFNBQUMsUUFBRCxHQUFBOztRQUFDLFdBQVM7T0FDaEI7YUFBQSxJQUFDLENBQUEsSUFBRCxDQUFNLFFBQU4sRUFETTtJQUFBLENBQVIsQ0FBQTs7QUFBQSx1QkFHQSxJQUFBLEdBQU0sU0FBQyxRQUFELEdBQUE7QUFDSixVQUFBLDhCQUFBOztRQURLLFdBQVM7T0FDZDtBQUFBLE1BQUEsSUFBRyx1QkFBSDtBQUNFLFFBQUEsUUFBUyxDQUFBLEdBQUEsQ0FBVCxHQUFnQixRQUFRLENBQUMsTUFBekIsQ0FBQTtBQUFBLFFBQ0EsTUFBQSxDQUFBLFFBQWUsQ0FBQyxNQURoQixDQURGO09BQUE7QUFJQSxNQUFBLElBQUcscUJBQUg7QUFDRSxRQUFBLGNBQUEsR0FBaUIsUUFBakIsQ0FBQTtBQUFBLFFBQ0EsUUFBQSxHQUFXLFFBQVMsQ0FBQSxHQUFBLENBRHBCLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBQSxjQUFzQixDQUFBLEdBQUEsQ0FGdEIsQ0FBQTtBQUlBLGFBQUEsdUJBQUE7MENBQUE7QUFBQSxVQUFBLElBQUMsQ0FBQSxHQUFELENBQUssT0FBTCxFQUFjLEtBQWQsQ0FBQSxDQUFBO0FBQUEsU0FMRjtPQUpBO2FBV0EsSUFBQyxDQUFBLEdBQUQsQ0FBSyxRQUFMLEVBWkk7SUFBQSxDQUhOLENBQUE7O0FBQUEsdUJBaUJBLEdBQUEsR0FBSyxTQUFDLFFBQUQsRUFBVyxLQUFYLEdBQUE7QUFDSCxVQUFBLDJFQUFBO0FBQUEsTUFBQSxZQUFBLEdBQWUsRUFBZixDQUFBO0FBQUEsTUFDQSxPQUFBLEdBQWEsS0FBSCxHQUFjO0FBQUEsUUFBQyxhQUFBLEVBQWUsS0FBaEI7T0FBZCxHQUEwQyxFQURwRCxDQUFBO0FBQUEsTUFFQSxPQUFPLENBQUMsSUFBUixHQUFlLEtBRmYsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxZQUFULEVBQXVCLFFBQXZCLENBSkEsQ0FBQTtBQUtBO1dBQUEsdUJBQUE7c0NBQUE7QUFDRSxRQUFBLElBQUcsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxLQUFWLENBQUg7QUFDRSxVQUFBLFlBQUEsR0FBa0IsS0FBSCxHQUFjO0FBQUEsWUFBQyxLQUFBLEVBQU8sS0FBUjtXQUFkLEdBQWtDLEVBQWpELENBQUE7QUFBQSxVQUNBLFlBQUEsR0FBZSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsT0FBaEIsRUFBeUIsWUFBekIsQ0FEZixDQUFBO0FBQUEsVUFFQSxLQUFBLEdBQVEsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxZQUFSLEVBQXNCLEtBQXRCLENBRlIsQ0FERjtTQUFBO0FBQUEsc0JBSUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLE9BQWhCLEVBQXlCLEtBQXpCLEVBQWdDLE9BQWhDLEVBSkEsQ0FERjtBQUFBO3NCQU5HO0lBQUEsQ0FqQkwsQ0FBQTs7QUFBQSx1QkE4QkEsT0FBQSxHQUFTLFNBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEdBQUE7QUFDUCxVQUFBLHVDQUFBO0FBQUE7V0FBQSxXQUFBOzBCQUFBO0FBQ0UsUUFBQSxPQUFBLEdBQVUsR0FBVixDQUFBO0FBQ0EsUUFBQSxJQUE4QixZQUE5QjtBQUFBLFVBQUEsT0FBQSxHQUFVLEVBQUEsR0FBRyxJQUFILEdBQVEsR0FBUixHQUFXLEdBQXJCLENBQUE7U0FEQTtBQUFBLFFBRUEsUUFBQSxHQUFXLENBQUEsQ0FBSyxDQUFDLE9BQUYsQ0FBVSxLQUFWLENBQUosSUFBeUIsQ0FBQyxDQUFDLFFBQUYsQ0FBVyxLQUFYLENBRnBDLENBQUE7QUFHQSxRQUFBLElBQUcsQ0FBQSxRQUFIO3dCQUNFLElBQUssQ0FBQSxPQUFBLENBQUwsR0FBZ0IsT0FEbEI7U0FBQSxNQUFBO3dCQUdFLElBQUMsQ0FBQSxPQUFELENBQVMsSUFBVCxFQUFlLElBQUssQ0FBQSxHQUFBLENBQXBCLEVBQTBCLE9BQTFCLEdBSEY7U0FKRjtBQUFBO3NCQURPO0lBQUEsQ0E5QlQsQ0FBQTs7b0JBQUE7O01BSkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/sarah/.atom/packages/project-manager/lib/settings.coffee
