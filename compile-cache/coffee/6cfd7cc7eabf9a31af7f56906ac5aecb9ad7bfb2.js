(function() {
  var Debug, Emitter, Minimap, PluginManagement, ViewManagement, semver;

  Emitter = require('emissary').Emitter;

  Debug = require('prolix');

  semver = require('semver');

  ViewManagement = require('./mixins/view-management');

  PluginManagement = require('./mixins/plugin-management');

  require('../vendor/resizeend');

  Minimap = (function() {
    function Minimap() {}

    Emitter.includeInto(Minimap);

    Debug('minimap').includeInto(Minimap);

    ViewManagement.includeInto(Minimap);

    PluginManagement.includeInto(Minimap);

    Minimap.prototype.version = require('../package.json').version;

    Minimap.prototype.configDefaults = {
      plugins: {},
      autoToggle: false,
      displayMinimapOnLeft: false,
      displayCodeHighlights: true,
      minimapScrollIndicator: true,
      lineOverdraw: 10,
      useHardwareAcceleration: true,
      scale: 0.16
    };

    Minimap.prototype.active = false;

    Minimap.prototype.activate = function() {
      atom.workspaceView.command('minimap:toggle', (function(_this) {
        return function() {
          return _this.toggleNoDebug();
        };
      })(this));
      atom.workspaceView.command('minimap:toggle-debug', (function(_this) {
        return function() {
          return _this.toggleDebug();
        };
      })(this));
      atom.workspaceView.command('minimap:open-plugins-list', (function(_this) {
        return function() {
          return atom.workspaceView.getActivePaneView().find('.minimap .open-minimap-plugins-list').click();
        };
      })(this));
      atom.workspaceView.toggleClass('minimap-on-left', atom.config.get('minimap.displayMinimapOnLeft'));
      atom.config.observe('minimap.displayMinimapOnLeft', (function(_this) {
        return function() {
          return atom.workspaceView.toggleClass('minimap-on-left', atom.config.get('minimap.displayMinimapOnLeft'));
        };
      })(this));
      if (atom.config.get('minimap.autoToggle')) {
        return this.toggleNoDebug();
      }
    };

    Minimap.prototype.deactivate = function() {
      this.destroyViews();
      return this.emit('deactivated');
    };

    Minimap.prototype.toggleDebug = function() {
      this.getChannel().activate();
      return this.toggle();
    };

    Minimap.prototype.toggleNoDebug = function() {
      this.getChannel().deactivate();
      return this.toggle();
    };

    Minimap.prototype.versionMatch = function(expectedVersion) {
      return semver.satisfies(this.version, expectedVersion);
    };

    Minimap.prototype.toggle = function() {
      if (this.active) {
        this.active = false;
        return this.deactivate();
      } else {
        this.createViews();
        this.active = true;
        return this.emit('activated');
      }
    };

    return Minimap;

  })();

  module.exports = new Minimap();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlFQUFBOztBQUFBLEVBQUMsVUFBVyxPQUFBLENBQVEsVUFBUixFQUFYLE9BQUQsQ0FBQTs7QUFBQSxFQUNBLEtBQUEsR0FBUSxPQUFBLENBQVEsUUFBUixDQURSLENBQUE7O0FBQUEsRUFFQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVIsQ0FGVCxDQUFBOztBQUFBLEVBSUEsY0FBQSxHQUFpQixPQUFBLENBQVEsMEJBQVIsQ0FKakIsQ0FBQTs7QUFBQSxFQUtBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSw0QkFBUixDQUxuQixDQUFBOztBQUFBLEVBT0EsT0FBQSxDQUFRLHFCQUFSLENBUEEsQ0FBQTs7QUFBQSxFQTRFTTt5QkFDSjs7QUFBQSxJQUFBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLE9BQXBCLENBQUEsQ0FBQTs7QUFBQSxJQUNBLEtBQUEsQ0FBTSxTQUFOLENBQWdCLENBQUMsV0FBakIsQ0FBNkIsT0FBN0IsQ0FEQSxDQUFBOztBQUFBLElBRUEsY0FBYyxDQUFDLFdBQWYsQ0FBMkIsT0FBM0IsQ0FGQSxDQUFBOztBQUFBLElBR0EsZ0JBQWdCLENBQUMsV0FBakIsQ0FBNkIsT0FBN0IsQ0FIQSxDQUFBOztBQUFBLHNCQU1BLE9BQUEsR0FBUyxPQUFBLENBQVEsaUJBQVIsQ0FBMEIsQ0FBQyxPQU5wQyxDQUFBOztBQUFBLHNCQVNBLGNBQUEsR0FDRTtBQUFBLE1BQUEsT0FBQSxFQUFTLEVBQVQ7QUFBQSxNQUNBLFVBQUEsRUFBWSxLQURaO0FBQUEsTUFFQSxvQkFBQSxFQUFzQixLQUZ0QjtBQUFBLE1BR0EscUJBQUEsRUFBdUIsSUFIdkI7QUFBQSxNQUlBLHNCQUFBLEVBQXdCLElBSnhCO0FBQUEsTUFLQSxZQUFBLEVBQWMsRUFMZDtBQUFBLE1BTUEsdUJBQUEsRUFBeUIsSUFO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
//# sourceURL=/Users/sarah/.atom/packages/minimap/lib/minimap.coffee