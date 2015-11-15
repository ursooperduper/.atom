(function() {
  module.exports = {
    flatten: function(root, dict, path) {
      var dotPath, isObject, key, value, _, _results;
      _ = require('underscore-plus');
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
    },
    resetUserSettings: function(settings, scope) {
      var currentValue, flatSettings, options, setting, value, valueOptions, _, _results;
      _ = require('underscore-plus');
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
    },
    enable: function(settings) {
      var scope, scopedSettings, setting;
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
          this.resetUserSettings(setting, scope);
        }
      }
      return this.resetUserSettings(settings);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvc2V0dGluZ3MuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE9BQUEsRUFBUyxTQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixHQUFBO0FBQ1AsVUFBQSwwQ0FBQTtBQUFBLE1BQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7QUFDQTtXQUFBLFdBQUE7MEJBQUE7QUFDRSxRQUFBLE9BQUEsR0FBVSxHQUFWLENBQUE7QUFDQSxRQUFBLElBQThCLFlBQTlCO0FBQUEsVUFBQSxPQUFBLEdBQVUsRUFBQSxHQUFHLElBQUgsR0FBUSxHQUFSLEdBQVcsR0FBckIsQ0FBQTtTQURBO0FBQUEsUUFFQSxRQUFBLEdBQVcsQ0FBQSxDQUFLLENBQUMsT0FBRixDQUFVLEtBQVYsQ0FBSixJQUF5QixDQUFDLENBQUMsUUFBRixDQUFXLEtBQVgsQ0FGcEMsQ0FBQTtBQUdBLFFBQUEsSUFBRyxDQUFBLFFBQUg7d0JBQ0UsSUFBSyxDQUFBLE9BQUEsQ0FBTCxHQUFnQixPQURsQjtTQUFBLE1BQUE7d0JBR0UsSUFBQyxDQUFBLE9BQUQsQ0FBUyxJQUFULEVBQWUsSUFBSyxDQUFBLEdBQUEsQ0FBcEIsRUFBMEIsT0FBMUIsR0FIRjtTQUpGO0FBQUE7c0JBRk87SUFBQSxDQUFUO0FBQUEsSUFXQSxpQkFBQSxFQUFtQixTQUFDLFFBQUQsRUFBVyxLQUFYLEdBQUE7QUFDakIsVUFBQSw4RUFBQTtBQUFBLE1BQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7QUFBQSxNQUNBLFlBQUEsR0FBZSxFQURmLENBQUE7QUFBQSxNQUVBLE9BQUEsR0FBYSxLQUFILEdBQWM7QUFBQSxRQUFDLGFBQUEsRUFBZSxLQUFoQjtPQUFkLEdBQTBDLEVBRnBELENBQUE7QUFBQSxNQUdBLE9BQU8sQ0FBQyxJQUFSLEdBQWUsS0FIZixDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsT0FBRCxDQUFTLFlBQVQsRUFBdUIsUUFBdkIsQ0FMQSxDQUFBO0FBTUE7V0FBQSx1QkFBQTtzQ0FBQTtBQUNFLFFBQUEsSUFBRyxDQUFDLENBQUMsT0FBRixDQUFVLEtBQVYsQ0FBSDtBQUNFLFVBQUEsWUFBQSxHQUFrQixLQUFILEdBQWM7QUFBQSxZQUFDLEtBQUEsRUFBTyxLQUFSO1dBQWQsR0FBa0MsRUFBakQsQ0FBQTtBQUFBLFVBQ0EsWUFBQSxHQUFlLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixPQUFoQixFQUF5QixZQUF6QixDQURmLENBQUE7QUFBQSxVQUVBLEtBQUEsR0FBUSxDQUFDLENBQUMsS0FBRixDQUFRLFlBQVIsRUFBc0IsS0FBdEIsQ0FGUixDQURGO1NBQUE7QUFBQSxzQkFJQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsT0FBaEIsRUFBeUIsS0FBekIsRUFBZ0MsT0FBaEMsRUFKQSxDQURGO0FBQUE7c0JBUGlCO0lBQUEsQ0FYbkI7QUFBQSxJQXlCQSxNQUFBLEVBQVEsU0FBQyxRQUFELEdBQUE7QUFDTixVQUFBLDhCQUFBO0FBQUEsTUFBQSxJQUFHLHVCQUFIO0FBQ0UsUUFBQSxRQUFTLENBQUEsR0FBQSxDQUFULEdBQWdCLFFBQVEsQ0FBQyxNQUF6QixDQUFBO0FBQUEsUUFDQSxNQUFBLENBQUEsUUFBZSxDQUFDLE1BRGhCLENBREY7T0FBQTtBQUlBLE1BQUEsSUFBRyxxQkFBSDtBQUNFLFFBQUEsY0FBQSxHQUFpQixRQUFqQixDQUFBO0FBQUEsUUFDQSxRQUFBLEdBQVcsUUFBUyxDQUFBLEdBQUEsQ0FEcEIsQ0FBQTtBQUFBLFFBRUEsTUFBQSxDQUFBLGNBQXNCLENBQUEsR0FBQSxDQUZ0QixDQUFBO0FBSUEsYUFBQSx1QkFBQTswQ0FBQTtBQUFBLFVBQUEsSUFBQyxDQUFBLGlCQUFELENBQW1CLE9BQW5CLEVBQTRCLEtBQTVCLENBQUEsQ0FBQTtBQUFBLFNBTEY7T0FKQTthQVdBLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixRQUFuQixFQVpNO0lBQUEsQ0F6QlI7R0FERixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/sarah/.atom/packages/project-manager/lib/settings.coffee
